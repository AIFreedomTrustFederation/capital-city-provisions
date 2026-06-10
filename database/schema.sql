-- Capital City Provisions open-source system database schema
-- Target: PostgreSQL-compatible open-source databases.
-- Live database starts empty. Apply schema only, then records are created by real customer/order/driver activity.

create table if not exists customers (
  id text primary key,
  name text not null,
  email text default '',
  phone text default '',
  zip text default '',
  source text default 'unknown',
  preferences jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  customer_id text references customers(id),
  customer_name text not null,
  phone text default '',
  zip text default '',
  route_id text default 'waitlist',
  box text not null,
  status text not null default 'ordered',
  fulfillment text not null default 'pending',
  value numeric(12,2) not null default 0,
  cost_estimate numeric(12,2) not null default 0,
  margin_estimate numeric(12,2) not null default 0,
  delivery_date text default 'TBD',
  delivery_window text default 'TBD',
  notes text default '',
  promo text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_products (
  id bigserial primary key,
  order_id text not null references orders(id) on delete cascade,
  sku text not null,
  name text not null,
  qty numeric(12,2) not null default 0,
  unit text not null default 'lbs',
  fulfilled numeric(12,2) not null default 0,
  issue text default ''
);

create table if not exists driver_updates (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  route_id text not null,
  driver text not null,
  status text not null,
  fulfillment text not null,
  delivered_at timestamptz,
  partial_reason text default '',
  restock_issue text default '',
  substitutions text default '',
  customer_notes text default '',
  fuel_start numeric(8,2) default 0,
  fuel_end numeric(8,2) default 0,
  miles_driven numeric(8,2) default 0,
  route_efficiency text not null default 'good',
  created_at timestamptz not null default now()
);

create table if not exists restock_issues (
  id text primary key,
  order_id text references orders(id) on delete set null,
  route_id text default '',
  sku text default '',
  product text not null,
  needed numeric(12,2) not null default 0,
  available numeric(12,2) not null default 0,
  severity text not null default 'medium',
  action text not null,
  created_at timestamptz not null default now()
);

create table if not exists driver_sales_leads (
  id text primary key,
  driver text not null,
  source_stop_id text default '',
  source_customer text default '',
  route_id text default '',
  lead_name text not null,
  email text default '',
  phone text default '',
  address text default '',
  zip text default '',
  area text default '',
  need text default '',
  offer text default '',
  estimated_value numeric(12,2) not null default 0,
  status text not null default 'queued',
  temperature text not null default 'warm',
  note text default '',
  owner_override text default '',
  ai_instruction text default '',
  driver_route_plan text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists learning_events (
  id text primary key,
  role text not null,
  event_type text not null,
  summary text not null,
  signal integer not null default 5,
  route_id text default '',
  order_id text default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_route_id on orders(route_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_driver_updates_route_id on driver_updates(route_id);
create index if not exists idx_driver_sales_leads_status on driver_sales_leads(status);
create index if not exists idx_driver_sales_leads_zip on driver_sales_leads(zip);
create index if not exists idx_learning_events_route_id on learning_events(route_id);
create index if not exists idx_restock_issues_product on restock_issues(product);
