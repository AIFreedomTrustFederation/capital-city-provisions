create table if not exists ai_chat_sessions (
  id text primary key,
  role text not null default 'customer',
  title text not null default 'New chat',
  subject_key text default 'general',
  customer_key text default '',
  route_id text default '',
  order_id text default '',
  invoice_id text default '',
  appointment_id text default '',
  status text not null default 'open',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ai_chat_messages (
  id text primary key,
  session_id text not null references ai_chat_sessions(id) on delete cascade,
  role text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_chat_sessions_role on ai_chat_sessions(role);
create index if not exists idx_ai_chat_sessions_subject_key on ai_chat_sessions(subject_key);
create index if not exists idx_ai_chat_sessions_customer_key on ai_chat_sessions(customer_key);
create index if not exists idx_ai_chat_messages_session_id on ai_chat_messages(session_id);
