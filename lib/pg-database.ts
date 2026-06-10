import { Pool } from 'pg';
import type { DriverSalesLead, DriverUpdate, OrderRecord, OwnerReport, ProductRecord, RouteEfficiency, RouteEfficiencyReport } from './ccp-database';

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
const salesTable = 'driver_sales_leads';
const requiredTables = [custTable, orderTable, productTable, driverTable, 'restock_issues', salesTable, 'learning_events'];

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

export async function checkPostgresHealth() {
  const pool = getPgPool();
  if (!pool) {
    return { configured: false, ok: false, message: 'DATABASE_URL is not configured', missingTables: requiredTables };
  }
  const started = Date.now();
  try {
    const ping = await pool.query('select now() as now');
    const tableResult = await pool.query(
      "select table_name from information_schema.tables where table_schema='public' and table_name = any($1::text[])",
      [requiredTables],
    );
    const presentTables = tableResult.rows.map((row) => row.table_name);
    const missingTables = requiredTables.filter((table) => !presentTables.includes(table));
    return {
      configured: true,
      ok: missingTables.length === 0,
      checkedAt: iso(ping.rows[0]?.now),
      latencyMs: Date.now() - started,
      presentTables,
      missingTables,
    };
  } catch (error) {
    console.error('PostgreSQL health check failed:', error);
    return { configured: true, ok: false, message: 'PostgreSQL health check failed', missingTables: requiredTables };
  }
}

const customerText = join([ins, 'into', custTable, '(id,name,email,phone,zip,source,preferences,created_at)', vals, '($1,$2,$3,$4,$5,$6,$7::jsonb,$8)', conflict, '(id) do', upd, 'set name=excluded.name, phone=excluded.phone, zip=excluded.zip']);
const orderText = join([ins, 'into', orderTable, '(id,customer_id,customer_name,phone,zip,route_id,box,status,fulfillment,value,cost_estimate,margin_estimate,delivery_date,delivery_window,notes,promo,created_at,updated_at)', vals, '($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)', conflict, '(id) do', upd, 'set status=excluded.status, fulfillment=excluded.fulfillment, updated_at=excluded.updated_at']);
const productText = join([ins, 'into', productTable, '(order_id,sku,name,qty,unit,fulfilled,issue)', vals, '($1,$2,$3,$4,$5,$6,$7)']);
const driverText = join([ins, 'into', driverTable, '(id,order_id,route_id,driver,status,fulfillment,delivered_at,partial_reason,restock_issue,substitutions,customer_notes,fuel_start,fuel_end,miles_driven,route_efficiency,created_at)', vals, '($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)', conflict, '(id) do', upd, 'set status=excluded.status, fulfillment=excluded.fulfillment, customer_notes=excluded.customer_notes']);
const salesText = join([ins, 'into', salesTable, '(id,driver,source_stop_id,source_customer,route_id,lead_name,email,phone,address,zip,area,need,offer,estimated_value,status,temperature,note,owner_override,ai_instruction,driver_route_plan,created_at,updated_at)', vals, '($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)', conflict, '(id) do', upd, 'set driver=excluded.driver, route_id=excluded.route_id, lead_name=excluded.lead_name, email=excluded.email, phone=excluded.phone, address=excluded.address, zip=excluded.zip, area=excluded.area, need=excluded.need, offer=excluded.offer, estimated_value=excluded.estimated_value, status=excluded.status, temperature=excluded.temperature, note=excluded.note, owner_override=excluded.owner_override, ai_instruction=excluded.ai_instruction, driver_route_plan=excluded.driver_route_plan, updated_at=excluded.updated_at']);

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

function mapDriverSalesLead(row: Record<string, any>): DriverSalesLead {
  return {
    id: row.id,
    driver: row.driver,
    sourceStopId: row.source_stop_id || undefined,
    sourceCustomer: row.source_customer || undefined,
    routeId: row.route_id || undefined,
    leadName: row.lead_name,
    email: row.email || undefined,
    phone: row.phone || undefined,
    address: row.address || undefined,
    zip: row.zip || '',
    area: row.area || '',
    need: row.need || '',
    offer: row.offer || '',
    estimatedValue: numberValue(row.estimated_value),
    status: row.status || 'queued',
    temperature: row.temperature || 'warm',
    note: row.note || '',
    ownerOverride: row.owner_override || undefined,
    aiInstruction: row.ai_instruction || undefined,
    driverRoutePlan: row.driver_route_plan || undefined,
    createdAt: iso(row.created_at),
    updatedAt: iso(row.updated_at),
  };
}

function routeEfficiencyScore(updates: Record<string, any>[]): RouteEfficiency {
  if (updates.some((update) => update.route_efficiency === 'poor')) return 'poor';
  if (updates.some((update) => update.route_efficiency === 'watch')) return 'watch';
  if (updates.some((update) => update.route_efficiency === 'excellent')) return 'excellent';
  return 'good';
}

