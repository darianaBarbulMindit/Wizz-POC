import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const config = {
  databricks: {
    host: required('DATABRICKS_HOST'),
    httpPath: required('DATABRICKS_HTTP_PATH'),
    token: optional('DATABRICKS_TOKEN', ''), // only needed for local dev fallback
    catalog: optional('DATABRICKS_CATALOG', 'catalog_ymtuipoc_dev_midas_001'),
    schema: optional('DATABRICKS_SCHEMA', 'samples'),
    table: optional('DATABRICKS_TABLE', 'data_extract_with_flight_details'),
    jobIdBulkUpdate: optional('DATABRICKS_JOB_ID_BULK_UPDATE', ''),
  },
  server: {
    port: parseInt(optional('PORT', '8000'), 10),
    staticDir: optional('STATIC_DIR', '../frontend/dist/browser'),
  },
  bulkSyncThreshold: parseInt(optional('BULK_SYNC_THRESHOLD', '500'), 10),
  nodeEnv: optional('NODE_ENV', 'development'),
} as const;
