import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

export function userPassthrough(req: Request, res: Response, next: NextFunction): void {
  // In production (Databricks Apps), the runtime injects both headers automatically.
  // In local dev, fall back to the static token from .env.
  const forwardedToken = req.headers['x-forwarded-access-token'];
  const databricksUser = req.headers['x-databricks-user'];

  res.locals['token'] = typeof forwardedToken === 'string'
    ? forwardedToken
    : config.databricks.token || '__local__';

  res.locals['databricksUser'] = typeof databricksUser === 'string'
    ? databricksUser
    : 'local-dev';

  next();
}