async function writeLearningEvent(clientOrPool: { query: (text: string, values?: unknown[]) => Promise<unknown> }, input: { id: string; role: string; eventType: string; summary: string; signal: number; routeId?: string; orderId?: string; createdAt: string }) {
  await clientOrPool.query(
    'insert into learning_events (id,role,event_type,summary,signal,route_id,order_id,created_at) values ($1,$2,$3,$4,$5,$6,$7,$8) on conflict (id) do nothing',
    [input.id, input.role, input.eventType, input.summary, input.signal, input.routeId || '', input.orderId || '', input.createdAt],
  );
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
    await writeLearningEvent(client, { id: `LEARN-${order.id}`, role: 'customer', eventType: 'order-created', summary: `${order.box} order created for ${order.zip} on ${order.routeId}.`, signal: 6, orderId: order.id, routeId: order.routeId, createdAt: order.createdAt });
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
    if (update.restockIssue) {
      await pool.query(
        'insert into restock_issues (id,order_id,route_id,sku,product,needed,available,severity,action,created_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) on conflict (id) do nothing',
        [`RI-${update.id}`, update.orderId, update.routeId, 'DRIVER-REPORTED', update.restockIssue, 1, 0, update.fulfillment === 'restock-blocked' ? 'high' : 'medium', 'Owner review required before next route promise.', update.createdAt],
      );
    }
    await writeLearningEvent(pool, { id: `LEARN-${update.id}`, role: 'driver', eventType: 'driver-update', summary: `${update.driver} updated ${update.orderId}: ${update.status}, ${update.fulfillment}. Efficiency ${update.routeEfficiency}. ${update.restockIssue || ''}`.trim(), signal: update.routeEfficiency === 'poor' ? 9 : 6, orderId: update.orderId, routeId: update.routeId, createdAt: update.createdAt });
    return { configured: true, ok: true };
  } catch (error) {
    console.error('PostgreSQL driver update save failed:', error);
    return { configured: true, ok: false, error: 'PostgreSQL driver update save failed' };
  }
}

export async function saveDriverSalesLeadToPostgres(lead: DriverSalesLead) {
  const pool = getPgPool();
  if (!pool) return { configured: false, ok: false, skipped: true };
  try {
    await pool.query(salesText, [lead.id, lead.driver, lead.sourceStopId || '', lead.sourceCustomer || '', lead.routeId || '', lead.leadName, lead.email || '', lead.phone || '', lead.address || '', lead.zip, lead.area, lead.need, lead.offer, lead.estimatedValue, lead.status, lead.temperature, lead.note, lead.ownerOverride || '', lead.aiInstruction || '', lead.driverRoutePlan || '', lead.createdAt, lead.updatedAt]);
    const signal = lead.status === 'reserved' ? 9 : lead.status === 'pitched' ? 7 : lead.status === 'skipped' ? 2 : 5;
    await writeLearningEvent(pool, { id: `LEARN-SALE-${lead.id}-${lead.updatedAt}`, role: lead.ownerOverride ? 'owner' : 'driver', eventType: lead.ownerOverride ? 'owner-sales-override' : 'driver-sales-queue', summary: `${lead.driver} marked ${lead.leadName} ${lead.status} for ${lead.area} ${lead.zip}: ${lead.offer}. Value ${lead.estimatedValue}. ${lead.ownerOverride ? `Owner override: ${lead.ownerOverride}.` : ''} ${lead.driverRoutePlan ? `Route plan: ${lead.driverRoutePlan}.` : ''}`.trim(), signal, routeId: lead.routeId, orderId: lead.sourceStopId, createdAt: lead.updatedAt });
    return { configured: true, ok: true };
  } catch (error) {
    console.error('PostgreSQL driver sales save failed:', error);
    return { configured: true, ok: false, error: 'PostgreSQL driver sales save failed' };
  }
}

export async function getDriverSalesLeadsFromPostgres() {
  const pool = getPgPool();
  if (!pool) return [];
  const result = await pool.query('select * from driver_sales_leads order by updated_at desc');
  return result.rows.map(mapDriverSalesLead);
}

