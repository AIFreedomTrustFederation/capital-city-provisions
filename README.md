# Capital City Provisions

Capital City Provisions is a modern stocked-home protein delivery web app for Sacramento-area families, steak buyers, wholesale accounts, and internal delivery operations. The public site helps customers check local availability, choose a stock-up plan, enter promotions, and continue saved box progress. Internal driver and owner tools are gated behind role access.

## MVP Rating

Current MVP rating: **7.6 / 10**

The product has a strong launch foundation: customer pages exist, the buying journey is understandable, ZIP-aware lead capture works conceptually, the concierge stays role-aware, and internal operations have a clear direction. The remaining gap is polish and operational hardening: deployment stability, persistent database verification, cleaner QA, full authentication, and a less busy visual system on mobile.

### Strongest Parts

- Clear customer funnel: ZIP check, box selection, lead capture, confirmation, giveaway, and follow-up.
- Modern brand direction: stocked-home planning, curated cuts, smart local delivery, and wholesale support.
- Role separation: public customer experience is separate from driver and owner tools.
- Open-source AI direction: browser-local AI support through WebLLM, with fallback behavior.
- Internal foundation: owner dashboard, driver boards, reports, operations, database, and live source-of-truth direction.
- Mobile-first improvements: compact header, bottom action bar, accordion footer, and minimized concierge.

### Biggest Risks

- Vercel deployment needs log-level follow-up after each operational hardening change.
- Production must not accept live operational records unless PostgreSQL is configured and healthy.
- Access gates are suitable for MVP privacy, but not yet full authentication or account management.
- Some pages still need final visual QA across desktop, tablet, and mobile.
- Promotions and giveaway copy should receive legal review before paid traffic.

## What The App Does

### Public Customer Experience

Customers can:

- Check their ZIP for delivery availability.
- Compare stocked-home box options.
- Explore steak delivery and cut preferences.
- Learn how delivery works.
- View delivery areas and local route status.
- Enter the freezer giveaway.
- Ask questions through the Box Concierge.
- Continue a saved plan without the popup reopening on every page.
- Contact sales, support, wholesale, or general departments.

### Product Pages

Core public pages include:

- `/` - Homepage and primary customer funnel.
- `/freezer-boxes` - Main stocked-home box comparison.
- `/family-freezer-boxes` - Family-focused box planning.
- `/steak-delivery` - Ribeye, filet, New York strip, sirloin, and steak bundles.
- `/delivery-map` - Delivery area snapshots.
- `/how-delivery-works` - Customer delivery process.
- `/wholesale` - Business and event supply.
- `/food-security-freezer-boxes` - Prepared household planning.
- `/giveaway` - Free giveaway entry.
- `/official-rules` - Giveaway terms.
- `/about` - Brand story and trust positioning.
- `/reviews` - Customer trust signals.
- `/faq` - Common questions.
- `/contact` - Department-specific contact paths.

### SEO Pages

Local SEO pages support Sacramento-area search intent:

- `/meat-delivery-sacramento`
- `/freezer-boxes-sacramento`
- `/beef-delivery-sacramento`
- `/steak-delivery-sacramento`
- `/wholesale-meat-supplier-sacramento`
- `/food-security-freezer-boxes`

### Internal Tools

Internal pages are gated by role:

- `/driver` - Driver route and fulfillment workspace.
- `/driver-sales` - Mobile driver sales queue connected to live owner review.
- `/owner` - Owner command workspace and source-of-truth board.
- `/reports` - Owner reporting.
- `/ops` - Operations hub.
- `/system-database` - Live database console.
- `/internal-access` - Role access gate.

Default access codes are intended only for local MVP/demo use:

- Owner: `OWNER2026`
- Driver: `DRIVER2026`

Production must set `OWNER_ACCESS_CODE` and `DRIVER_ACCESS_CODE` in Vercel environment variables. Without those variables, internal access fails closed in production.

## AI System

The app includes an open-source, browser-local AI direction using `@mlc-ai/web-llm`.

The AI is role-aware:

- Customer AI only discusses boxes, delivery, promotions, giveaway rules, and wholesale inquiries.
- Driver AI focuses on live assigned routes, stops, fulfillment, restock notes, fuel notes, and turn-ins.
- Owner AI focuses on live orders, reports, route learning, exports, restock planning, and profit/loss workflows.

The customer concierge is designed to stay minimized unless the customer opens it. Customer progress is saved locally so the experience can continue across pages without repeatedly interrupting the visitor.

## Data Model Direction

The project now uses a live-only source-of-truth direction. The owner dashboard and system database create the operational records that populate driver boards, reports, sales queues, and AI training records. No seeded fake/sample customer records should display in production UI.

Important files:

- `database/schema.sql` - Production-oriented schema.
- `database/README.md` - Database notes.
- `docs/system-database.md` - System database documentation.
- `lib/ccp-database.ts` - Local runtime database layer for development fallback and report generation.
- `lib/pg-database.ts` - PostgreSQL source-of-truth wiring for production persistence and reports.

MVP database concepts include:

- Leads
- Orders
- Delivery routes
- Fulfillment status
- Partial fulfillment
- Restock issues
- Driver notes
- Fuel notes
- Reports
- Wholesale accounts
- Customer status pipeline

Production should treat PostgreSQL as the only durable source of truth. Local memory fallback is for development and demos only. In production, live order creation, lifecycle lead creation, and reports should fail closed when PostgreSQL is not configured.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- CSS modules through global app stylesheets
- PostgreSQL through `pg`
- `@mlc-ai/web-llm` for browser-local open-source AI direction
- Vercel deployment

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run type checks:

```bash
npm run typecheck
```

Build for production:

```bash
npm run build
```

Start production build locally:

```bash
npm run start
```

Node requirement:

```bash
node >= 20
```

## Environment Variables

Recommended production variables:

```bash
OWNER_ACCESS_CODE=replace-with-secure-owner-code
DRIVER_ACCESS_CODE=replace-with-secure-driver-code
DATABASE_URL=postgres-connection-string
CCP_REQUIRE_POSTGRES=true
```

Future production variables may include:

```bash
NEXT_PUBLIC_SITE_URL=https://capital-city-provisions.vercel.app
```

## Code Ownership And Dependency Policy

Capital City Provisions application source code is proprietary and all rights are reserved. Third-party dependencies must remain open-source and license-compatible with proprietary application code.

Run the dependency license audit before adding or upgrading packages:

```bash
npm run license:audit
```

See `LICENSE.md` and `docs/proprietary-open-source-policy.md`.

## Deployment Notes

The intended production branch is `main`.

Before sending traffic, confirm:

- Vercel build passes.
- `npm run license:audit` passes.
- `database/schema.sql` has been applied to the production PostgreSQL database.
- `DATABASE_URL` is set in production.
- `CCP_REQUIRE_POSTGRES=true` is set in production.
- Owner-authenticated `/api/db/health` returns `ok: true` and `storage: postgres`.
- Production order, lead-lifecycle, and report routes fail closed instead of using memory when Postgres is unavailable.
- All customer pages load.
- Mobile header and bottom action bar work.
- Box Concierge stays minimized until clicked.
- Clean Light mode has readable card headings.
- Internal pages redirect to `/internal-access` when not authenticated.
- Owner and driver access codes work.
- Owner dashboard creates records that populate driver boards and reports.

## Official Branch Policy

`origin/main` is the official source of truth for this project.

Phone Codespaces, desktop Codespaces, local clones, and temporary working branches must be synced back to `origin/main` through the project sync script. Do not use ordinary VS Code Pull when branches have diverged. Do not force-push `main`.
