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

## Current persistence mode

The current implementation uses a database adapter with seeded sample data and runtime memory. This proves the full workflow in Vercel without forcing a database vendor too early.

For production persistence, connect this adapter to a central database such as Vercel Postgres, Supabase Postgres, Neon, or another SQL database. Vercel serverless functions cannot reliably write back to repository files at runtime, so a real shared database is required for live multi-user driver/owner/customer state.

## Main files

- `lib/ccp-database.ts` contains schema types, seeded data, lifecycle updates, reports, and training dataset generation.
- `/api/db/orders` creates and reads order lifecycle records.
- `/api/db/driver-update` records driver delivery and fulfillment updates.
- `/api/db/reports` generates owner reports and optional full training snapshots.
- `/api/db/training` exports the AI training dataset.
- `/system-database` provides the owner/driver command center UI.

## Learning loop

1. Customer enters ZIP, order interest, budget, products, and contact info.
2. The system creates customer, order, route, promo, and product records.
3. Driver updates delivery, fulfillment, partial fulfillment, restock issues, substitutions, fuel, and mileage.
4. Owner report computes profit, margin, route efficiency, restock needs, and next actions.
5. AI learning records summarize what happened.
6. The local LLM and future hosted model use the structured records as memory. Fine-tuning should happen only after enough clean owner-reviewed records exist.
