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

create table if not exists invoices (
  id text primary key,
  invoice_number text unique not null,
  customer_id text references customers(id),
  order_id text references orders(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text default '',
  billing_name text default '',
  delivery_zip text default '',
  delivery_zone_status text default '',
  delivery_zone_ring text default '',
  status text not null default 'draft',
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  balance_due numeric(12,2) not null default 0,
  currency text not null default 'USD',
  due_at timestamptz,
  expires_at timestamptz,
  sent_at timestamptz,
  paid_at timestamptz,
  voided_at timestamptz,
  notes text default '',
  terms text default '',
  payment_instructions text default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists invoice_line_items (
  id bigserial primary key,
  invoice_id text not null references invoices(id) on delete cascade,
  sku text default '',
  description text not null,
  qty numeric(12,2) not null default 1,
  unit text default 'each',
  unit_price numeric(12,2) not null default 0,
  amount numeric(12,2) not null default 0,
  tax_category text not null default 'grocery_food',
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists payments (
  id text primary key,
  invoice_id text not null references invoices(id) on delete cascade,
  provider text not null default 'manual',
  method text not null default 'manual',
  status text not null default 'pending',
  amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  processor_payment_id text default '',
  processor_fee numeric(12,2) not null default 0,
  net_amount numeric(12,2) not null default 0,
  card_brand text default '',
  card_last4 text default '',
  received_at timestamptz,
  notes text default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists receipts (
  id text primary key,
  receipt_number text unique not null,
  invoice_id text not null references invoices(id) on delete cascade,
  payment_id text references payments(id) on delete set null,
  customer_email text not null,
  amount_paid numeric(12,2) not null default 0,
  balance_due numeric(12,2) not null default 0,
  status text not null default 'issued',
  email_status text not null default 'pending',
  issued_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists billing_email_log (
  id text primary key,
  invoice_id text references invoices(id) on delete set null,
  receipt_id text references receipts(id) on delete set null,
  customer_email text not null,
  email_type text not null,
  status text not null default 'queued',
  provider_message_id text default '',
  subject text not null,
  body text not null,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create table if not exists customer_email_messages (
  id text primary key,
  direction text not null default 'outbound',
  customer_email text not null,
  customer_name text default '',
  subject text not null,
  body text not null,
  status text not null default 'draft',
  stage text default '',
  source text default '',
  invoice_id text references invoices(id) on delete set null,
  receipt_id text references receipts(id) on delete set null,
  appointment_id text default '',
  provider text default 'manual',
  provider_message_id text default '',
  received_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists internal_board_messages (
  id text primary key,
  audience text not null default 'owner',
  created_by text not null default 'system',
  subject text not null,
  body text not null,
  status text not null default 'open',
  priority text not null default 'normal',
  customer_email text default '',
  customer_name text default '',
  route_id text default '',
  order_id text default '',
  source text default 'manual',
  ai_approved boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create table if not exists delivery_appointments (
  id text primary key,
  invoice_id text references invoices(id) on delete set null,
  order_id text references orders(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text default '',
  delivery_zip text default '',
  address text default '',
  route_id text default '',
  driver text default '',
  status text not null default 'requested',
  requested_window text default '',
  confirmed_date text default '',
  confirmed_window text default '',
  confirmation_email_status text not null default 'pending',
  driver_notes text default '',
  customer_notes text default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz
);

create table if not exists refunds_disputes (
  id text primary key,
  invoice_id text references invoices(id) on delete set null,
  payment_id text references payments(id) on delete set null,
  type text not null default 'refund',
  status text not null default 'open',
  amount numeric(12,2) not null default 0,
  reason text default '',
  owner_notes text default '',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
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

create table if not exists ccp_user_profiles (
  id text primary key,
  role text not null,
  display_name text not null,
  preferred_sender_email text default '',
  default_department text not null default 'support',
  backup_route text default 'aifreedomtrust@gmail.com',
  public_reply_email text default '',
  message_permissions jsonb not null default '[]'::jsonb,
  approval_rules jsonb not null default '[]'::jsonb,
  setup_complete boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_route_id on orders(route_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_driver_updates_route_id on driver_updates(route_id);
create index if not exists idx_driver_sales_leads_status on driver_sales_leads(status);
create index if not exists idx_driver_sales_leads_zip on driver_sales_leads(zip);
create index if not exists idx_learning_events_route_id on learning_events(route_id);
create index if not exists idx_restock_issues_product on restock_issues(product);
create index if not exists idx_invoices_customer_email on invoices(customer_email);
create index if not exists idx_invoices_status on invoices(status);
create index if not exists idx_payments_invoice_id on payments(invoice_id);
create index if not exists idx_receipts_invoice_id on receipts(invoice_id);
create index if not exists idx_billing_email_log_invoice_id on billing_email_log(invoice_id);
create index if not exists idx_customer_email_messages_customer_email on customer_email_messages(customer_email);
create index if not exists idx_customer_email_messages_direction on customer_email_messages(direction);
create index if not exists idx_customer_email_messages_status on customer_email_messages(status);
create index if not exists idx_internal_board_messages_audience on internal_board_messages(audience);
create index if not exists idx_internal_board_messages_status on internal_board_messages(status);
create index if not exists idx_internal_board_messages_customer_email on internal_board_messages(customer_email);
create index if not exists idx_delivery_appointments_invoice_id on delivery_appointments(invoice_id);
create index if not exists idx_delivery_appointments_status on delivery_appointments(status);
create index if not exists idx_delivery_appointments_route_id on delivery_appointments(route_id);
create index if not exists idx_ccp_user_profiles_role on ccp_user_profiles(role);
create index if not exists idx_ccp_user_profiles_setup_complete on ccp_user_profiles(setup_complete);
