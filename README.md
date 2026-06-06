# Capital City Provisions

Capital City Provisions is a modern stocked-home protein delivery web app for Sacramento-area families, steak buyers, wholesale accounts, and internal delivery operations. The public site helps customers check local availability, choose a stock-up plan, enter promotions, and continue saved box progress. Internal driver and owner tools are gated behind role access.

## MVP Rating

Current MVP rating: **7.6 / 10**

The product has a strong launch foundation: customer pages exist, the buying journey is understandable, ZIP-aware lead capture works conceptually, the concierge stays role-aware, and internal operations have a clear direction. The remaining gap is polish and operational hardening: deployment stability, real database wiring, cleaner QA, and a less busy visual system on mobile.

### Strongest Parts

- Clear customer funnel: ZIP check, box selection, lead capture, confirmation, giveaway, and follow-up.
- Modern brand direction: stocked-home planning, curated cuts, smart local delivery, and wholesale support.
- Role separation: public customer experience is separate from driver and owner tools.
- Open-source AI direction: browser-local AI support through WebLLM, with fallback behavior.
- Internal foundation: driver, owner, reports, operations, database, and sample/live data concepts exist.
- Mobile-first improvements: compact header, bottom action bar, accordion footer, and minimized concierge.

### Biggest Risks

- Vercel deployment is currently failing or rate-limited and needs log-level follow-up.
- The live database path needs production-grade persistence before real orders are accepted.
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
- `/owner` - Owner command workspace.
- `/reports` - Owner reporting.
- `/ops` - Operations hub.
- `/system-database` - Live database console.
- `/system-database/sample` - Sample data console.
- `/internal-access` - Role access gate.

Default access codes are intended only for MVP/demo use:

- Owner: `OWNER2026`
- Driver: `DRIVER2026`

Production should set these in Vercel environment variables.

## AI System

The app includes an open-source, browser-local AI direction using `@mlc-ai/web-llm`.

The AI is role-aware:

- Customer AI only discusses boxes, delivery, promotions, giveaway rules, and wholesale inquiries.
- Driver AI focuses on routes, stops, fulfillment, restock notes, fuel notes, and turn-ins.
- Owner AI focuses on orders, reports, route learning, exports, restock planning, and profit/loss workflows.

The customer concierge is designed to stay minimized unless the customer opens it. Customer progress is saved locally so the experience can continue across pages without repeatedly interrupting the visitor.

## Data Model Direction

The project includes an open-source database direction with live and sample data separation.

Important files:

- `database/schema.sql` - Production-oriented schema.
- `database/seed-sample.sql` - Sample/demo seed data.
- `database/README.md` - Database notes.
- `docs/system-database.md` - System database documentation.

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

The current app should not be treated as fully production-ready for live order handling until persistent storage, backups, authentication, and export flows are verified end to end.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- CSS modules through global app stylesheets
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
```

Future production variables may include:

```bash
DATABASE_URL=postgres-connection-string
NEXT_PUBLIC_SITE_URL=https://capital-city-provisions.vercel.app
```

## Deployment Notes

The intended production branch is `main`.

Vercel should deploy from `main`, but recent deployment checks have shown either build failures or build-rate-limit blocks. Before sending traffic, confirm:

- Vercel build passes.
- All customer pages load.
- Mobile header and bottom action bar work.
- Box Concierge stays minimized until clicked.
- Clean Light mode has readable card headings.
- Internal pages redirect to `/internal-access` when not authenticated.
- Owner and driver access codes work.

## Codespace Sync

Run this inside each Codespace to safely sync it with `origin/main`:

```bash
bash sync-current-codespace.sh
```

The script saves local work to a timestamped backup branch when needed, pushes that backup, fast-forwards `main`, installs dependencies, then runs typecheck and build.

It does not run destructive reset, clean, force-push, or delete commands.

After syncing each Codespace, check all Codespaces with:

```bash
bash check-all-codespaces-sync.sh
```

Optional fast modes:

```bash
bash sync-current-codespace.sh --no-build
bash sync-current-codespace.sh --no-install --no-build
```

## Cleanup Priorities

### 1. Fix Deployment First

The MVP is only useful if Vercel reliably deploys. Pull the exact Vercel build logs, fix the failing line, and confirm `main` is green.

### 2. Reduce Mobile Density

The mobile experience is improving, but the next step is to shorten cards and reveal details only when needed.

Recommended changes:

- Collapse long product cards behind “Details.”
- Keep only one CTA per mobile section when possible.
- Reduce repeated route/status cards on pages where the ZIP checker already handles the job.

### 3. Add Concierge Privacy Controls

Add:

- “Saved on this device.”
- “Clear saved info.”
- “Edit my details.”

This will make saved lead behavior feel intentional and trustworthy.

### 4. Harden Internal Access

The current access code system is MVP-level. For production, replace it with proper authentication, roles, sessions, and audit logging.

### 5. Wire Real Persistence

Before live orders, connect the live database path to persistent storage and confirm:

- Lead creation
- Order creation
- Driver updates
- Fulfillment updates
- Restock notes
- CSV export
- Owner reports

### 6. Tighten Promotion Compliance

The giveaway and cheesecake offer language is intentionally separated, but legal review is still recommended before ads or broad launch.

### 7. Visual QA Pass

Run visual QA on:

- iPhone-sized viewport
- Android-sized viewport
- Tablet
- 1366px desktop
- Wide desktop
- Clean Light mode
- Luxury Dark mode

## Suggested Next Build Phase

The next high-value phase is **Operational MVP Hardening**:

1. Fix Vercel build.
2. Connect live database persistence.
3. Add owner lead dashboard filtering.
4. Add driver route status updates.
5. Add CSV export.
6. Add customer saved-info controls.
7. Do a final mobile visual pass.

## Product Positioning

Capital City Provisions should feel like a modern food-security and stocked-home system, not a generic meat delivery site.

Best current positioning:

> Curated cuts, smarter delivery, and stocked-home planning for families, kitchens, and community buyers.

Key customer promise:

> Check your ZIP, choose the right plan, and keep better meals ready at home.
