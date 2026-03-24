import { getSession } from './client.js';

export async function executeQuery<T>(token: string, sql: string): Promise<T[]> {
  const session = await getSession(token);
  const operation = await session.executeStatement(sql, {
    runAsync: false,
    queryTimeout: BigInt(60),
  });

  const result = await operation.fetchAll();
  await operation.close();

  return (result ?? []) as T[];
}

export async function executeUpdate(token: string, sql: string): Promise<void> {
  const session = await getSession(token);
  const operation = await session.executeStatement(sql, {
    runAsync: false,
    queryTimeout: BigInt(60),
  });

  await operation.fetchAll();
  await operation.close();
}
