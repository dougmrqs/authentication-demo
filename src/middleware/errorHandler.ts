import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ApiError extends Error {
  statusCode?: number;
}

export function errorHandler(
  error: ApiError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', error);

  if (error instanceof ZodError) {
    const validationErrors = error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    res.status(400).json({
      error: 'Validation failed',
      details: validationErrors,
    });
    return;
  }

  if (error.statusCode) {
    res.status(error.statusCode).json({
      error: error.message,
    });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
  });
}

export function createApiError(message: string, statusCode: number): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  return error;
}
