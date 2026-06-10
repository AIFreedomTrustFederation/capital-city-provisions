# Capital City Provisions system database

The website now has a live database-shaped operating system for the full customer-to-delivery lifecycle.

## What it tracks

- Customers from first route check, box interest, giveaway entry, or order intake.
- Orders from lead through quoted, ordered, paid, scheduled, packed, loaded, out-for-delivery, partially fulfilled, delivered, issue, restock-needed, or cancelled.
- Product-level fulfillment: quantity needed, quantity fulfilled, substitutions, and product issues.
- Driver updates: delivery status, fulfillment status, partial reasons, restock issues, substitutions, customer notes, fuel start/end, miles driven, and route efficiency.
- Restock issues: product, needed quantity, available quantity, severity, and owner action.
- Owner reports: revenue, estimated cost, estimated profit, margin, open orders, delivered orders, partial orders, restock issues, route efficiency, future restock, and owner actions.
- AI learning events: customer signals, driver updates, restock risk, delivery notes, and owner-reviewed training records.

## Live source of truth

The system uses one live source of truth.

- The live database starts empty.
- The owner dashboard and system database create the records that populate the rest of the app.
- Driver boards read assigned live orders from the owner-created order lifecycle.
- Driver sales leads save into the live owner review queue.
- Reports and training records derive from live operational events.
- No fake/sample customer, route, order, driver, or sales lead records should display in production UI.

## Open-source persistence target

The repo includes a PostgreSQL-compatible open-source schema:

- `database/schema.sql` creates the live system database tables.
- `database/README.md` explains the live source-of-truth direction.

For production persistence, connect the database adapter to open-source PostgreSQL, self-hosted Supabase, Neon-compatible Postgres, or another Postgres-compatible database. Vercel serverless functions cannot reliably write live business records back into repository files at runtime, so a shared database is required for real multi-user customer/driver/owner state.

Current persistence behavior:

- If `DATABASE_URL` is set, order lifecycle reads/writes use PostgreSQL.
- If `DATABASE_URL` is set, driver delivery updates are persisted to PostgreSQL and update the related order status.
- If `DATABASE_URL` is set, driver sales leads, owner reports, and training exports use PostgreSQL.
- If `DATABASE_URL` is missing, local/demo mode uses the in-memory live store and should not be treated as durable production storage.

## Main files

- `lib/ccp-database.ts` contains schema types, live runtime store, lifecycle updates, reports, and training dataset generation.
- `/api/db/orders` creates and reads order lifecycle records.
- `/api/db/driver-update` records driver delivery and fulfillment updates.
- `/api/db/reports` generates owner reports and optional full training snapshots.
- `/api/db/training` exports the AI training dataset.
- `/api/ops/driver-sales` records driver sales leads for owner review.
- `/system-database` provides the live owner command center UI.
- `/owner` is the owner dashboard and operational source of truth.
- `/driver` and `/driver-sales` read from live owner-created records.

## Learning loop

1. Customer enters ZIP, order interest, budget, products, and contact info.
2. The system creates customer, order, route, promo, and product records.
3. Driver updates delivery, fulfillment, partial fulfillment, restock issues, substitutions, fuel, and mileage.
4. Owner report computes profit, margin, route efficiency, restock needs, and next actions.
5. AI learning records summarize what happened.
6. The local LLM and future hosted model use the structured records as memory. Fine-tuning should happen only after enough clean owner-reviewed records exist.
