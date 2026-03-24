import { DBSQLClient } from '@databricks/sql';
import type IDBSQLSession from '@databricks/sql/dist/contracts/IDBSQLSession.js';
import { config } from '../config.js';

interface SessionEntry {
  token: string;
  client: DBSQLClient;
  session: IDBSQLSession;
}

// Cache one session per token — reused across requests while the token is valid.
const sessionCache = new Map<string, SessionEntry>();

async function openSession(token: string): Promise<IDBSQLSession> {
  const client = new DBSQLClient();
  if (token === '__local__') {
    await client.connect({
      host:      config.databricks.host.replace('https://', ''),
      path:      config.databricks.httpPath,
      authType:  'databricks-oauth',
    } as Parameters<DBSQLClient['connect']>[0]);
  } else {
    await client.connect({
      host:  config.databricks.host.replace('https://', ''),
      path:  config.databricks.httpPath,
      token,
    });
  }
  const session = await client.openSession({
    initialCatalog: config.databricks.catalog,
    initialSchema:  config.databricks.schema,
  });
  sessionCache.set(token, { token, client, session });
  return session;
}

export async function getSession(token: string): Promise<IDBSQLSession> {
  const cached = sessionCache.get(token);

  if (cached) {
    // Probe to detect stale session (e.g. token expired or warehouse stopped).
    try {
      const op = await cached.session.executeStatement('SELECT 1', { runAsync: false });
      await op.close();
      return cached.session;
    } catch {
      console.warn('[db] Session probe failed, reconnecting...');
      await closeSession(token).catch(() => {});
    }
  }

  return openSession(token);
}

export async function closeSession(token: string): Promise<void> {
  const entry = sessionCache.get(token);
  if (!entry) return;
  sessionCache.delete(token);
  await entry.session.close().catch(() => {});
  await entry.client.close().catch(() => {});
}

export async function closeAllSessions(): Promise<void> {
  await Promise.all([...sessionCache.keys()].map(closeSession));
}
