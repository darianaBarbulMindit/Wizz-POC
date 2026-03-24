import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const message = err instanceof Error ? err.message : 'Unexpected error';
  const stack   = err instanceof Error ? err.stack : undefined;

  console.error('[error]', message, config.nodeEnv !== 'production' ? stack : '');

  res.status(500).json({
    error:   'InternalError',
    message: config.nodeEnv === 'production' ? 'An unexpected error occurred.' : message,
  });
}
