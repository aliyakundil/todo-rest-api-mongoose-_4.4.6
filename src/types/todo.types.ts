import { ObjectId } from "mongodb";

export interface Todo {
  _id?: ObjectId;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTodoInput {
  text?: string;
  priority?: "low" | "medium" | "high";
  completed?: string | boolean;
}

export interface UpdateTodoInput {
  text: string;
  priority?: "low" | "medium" | "high";
  completed?: string | boolean;
}

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      meta?: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
      };
    }
  | { success: false; error: string; details?: string[] };

export interface PaginationQuery {
  page?: string;
  limit?: string;
  completed?: string;
  priority?: string;
  search?: string;
}
