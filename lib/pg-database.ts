import { Pool } from 'pg';
import type { DriverUpdate, OrderRecord } from './ccp-database';

type PgGlobal = typeof globalThis & { ccpPgPool?: Pool };
const pgGlobal = globalThis as PgGlobal;

export function postgresConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPgPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pgGlobal.ccpPgPool) {
    pgGlobal.ccpPgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
    });
  }
  return pgGlobal.ccpPgPool;
}

export async function saveOrderToPostgres(_order: OrderRecord) {
  return { configured: postgresConfigured(), ok: false, skipped: true };
}

export async function getOrderLifecycleFromPostgres(_orderId?: string) {
  return null;
}

export async function saveDriverUpdateToPostgres(_update: DriverUpdate) {
  return { configured: postgresConfigured(), ok: false, skipped: true };
}
