create table if not exists internal_board_messages (
  id text primary key,
  audience text not null default 'owner',
  created_by text not null default 'system',
  subject text not null,
  body text not null,
  status text not null default 'open',
  priority text not null default 'normal',
  route_id text default '',
  order_id text default '',
  source text default 'manual',
  ai_approved boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create index if not exists idx_internal_board_messages_audience on internal_board_messages(audience);
create index if not exists idx_internal_board_messages_status on internal_board_messages(status);
