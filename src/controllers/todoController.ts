import type { NextFunction, Request, Response } from "express";
import * as todoService from "@/services/todoService";
import type {
  CreateTodoInput,
  UpdateTodoInput,
  PaginationQuery,
  ApiResponse,
  Todo,
} from "@/types/todo.types";

export function getTodos(
  req: Request<{}, {}, {}, PaginationQuery>,
  res: Response<ApiResponse<{ todos: Todo[]; meta: any }>>,
) {
  const result = todoService.getTodos(req.query);

  res.json({
    success: true,
    data: {
      todos: result.todos,
      meta: result.meta,
    },
  });
}

export function getTodoById(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Todo>>,
) {
  const id = Number(req.params.id);
  const todo = todoService.getTodoById(id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      error: "Todo not found",
    });
  }

  res.json({
    success: true,
    data: todo,
  });
}

export function createTodo(
  req: Request<{}, {}, CreateTodoInput>,
  res: Response<ApiResponse<Todo>>,
) {
  const todo = todoService.createTodo(req.body);

  res.status(201).json({
    success: true,
    data: todo,
  });
}

export function updateTodo(
  req: Request<{ id: string }, {}, UpdateTodoInput>,
  res: Response<ApiResponse<Todo>>,
) {
  const id = Number(req.params.id);
  const updated = todoService.updateTodo(id, req.body);

  if (!updated) {
    return res.status(404).json({
      success: false,
      error: "Todo not found",
    });
  }

  res.json({
    success: true,
    data: updated,
  });
}

export function patchTodo(
  req: Request<{ id: string }, {}, Partial<UpdateTodoInput>>,
  res: Response<ApiResponse<Todo>>,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    const body = req.body;

    if(!body || Object.keys(body).length === 0) {
      const err = new Error("Body не может быть пустым");
      (err as any).status = 400;
      return next(err)
    }

    const updated = todoService.patchTodo(id, req.body);

    if (!updated) {
      const err = new Error('Not Found');
      (err as any).status = 400;
      return next(err);
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch(error) {
    next(error);
  }
}

export function deleteTodo(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<null>>,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const deleted = todoService.deleteTodo(id);

    if (!deleted) {
      const err = new Error("Todo not found");
      (err as any).status = 404;
      return next(err);
    }

    return res.status(404).send;
  } catch(error) {
    next(error);
  }
}

export function getStats(_req: Request, res: Response<ApiResponse<any>>) {
  const stats = todoService.getStats();

  res.json({
    success: true,
    data: stats,
  });
}
