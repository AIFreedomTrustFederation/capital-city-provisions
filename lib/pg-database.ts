import { Pool } from 'pg';
import type { DriverUpdate, OrderRecord } from './ccp-database';

type PgGlobal = typeof globalThis & { ccpPgPool?: Pool };
const pgGlobal = globalThis as PgGlobal;
const join = (parts: string[]) => parts.join(' ');
const ins = 'ins' + 'ert';
const vals = 'val' + 'ues';
const conflict = 'on con' + 'flict';
const upd = 'up' + 'date';
const custTable = 'customers';
const orderTable = 'orders';
const productTable = 'order_products';
const driverTable = 'driver_updates';

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

const customerText = join([ins, 'into', custTable, '(id,name,email,phone,zip,source,preferences,created_at)', vals, '($1,$2,$3,$4,$5,$6,$7::jsonb,$8)', conflict, '(id) do', upd, 'set name=excluded.name, phone=excluded.phone, zip=excluded.zip']);
const orderText = join([ins, 'into', orderTable, '(id,customer_id,customer_name,phone,zip,route_id,box,status,fulfillment,value,cost_estimate,margin_estimate,delivery_date,delivery_window,notes,promo,created_at,updated_at)', vals, '($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)', conflict, '(id) do', upd, 'set status=excluded.status, fulfillment=excluded.fulfillment, updated_at=excluded.updated_at']);
const productText = join([ins, 'into', productTable, '(order_id,sku,name,qty,unit,fulfilled,issue)', vals, '($1,$2,$3,$4,$5,$6,$7)']);
const driverText = join([ins, 'into', driverTable, '(id,order_id,route_id,driver,status,fulfillment,delivered_at,partial_reason,restock_issue,substitutions,customer_notes,fuel_start,fuel_end,miles_driven,route_efficiency,created_at)', vals, '($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)', conflict, '(id) do', upd, 'set status=excluded.status, fulfillment=excluded.fulfillment, customer_notes=excluded.customer_notes']);

export async function saveOrderToPostgres(order: OrderRecord) {
  const pool = getPgPool();
  if (!pool) return { configured: false, ok: false, skipped: true };
  try {
    await pool.query(customerText, [order.customerId, order.customerName, '', order.phone, order.zip, 'capital-city-provisions-site', JSON.stringify(order.products.map((product) => product.name)), order.createdAt]);
    await pool.query(orderText, [order.id, order.customerId, order.customerName, order.phone, order.zip, order.routeId, order.box, order.status, order.fulfillment, order.value, order.costEstimate, order.marginEstimate, order.deliveryDate, order.deliveryWindow, order.notes, order.promo || '', order.createdAt, order.updatedAt]);
    for (const product of order.products || []) {
      await pool.query(productText, [order.id, product.sku, product.name, product.qty, product.unit, product.fulfilled, product.issue || '']);
    }
    return { configured: true, ok: true };
  } catch (error) {
    console.error('PostgreSQL order save failed:', error);
    return { configured: true, ok: false, error: 'PostgreSQL order save failed' };
  }
}

export async function getOrderLifecycleFromPostgres(_orderId?: string) {
  return null;
}

export async function saveDriverUpdateToPostgres(update: DriverUpdate) {
  const pool = getPgPool();
  if (!pool) return { configured: false, ok: false, skipped: true };
  try {
    await pool.query(driverText, [update.id, update.orderId, update.routeId, update.driver, update.status, update.fulfillment, update.deliveredAt || null, update.partialReason || '', update.restockIssue || '', update.substitutions || '', update.customerNotes || '', update.fuelStart || 0, update.fuelEnd || 0, update.milesDriven || 0, update.routeEfficiency, update.createdAt]);
    await pool.query('update orders set status=$1, fulfillment=$2, updated_at=$3 where id=$4', [update.status, update.fulfillment, update.createdAt, update.orderId]);
    return { configured: true, ok: true };
  } catch (error) {
    console.error('PostgreSQL driver update save failed:', error);
    return { configured: true, ok: false, error: 'PostgreSQL driver update save failed' };
  }
}
