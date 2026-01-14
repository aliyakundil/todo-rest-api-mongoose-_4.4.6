import type { Request, Response, NextFunction, RequestHandler } from "express";

export function validateCreateTodo(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { text, priority } = req.body;

  const errors: string[] = [];

  if (!text || typeof text !== "string") {
    errors.push("text is required and must be string");
  }

  if (priority && !["low", "medium", "high"].includes(priority))
    errors.push("priority must be low, medium, or high");

  if (errors.length > 0)
    return res
      .status(400)
      .json({ success: false, error: "Validation failed", details: errors });

  next();
}

export function validateUpdateTodo(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { text, completed, priority } = req.body;

  const errors: string[] = [];

  if (text !== undefined)
    if (typeof text !== "string" || text.trim() === "")
      errors.push("text is required and must be string");

  if (completed !== undefined)
    if (
      typeof completed !== "boolean" &&
      completed !== "true" &&
      completed !== "false"
    )
      errors.push("completed is required and must be boolean");

  if (priority !== undefined &&priority && !["low", "medium", "high"].includes(priority))
      errors.push("priority must be low, medium, or high");

  if (errors.length > 0)
    return res
      .status(400)
      .json({ success: false, error: "Validation failed", details: errors });

  next();
}

export function validateTodoId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = req.params.id;

  const errors: string[] = [];

  if (id === undefined) {
    errors.push("id is required");
  } 

  if (errors.length > 0)
    return res
      .status(400)
      .json({ success: false, error: "Validation failed", details: errors });

  next();
}

export function validateTodoQuery(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { page, limit, completed, priority, search } = req.query;

  const errors = [];

  if (page !== undefined)
    if (isNaN(parseInt(page as string)) || parseInt(page as string) <= 0)
      errors.push("страница (page) должна быть целым положительным числом");
  if (limit !== undefined)
    if (
      isNaN(parseInt(limit as string)) ||
      parseInt(limit as string) <= 0 ||
      parseInt(limit as string) > 100
    )
      errors.push("лимит (limit) должен быть числом от 1 до 100");
  if (completed !== undefined)
    if (
      typeof completed !== "boolean" &&
      completed !== "true" &&
      completed !== "false"
    )
      errors.push('параметр completed должен быть "true" или "false"');
  if (priority !== undefined)
    if (priority && !["low", "medium", "high"].includes(priority as string))
      errors.push("приоритет должен быть: low, medium или high");
  if (search !== undefined)
    if (typeof search !== "string" || search.trim().length === 0)
      errors.push("строка поиска не может быть пустой");

  if (errors.length > 0)
    return res
      .status(400)
      .json({ success: false, error: "Validation failed", detailes: errors });

  next();
}

export const validateAndHandle = (validators: RequestHandler[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validator of validators) {
      await new Promise((resolve) => {
        validator(req, res, (err) => {
          if (err) return next(err);
          resolve(null);
        });
      });
      if (res.headersSent) return;
    }
    next();
  };
};
