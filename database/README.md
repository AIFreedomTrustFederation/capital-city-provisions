# Capital City Provisions database

This folder defines the database layer for the live operating system.

## Live source of truth

The app now uses one live source of truth:

- The live database starts empty.
- The owner dashboard and system database create operational records.
- Driver boards, driver sales, reports, and AI training records read from the live database.
- No seeded fake/sample customer data should appear in production UI.

Current live endpoints:

- `/system-database` shows the live database console.
- `/api/db/health` checks PostgreSQL connectivity and required schema tables without writing business records.
- `/api/db/orders` reads/writes live orders.
- `/api/db/driver-update` writes live driver delivery and fulfillment updates.
- `/api/db/reports` generates live reports.
- `/api/db/training` exports live training records.
- `/api/ops/driver-sales` writes live driver sales leads for owner review.
- `/api/ai/context` returns role-safe WebAI context.

## Open-source target

The schema is PostgreSQL-compatible and can run on open-source PostgreSQL, self-hosted Supabase, Neon-compatible Postgres, or another Postgres-compatible service.

When `DATABASE_URL` is configured, `/api/db/orders` uses PostgreSQL for order lifecycle reads and writes, `/api/db/driver-update` persists driver delivery updates to PostgreSQL, `/api/ops/driver-sales` stores driver sales leads in PostgreSQL, and reports/training/context exports read from PostgreSQL.

Without `DATABASE_URL`, the app can use the in-memory MVP store for local demos and development only. Production should set `CCP_REQUIRE_POSTGRES=true` so live operational routes fail closed instead of writing source-of-truth records to memory.

For production, apply:

```sql
\i database/schema.sql
```

Do not seed production with fake customers, fake orders, fake routes, or fake driver records.

## WebAI and database memory

WebAI is the conversational layer. PostgreSQL is the durable business memory.

The database supports WebAI by providing clean, structured records for:

- Customer lead and route demand signals.
- Order lifecycle status.
- Driver fulfillment updates.
- Partial fulfillment and restock issues.
- Fuel, mileage, and route efficiency.
- Driver sales queue outcomes.
- Owner reports and next actions.
- AI learning events and training exports.

`/api/ai/context` is the role-safe bridge between WebAI and operational memory:

- Customer WebAI receives customer-safe context such as public products, delivery estimates, promotions, giveaway rules, and wholesale inquiry flow.
- Driver WebAI receives driver-safe context such as assigned stops, delivery notes, fulfillment state, restock issues, fuel/mileage, turn-in status, and driver sales queue actions.
- Owner WebAI receives owner-authenticated operational context such as live orders, reports, sales queue records, restock needs, profit/loss, route efficiency, and training records.
- In production or when `CCP_REQUIRE_POSTGRES=true`, driver and owner operational context should fail closed if PostgreSQL is unavailable.

## AI learning

The LLM should not make up training data. It should learn from records created by the system:

1. Customer starts deciding or ordering.
2. Order lifecycle record is created.
3. Driver updates delivery and fulfillment.
4. Restock and fuel efficiency are recorded.
5. Driver sales queue records are reviewed by the owner.
6. Owner report summarizes profit/loss, route efficiency, restock needs, and future orders.
7. Learning events become the training dataset.
8. Owner-reviewed learning can later be used for fine-tuning or stronger route models.

Production training exports should come from PostgreSQL-backed records, not temporary memory state.

## Next database-backed AI upgrade

Wire the customer, driver, and owner WebAI UI panels to request `/api/ai/context` before answering so every chat receives the newest role-safe source-of-truth context.
