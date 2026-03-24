import express from 'express';
import path from 'path';
import { userPassthrough } from './middleware/userPassthrough.js';
import { errorHandler } from './middleware/errorHandler.js';
import { config } from './config.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(userPassthrough);

  // Serve Angular static files in production
  if (config.nodeEnv === 'production') {
    const staticDir = path.resolve(config.server.staticDir);
    app.use(express.static(staticDir));

    // SPA fallback — all non-/api routes serve index.html
    app.get(/^(?!\/api).*$/, (_req, res) => {
      res.sendFile(path.join(staticDir, 'index.html'));
    });
  }

  app.use(errorHandler);

  return app;
}
