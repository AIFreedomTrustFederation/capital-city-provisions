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

## Open-source target

The schema is PostgreSQL-compatible and can run on open-source PostgreSQL, self-hosted Supabase, Neon-compatible Postgres, or another Postgres-compatible service.

When `DATABASE_URL` is configured, `/api/db/orders` uses PostgreSQL for order lifecycle reads and writes, `/api/db/driver-update` persists driver delivery updates to PostgreSQL, `/api/ops/driver-sales` stores driver sales leads in PostgreSQL, and reports/training exports read from PostgreSQL.

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

Customer WebAI should only receive customer-safe context such as public products, delivery estimates, promotions, giveaway rules, and wholesale inquiry flow.

Driver WebAI should only receive driver-safe context such as assigned stops, delivery notes, fulfillment state, restock issues, fuel/mileage, turn-in status, and driver sales queue actions.

Owner WebAI may receive owner-authenticated operational context such as live orders, reports, sales queue records, restock needs, profit/loss, route efficiency, and training records.

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

## Recommended next database-backed AI upgrade

Add a role-safe AI context API that reads from PostgreSQL and returns only the context each role is allowed to see:

```text
/api/ai/context?role=customer
/api/ai/context?role=driver
/api/ai/context?role=owner
```

This keeps WebAI useful while preserving customer privacy, driver role boundaries, and owner-only financial/operational visibility.
