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
- `/api/db/orders` reads/writes live orders.
- `/api/db/driver-update` writes live driver delivery and fulfillment updates.
- `/api/db/reports` generates live reports.
- `/api/db/training` exports live training records.
- `/api/ops/driver-sales` writes live driver sales leads for owner review.

## Open-source target

The schema is PostgreSQL-compatible and can run on open-source PostgreSQL, self-hosted Supabase, Neon-compatible Postgres, or another Postgres-compatible service.

For production, apply:

```sql
\i database/schema.sql
```

Do not seed production with fake customers, fake orders, fake routes, or fake driver records.

## AI learning

The LLM should not make up training data. It should learn from records created by the system:

1. Customer starts deciding or ordering.
2. Order lifecycle record is created.
3. Driver updates delivery and fulfillment.
4. Restock and fuel efficiency are recorded.
5. Owner report summarizes profit/loss, route efficiency, restock needs, and future orders.
6. Learning events become the training dataset.
7. Owner-reviewed learning can later be used for fine-tuning or stronger route models.
