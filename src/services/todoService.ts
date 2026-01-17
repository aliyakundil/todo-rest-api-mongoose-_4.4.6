import { ObjectId } from "mongodb";
import mongoose, { Model } from "mongoose";

import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  PaginationQuery
} from "@/types/todo.types";

export interface ITodoDocument extends Document {
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    completed: Boolean,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low"
    },
  },
  { timestamps: true }
);

todoSchema.index({ createdAt: -1 });
todoSchema.index({ completed: 1 });

export const ITodo: Model<ITodoDocument> = mongoose.model<ITodoDocument>("Todo", todoSchema);

export async function getTodos(options: PaginationQuery) {
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

  const todos = await ITodo
    .find(filter)
    .sort({ crearedAt: -1 })
    .skip(offset)
    .limit(limit);

  const total = await ITodo.countDocuments(filter);


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
  try {
    const todo = await ITodo.findById(id);
    return todo;
  } catch (err) {
    return null
  }
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {

  if (!input.text || input.text.trim() === "") throw new Error ("Todo text is required")
  const newTodo = new ITodo({
    text: input.text.trim(),
    completed: input.completed === "true" || input.completed === true,
    priority: input.priority ?? "low"
  });

  await newTodo.save();

  return newTodo;
}

export async function updateTodo(id: string, input: UpdateTodoInput): Promise<Todo | null> {
  const todoUpdate = await ITodo.findOne({ _id : new ObjectId(id)});

  if (!todoUpdate) return null;

  if (input.text !== undefined) todoUpdate.text = input.text.trim();
  if (input.completed !== undefined)
    todoUpdate.completed =
      typeof input.completed === "string"
        ? input.completed === "true"
        : input.completed;
  if (input.priority !== undefined) todoUpdate.priority = input.priority;
  todoUpdate.updatedAt = new Date();

  await todoUpdate.save();

  return todoUpdate;
}

export async function patchTodo(id: string, input: Partial<UpdateTodoInput>): Promise<Todo | null> {
  const todoPatch = await ITodo.findOne({ _id : new ObjectId(id)});

  if (!todoPatch) return null;

  if (input.text !== undefined) todoPatch.text = input.text.trim();
  if (input.completed !== undefined)
    todoPatch.completed =
      typeof input.completed === "string"
        ? input.completed === "true"
        : input.completed;
  if (input.priority !== undefined) todoPatch.priority = input.priority;
  todoPatch.updatedAt = new Date();

  const update = await ITodo.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: todoPatch },
      { returnDocument: "after" } 
  )

  return update ?? null;
}

export async function deleteTodo(id: string): Promise<boolean> {
  const result = await ITodo.deleteOne({ _id : new ObjectId(id)});
  return result.deletedCount === 1;
}

export async function getStats() {
  const total = await ITodo.find().countDocuments();
  const completed = await ITodo.find({"completed": true}).countDocuments();
  const pending = await ITodo.find({"completed": false}).countDocuments();
  const low = await ITodo.find({"priority": "low"}).countDocuments();
  const medium = await ITodo.find({"priority": "medium"}).countDocuments();
  const high = await ITodo.find({"priority": "high"}).countDocuments();
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