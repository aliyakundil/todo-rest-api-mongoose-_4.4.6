import { ObjectId } from "mongodb";
import { getDb } from "../config/database";

import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  PaginationQuery
} from "@/types/todo.types";

export async function getTodos(options: PaginationQuery) {
  const db = getDb();
  const page = options.page ? parseInt(options.page) : 1;
  const limit = options.limit ? parseInt(options.limit) : 10;
  const offset = (page - 1) * limit;

  const filter: any = {};

  let completedFilter: boolean | undefined;

  if (options.completed !== undefined) {
    completedFilter = options.completed === "true";
  }

  if (options.completed !== undefined) {
    filter.completed = options.completed === "true";
  }

  if (options.priority !== undefined) {
    filter.priority = options.priority;
  }

  if (options.search) {
    if (!filter.text.toLowerCase().includes(options.search.toLowerCase()))
      filter.text = { $regex: options.search, $options: "i" };
  }

  const todos = await db.collection('todos')
    .find(filter)
    .skip(offset)
    .limit(limit)
    .toArray() as Todo[];

  const total = await db.collection<Todo>("todos").countDocuments(filter);


  return {
    todos: todos,
    meta: {
      total: total,
      page: page,
      limit: limit,
      totalPage: Math.ceil(total/ limit),
    },
  };
}

export async function getTodoById(id: string): Promise<Todo | null> {
  const db = getDb();
  if (!ObjectId.isValid(id)) return null;
  const todo = await db.collection<Todo>('todos').findOne({ _id : new ObjectId(id)}) as Todo;
  return todo;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const db = getDb();

  if (!input.text || input.text.trim() === "") throw new Error ("Todo text is required")
  const newTodo: Todo = {
    text: input.text.trim(),
    completed: input.completed === "true" || input.completed === true,
    priority: input.priority ?? "low",
    createdAt: new Date(),
  } as Todo;

  const result = await db.collection<Todo>("todos").insertOne(newTodo)
  newTodo._id = result.insertedId;

  return newTodo;
}

export async function updateTodo(id: string, input: UpdateTodoInput): Promise<Todo | null> {
  const db = getDb();
  const todoUpdate = await db.collection<Todo>('todos').findOne({ _id : new ObjectId(id)});

  if (!todoUpdate) return null;

  if (input.text !== undefined) todoUpdate.text = input.text.trim();
  if (input.completed !== undefined)
    todoUpdate.completed =
      typeof input.completed === "string"
        ? input.completed === "true"
        : input.completed;
  if (input.priority !== undefined) todoUpdate.priority = input.priority;
  todoUpdate.updatedAt = new Date();

  db.collection<Todo>('todos').updateOne({}, {$set: todoUpdate})

  return todoUpdate;
}

export async function patchTodo(id: string, input: Partial<UpdateTodoInput>): Promise<Todo | null> {
  const db = getDb();
  const todoPatch = await db.collection<Todo>('todos').findOne({ _id : new ObjectId(id)});

  if (!todoPatch) return null;

  if (input.text !== undefined) todoPatch.text = input.text.trim();
  if (input.completed !== undefined)
    todoPatch.completed =
      typeof input.completed === "string"
        ? input.completed === "true"
        : input.completed;
  if (input.priority !== undefined) todoPatch.priority = input.priority;
  todoPatch.updatedAt = new Date();

  db.collection<UpdateTodoInput>("todos").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: todoPatch },
      { returnDocument: "after" } 
  )

  return todoPatch ?? null;
}

export async function deleteTodo(id: string): Promise<boolean> {
  const db = getDb();
  const result = await db.collection<Todo>('todos').deleteOne({ _id : new ObjectId(id)});
  return result.deletedCount === 1;
}

export async function getStats() {
  const db = getDb();
  const total = await db.collection<Todo>("todos").find().count();
  const completed = await db.collection<Todo>('todos').find({"completed": true}).count();
  const pending = await db.collection<Todo>('todos').find({"completed": false}).count();
  const low = await db.collection<Todo>('todos').find({"priority": "low"}).count();
  const medium = await db.collection<Todo>('todos').find({"priority": "medium"}).count();
  const high = await db.collection<Todo>('todos').find({"priority": "high"}).count();
  return {
    total: total,
    completed: completed,
    pending: pending,
    byPriority: {
      low: low,
      medium: medium,
      high: high,
    },
  };
}