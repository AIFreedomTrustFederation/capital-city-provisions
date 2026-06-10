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

## WebAI System

The app includes an open-source, browser-local AI direction using `@mlc-ai/web-llm`.

WebAI is the conversational layer. PostgreSQL is the durable memory and source-of-truth layer. Rules mode is the safety net when the browser cannot load a local model.

### WebAI modes

- **Browser-local LLM:** `LocalAIConcierge.tsx` can load an open-source model in the customer, driver, or owner browser when WebGPU is available.
- **Rules fallback:** If WebGPU is unavailable or model loading fails, the same component answers through role-scoped deterministic rules.
- **Server route concierge:** `/api/ai/route-concierge` provides deterministic ZIP/route recommendations and can optionally call a self-hosted OpenAI-compatible endpoint through `AI_CONCIERGE_URL`.
- **Postgres-backed operating memory:** Live orders, driver updates, sales leads, reports, and training exports should come from PostgreSQL in production.

### Role boundaries

- Customer AI only discusses boxes, delivery, promotions, giveaway rules, and wholesale inquiries.
- Driver AI focuses on assigned routes, stops, fulfillment, restock notes, fuel notes, sales queue notes, and turn-ins.
- Owner AI focuses on live orders, reports, route learning, exports, restock planning, sales queue review, and profit/loss workflows.

The customer concierge is designed to stay minimized unless the customer opens it. Customer progress is saved locally so the experience can continue across pages without repeatedly interrupting the visitor.

### How WebAI works with the database

- Customer AI can answer public shopping and giveaway questions without needing private database records.
- Driver AI can assist locally, but production fulfillment writes must save through the Postgres-backed APIs before they count as live operational records.
- Owner AI should use reports, order lifecycle records, restock issues, driver updates, sales queue records, and training exports generated from PostgreSQL.
- Production training exports should come from durable records, not temporary memory state.
- If `CCP_REQUIRE_POSTGRES=true` or the app is running in production and Postgres is unavailable, live operational routes should fail closed instead of feeding temporary records to reports or WebAI.

### Recommended next WebAI upgrade

Add a role-safe AI context API that builds context from PostgreSQL before passing it to customer, driver, or owner AI.

Suggested future endpoints:

```text
/api/ai/context?role=customer
/api/ai/context?role=driver
/api/ai/context?role=owner
```

Target context rules:

- Customer context: public products, route estimate, promotion rules, giveaway rules, and wholesale inquiry flow only.
- Driver context: assigned route, stops, fulfillment state, customer notes, restock issues, fuel/mileage, and turn-in status only.
- Owner context: orders, reports, route performance, sales queue, restock issues, training records, and owner-only business metrics.

## Data Model Direction

The project now uses a live-only source-of-truth direction. The owner dashboard and system database create the operational records that populate driver boards, reports, sales queues, and AI training records. No seeded fake/sample customer records should display in production UI.

Important files:

- `database/schema.sql` - Production-oriented schema.
- `database/README.md` - Database notes.
- `docs/system-database.md` - System database documentation.
- `lib/ccp-database.ts` - Local runtime database layer for development fallback and report generation.
- `lib/pg-database.ts` - PostgreSQL source-of-truth wiring for production persistence and reports.
- `components/LocalAIConcierge.tsx` - Browser-local/rules-mode WebAI panel.
- `app/api/ai/route-concierge/route.ts` - Server route concierge and optional self-hosted model bridge.

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
- AI learning records

Production should treat PostgreSQL as the only durable source of truth. Local memory fallback is for development and demos only. In production, live order creation, lifecycle lead creation, fulfillment writes, sales queue writes, reports, and training exports should fail closed when PostgreSQL is not configured.

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

Optional AI route concierge variables:

```bash
AI_CONCIERGE_URL=https://your-openai-compatible-endpoint.example.com/v1/chat/completions
AI_CONCIERGE_MODEL=local-route-concierge
AI_CONCIERGE_API_KEY=optional-secret
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
- Production order, lead-lifecycle, fulfillment, sales queue, report, and training routes fail closed instead of using memory when Postgres is unavailable.
- Customer WebAI can answer public box/delivery/giveaway questions without exposing internal context.
- Driver WebAI only receives driver-scoped route/stop context.
- Owner WebAI only receives owner-authenticated operational context.
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
