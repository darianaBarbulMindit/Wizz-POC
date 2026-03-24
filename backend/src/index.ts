import { createApp }        from './app.js';
import { closeAllSessions } from './db/client.js';
import { config }           from './config.js';

const app    = createApp();
const server = app.listen(config.server.port, () => {
  console.log(`[startup] Server listening on port ${config.server.port} (${config.nodeEnv})`);
  console.log('[startup] DB sessions will be opened on first request using X-Forwarded-Access-Token');
});

async function shutdown(signal: string) {
  console.log(`[shutdown] Received ${signal}, shutting down...`);
  server.close(async () => {
    await closeAllSessions();
    console.log('[shutdown] Done.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
