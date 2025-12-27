import type { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  status?: number;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // статус по умолчанию
  const status = err.status || 500;

  // Логирование ошибки
  console.error("Error:", {
    message: err.message,
    status,
    stack: err.stack,
  });

  // отправка json клиенту
  res.status(status).json({
    success: false,
    error: err.message,
  });
}

// Middleware для обработки несуществующих маршрутов
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: "Not found!",
    message: `Route ${req.originalUrl} does not exist`,
  });
}
