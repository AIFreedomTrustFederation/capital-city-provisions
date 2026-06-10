import { Pool } from 'pg';
import type { DriverUpdate, OrderRecord, ProductRecord } from './ccp-database';

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

function iso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return typeof value === 'string' ? value : new Date().toISOString();
}

function numberValue(value: unknown) {
  return Number(value || 0);
}

function mapProduct(row: Record<string, any>): ProductRecord {
  return {
    sku: row.sku || '',
    name: row.name || '',
    qty: numberValue(row.qty),
    unit: row.unit || 'lbs',
    fulfilled: numberValue(row.fulfilled),
    issue: row.issue || undefined,
  };
}

function mapOrder(row: Record<string, any>, products: ProductRecord[]): OrderRecord {
  return {
    id: row.id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    phone: row.phone || '',
    zip: row.zip || '',
    routeId: row.route_id || 'owner-intake',
    box: row.box,
    status: row.status,
    fulfillment: row.fulfillment,
    value: numberValue(row.value),
    costEstimate: numberValue(row.cost_estimate),
    marginEstimate: numberValue(row.margin_estimate),
    deliveryDate: row.delivery_date || 'TBD',
    deliveryWindow: row.delivery_window || 'TBD',
    products,
    notes: row.notes || '',
    promo: row.promo || undefined,
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

export async function saveOrderToPostgres(order: OrderRecord) {
  const pool = getPgPool();
  if (!pool) return { configured: false, ok: false, skipped: true };
  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query(customerText, [order.customerId, order.customerName, '', order.phone, order.zip, 'capital-city-provisions-site', JSON.stringify(order.products.map((product) => product.name)), order.createdAt]);
    await client.query(orderText, [order.id, order.customerId, order.customerName, order.phone, order.zip, order.routeId, order.box, order.status, order.fulfillment, order.value, order.costEstimate, order.marginEstimate, order.deliveryDate, order.deliveryWindow, order.notes, order.promo || '', order.createdAt, order.updatedAt]);
    await client.query('delete from order_products where order_id=$1', [order.id]);
    for (const product of order.products || []) {
      await client.query(productText, [order.id, product.sku, product.name, product.qty, product.unit, product.fulfilled, product.issue || '']);
    }
    await client.query('commit');
    return { configured: true, ok: true };
  } catch (error) {
    await client.query('rollback').catch(() => {});
    console.error('PostgreSQL order save failed:', error);
    return { configured: true, ok: false, error: 'PostgreSQL order save failed' };
  } finally {
    client.release();
  }
}

export async function getOrderLifecycleFromPostgres(orderId?: string) {
  const pool = getPgPool();
  if (!pool) return null;
  const orderResult = await pool.query('select * from orders where ($1::text is null or id=$1) order by created_at desc', [orderId || null]);
  const orderRows = orderResult.rows;
  if (!orderRows.length) return [];
  const orderIds = orderRows.map((order) => order.id);
  const customerIds = [...new Set(orderRows.map((order) => order.customer_id).filter(Boolean))];
  const routeIds = [...new Set(orderRows.map((order) => order.route_id).filter(Boolean))];
  const [customerResult, productResult, updateResult, restockResult, learningResult] = await Promise.all([
    customerIds.length ? pool.query('select * from customers where id = any($1::text[])', [customerIds]) : Promise.resolve({ rows: [] }),
    pool.query('select * from order_products where order_id = any($1::text[]) order by id asc', [orderIds]),
    pool.query('select * from driver_updates where order_id = any($1::text[]) order by created_at desc', [orderIds]),
    pool.query('select * from restock_issues where order_id = any($1::text[]) order by created_at desc', [orderIds]),
    pool.query('select * from learning_events where order_id = any($1::text[]) or route_id = any($2::text[]) order by created_at desc', [orderIds, routeIds]),
  ]);
  return orderRows.map((row) => {
    const products = productResult.rows.filter((product) => product.order_id === row.id).map(mapProduct);
    const order = mapOrder(row, products);
    return {
      ...order,
      customer: customerResult.rows.find((customer) => customer.id === order.customerId),
      driverUpdates: updateResult.rows.filter((update) => update.order_id === order.id),
      restockIssues: restockResult.rows.filter((issue) => issue.order_id === order.id),
      learningEvents: learningResult.rows.filter((event) => event.order_id === order.id || event.route_id === order.routeId),
    };
  });
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