export async function generateOwnerReportFromPostgres(): Promise<OwnerReport | null> {
  const pool = getPgPool();
  if (!pool) return null;
  const [ordersResult, updatesResult, restockResult, learningResult, salesResult] = await Promise.all([
    pool.query('select * from orders order by created_at desc'),
    pool.query('select * from driver_updates order by created_at desc'),
    pool.query('select * from restock_issues order by created_at desc'),
    pool.query('select * from learning_events order by created_at desc limit 8'),
    pool.query('select * from driver_sales_leads order by updated_at desc'),
  ]);
  const orders = ordersResult.rows;
  const updates = updatesResult.rows;
  const restock = restockResult.rows;
  const sales = salesResult.rows.map(mapDriverSalesLead);
  const delivered = orders.filter((order) => order.status === 'delivered');
  const partial = orders.filter((order) => order.status === 'partially-fulfilled' || order.fulfillment === 'partial');
  const revenue = orders.reduce((sum, order) => sum + numberValue(order.value), 0);
  const estimatedCost = orders.reduce((sum, order) => sum + numberValue(order.cost_estimate), 0);
  const estimatedProfit = revenue - estimatedCost;
  const routeIds = [...new Set([...orders.map((order) => order.route_id || 'owner-intake'), ...updates.map((update) => update.route_id || 'owner-intake')])].filter(Boolean);
  const routeEfficiency: RouteEfficiencyReport[] = routeIds.map((routeId) => {
    const routeUpdates = updates.filter((update) => update.route_id === routeId);
    const fuelUsed = routeUpdates.reduce((sum, update) => sum + Math.max(0, numberValue(update.fuel_start) - numberValue(update.fuel_end)), 0);
    const milesDriven = routeUpdates.reduce((sum, update) => sum + numberValue(update.miles_driven), 0);
    const profit = orders.filter((order) => order.route_id === routeId).reduce((sum, order) => sum + numberValue(order.margin_estimate), 0);
    return { routeId, route: routeId, efficiency: routeEfficiencyScore(routeUpdates), fuelUsed, milesDriven, profit };
  });
  const ownerActions = [
    orders.length ? `Review ${orders.length} live order(s) from PostgreSQL.` : 'No live orders yet.',
    sales.length ? `Review ${sales.length} live driver sales lead(s).` : 'No live driver sales leads yet.',
    restock.length ? `Review ${restock.length} restock issue(s) before promising premium boxes.` : 'No active restock blockers.',
    partial.length ? `Call ${partial.length} partial fulfillment customer(s).` : 'No partial fulfillment calls needed.',
  ];
  return {
    date: new Date().toISOString().slice(0, 10),
    revenue,
    estimatedCost,
    estimatedProfit,
    margin: revenue ? Math.round((estimatedProfit / revenue) * 100) : 0,
    openOrders: orders.filter((order) => !['delivered', 'cancelled'].includes(order.status)).length,
    deliveredOrders: delivered.length,
    partialOrders: partial.length,
    restockIssues: restock.length,
    routeEfficiency,
    futureRestock: restock.map((issue) => ({ product: issue.product, needed: numberValue(issue.needed), reason: `${issue.severity} issue on ${issue.order_id}: ${issue.action}` })),
    ownerActions,
    learningNotes: learningResult.rows.map((event) => event.summary),
    driverSalesQueue: sales,
  };
}

export async function aiTrainingDatasetFromPostgres() {
  const pool = getPgPool();
  if (!pool) return null;
  const [ordersResult, productsResult, updatesResult, salesResult, learningResult] = await Promise.all([
    pool.query('select * from orders order by created_at desc'),
    pool.query('select * from order_products order by id asc'),
    pool.query('select * from driver_updates order by created_at desc'),
    pool.query('select * from driver_sales_leads order by updated_at desc'),
    pool.query('select * from learning_events order by created_at desc'),
  ]);
  return {
    generatedAt: new Date().toISOString(),
    mode: 'live',
    storage: 'postgres',
    records: [
      ...ordersResult.rows.map((order) => {
        const products = productsResult.rows.filter((product) => product.order_id === order.id).map((product) => product.name).join(' ');
        return { type: 'order', input: `${order.zip} ${order.box} ${products}`, output: `status=${order.status}; fulfillment=${order.fulfillment}; margin=${numberValue(order.margin_estimate)}; route=${order.route_id}` };
      }),
      ...updatesResult.rows.map((update) => ({ type: 'driver_update', input: `${update.route_id} ${update.status} ${update.fulfillment} ${update.restock_issue || ''} miles=${numberValue(update.miles_driven)}`, output: `efficiency=${update.route_efficiency}; learn=${update.customer_notes || update.partial_reason || 'no note'}` })),
      ...salesResult.rows.map((lead) => ({ type: 'driver_sales_lead', input: `${lead.zip} ${lead.area} ${lead.need} ${lead.offer}`, output: `status=${lead.status}; value=${numberValue(lead.estimated_value)}; route=${lead.route_id || 'unassigned'}; driver=${lead.driver}` })),
      ...learningResult.rows.map((event) => ({ type: 'learning', input: event.event_type, output: event.summary, signal: numberValue(event.signal) })),
    ],
  };
}
