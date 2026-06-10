import { Pool } from 'pg';
import type { OrderRecord } from './ccp-database';

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

export async function saveOrderToPostgres(order: OrderRecord) {
  const pool = getPgPool();

  if (!pool) {
    return { configured: false, ok: false, skipped: true };
  }

  try {
    await pool.query(
      `
      INSERT INTO customers
      (id,name,email,phone,zip,source,preferences,created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8)
      ON CONFLICT (id) DO NOTHING
      `,
      [
        order.customerId,
        order.customerName,
        '',
        order.phone,
        order.zip,
        'capital-city-provisions-site',
        JSON.stringify(order.products.map(product => product.name)),
        order.createdAt,
      ]
    );

    await pool.query(
      `
      INSERT INTO orders
      (
        id, customer_id, customer_name, phone, zip, route_id, box,
        status, fulfillment, value, cost_estimate, margin_estimate,
        delivery_date, delivery_window, notes, promo, created_at, updated_at
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      ON CONFLICT (id) DO NOTHING
      `,
      [
        order.id,
        order.customerId,
        order.customerName,
        order.phone,
        order.zip,
        order.routeId,
        order.box,
        order.status,
        order.fulfillment,
        order.value,
        order.costEstimate,
        order.marginEstimate,
        order.deliveryDate,
        order.deliveryWindow,
        order.notes,
        order.promo || '',
        order.createdAt,
        order.updatedAt,
      ]
    );

    for (const product of order.products || []) {
      await pool.query(
        `
        INSERT INTO order_products
        (order_id,sku,name,qty,unit,fulfilled,issue)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
          order.id,
          product.sku,
          product.name,
          product.qty,
          product.unit,
          product.fulfilled,
          product.issue || '',
        ]
      );
    }

    return { configured: true, ok: true };
  } catch (error) {
    console.error('PostgreSQL order save failed:', error);
    return { configured: true, ok: false };
  }
}

export async function getOrderLifecycleFromPostgres() {
  return null;
}
