# Capital City Provisions database

This folder defines the open-source database layer for the system.

## Modes

- **Live database**: starts empty. It receives only real customer, order, driver, fulfillment, restock, route, report, and learning records.
- **Sample database**: optional demo data for testing UI and AI behavior.

The website now keeps those modes separate:

- `/system-database` shows the live empty database.
- `/system-database/sample` shows the sample database.
- `/api/db/orders` reads/writes live by default.
- `/api/db/orders?sample=1` reads/writes sample mode for demos.
- `/api/db/reports` generates live reports by default.
- `/api/db/reports?sample=1` generates sample reports.
- `/api/db/training` exports live training records by default.
- `/api/db/training?sample=1` exports sample training records.

## Open-source target

The schema is PostgreSQL-compatible and can run on open-source PostgreSQL, self-hosted Supabase, Neon-compatible Postgres, or another Postgres-compatible service.

For production, apply:

```sql
\i database/schema.sql
```

For demo/testing only:

```sql
\i database/seed-sample.sql
```

## AI learning

The LLM should not make up training data. It should learn from records created by the system:

1. Customer starts deciding or ordering.
2. Order lifecycle record is created.
3. Driver updates delivery and fulfillment.
4. Restock and fuel efficiency are recorded.
5. Owner report summarizes profit/loss, route efficiency, restock needs, and future orders.
6. Learning events become the training dataset.
7. Owner-reviewed learning can later be used for fine-tuning or stronger route models.
