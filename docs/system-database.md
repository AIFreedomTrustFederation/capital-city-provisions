# Capital City Provisions system database

The website now has a database-shaped operating system for the full customer-to-delivery lifecycle.

## What it tracks

- Customers from first route check, box interest, giveaway entry, or order intake.
- Orders from lead through quoted, ordered, paid, scheduled, packed, loaded, out-for-delivery, partially fulfilled, delivered, issue, restock-needed, or cancelled.
- Product-level fulfillment: quantity needed, quantity fulfilled, substitutions, and product issues.
- Driver updates: delivery status, fulfillment status, partial reasons, restock issues, substitutions, customer notes, fuel start/end, miles driven, and route efficiency.
- Restock issues: product, needed quantity, available quantity, severity, and owner action.
- Owner reports: revenue, estimated cost, estimated profit, margin, open orders, delivered orders, partial orders, restock issues, route efficiency, future restock, and owner actions.
- AI learning events: route conversion notes, delivery notes, restock risk, customer signals, and owner-reviewed training records.

## Live database vs sample database

The system now separates the real database from the sample database.

- The **live database starts empty** and should only contain real customer/order/driver/delivery records created by the system.
- The **sample database** exists for testing screens, reports, driver updates, restock issues, and AI prompts.
- `/system-database` shows live-empty mode.
- `/system-database/sample` shows seeded sample mode.
- `/api/db/orders`, `/api/db/driver-update`, `/api/db/reports`, and `/api/db/training` use live mode by default.
- Add `?sample=1` to use demo data intentionally.

## Open-source persistence target

The repo now includes a PostgreSQL-compatible open-source schema:

- `database/schema.sql` creates the live system database tables.
- `database/seed-sample.sql` creates optional demo data only.
- `database/README.md` explains live and sample modes.

For production persistence, connect the database adapter to open-source PostgreSQL, self-hosted Supabase, Neon-compatible Postgres, or another Postgres-compatible database. Vercel serverless functions cannot reliably write live business records back into repository files at runtime, so a shared database is required for real multi-user customer/driver/owner state.

## Main files

- `lib/ccp-database.ts` contains schema types, live/sample runtime stores, lifecycle updates, reports, and training dataset generation.
- `/api/db/orders` creates and reads order lifecycle records.
- `/api/db/driver-update` records driver delivery and fulfillment updates.
- `/api/db/reports` generates owner reports and optional full training snapshots.
- `/api/db/training` exports the AI training dataset.
- `/system-database` provides the live owner/driver command center UI.
- `/system-database/sample` provides the sample database UI.

## Learning loop

1. Customer enters ZIP, order interest, budget, products, and contact info.
2. The system creates customer, order, route, promo, and product records.
3. Driver updates delivery, fulfillment, partial fulfillment, restock issues, substitutions, fuel, and mileage.
4. Owner report computes profit, margin, route efficiency, restock needs, and next actions.
5. AI learning records summarize what happened.
6. The local LLM and future hosted model use the structured records as memory. Fine-tuning should happen only after enough clean owner-reviewed records exist.
