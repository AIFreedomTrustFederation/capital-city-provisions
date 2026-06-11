# Capital City Provisions

Capital City Provisions is a modern stocked-home protein delivery web app for Sacramento-area families, steak buyers, wholesale accounts, and internal delivery operations. The public site helps customers check local availability, choose a stock-up plan, enter promotions, and continue saved box progress. Internal driver and owner tools are gated behind role access.

## MVP Rating

Current verified MVP rating: **7.4 / 10**

The product now has a strong launch foundation: customer pages exist, the buying journey is understandable, ZIP-aware lead capture works conceptually, the concierge stays role-aware, internal operations are moving into one unified AI command interface, and mixed memory is now labeled so AI can interpret source and truth level. The remaining gap is production verification: Vercel build logs are currently blocked by account/build-rate-limit status, full authentication is still future work, and final mobile QA still needs a live deployment pass.

### Strongest Parts

- Clear customer funnel: ZIP check, box selection, lead capture, confirmation, giveaway, and follow-up.
- Modern brand direction: stocked-home planning, curated cuts, smart local delivery, and wholesale support.
- Role separation: public customer experience is separate from driver and owner tools.
- Unified AI front end: owner, driver, and customer AI workspaces now share a ChatGPT-style command shell.
- Context trust architecture: Postgres, memory, AI summaries, customer messages, driver notes, owner overrides, and system records can be labeled by source, truth level, confidence, and reason.
- Persistent internal board: owner-driver notes and owner-approved customer-facing board items route through `/api/internal-board`.
- Internal foundation: owner dashboard, driver boards, message board, reports, operations, database, and live source-of-truth direction.
- Mobile-first improvements: compact header, bottom action bar, accordion footer, and minimized concierge.

### Biggest Risks

- Vercel deployment needs log-level follow-up after the build-rate-limit issue is resolved.
- Production must not accept official live operational records unless PostgreSQL is configured and healthy.
- Mixed memory is allowed, but unlabeled mixed memory is not acceptable for AI decision-making.
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

- `/internal-access` - Role access gate and unified operations hub.
- `/owner` - Owner command workspace, operations hub, message board, reports, and Owner AI.
- `/driver` - Driver route workspace, operations hub, route work, turn-ins, and Driver AI.
- `/driver-profile` - Persistent driver profile setup.
- `/owner-setup` - Persistent owner setup profile.
- `/driver-messages` - Driver manual customer-message composer.
- `/driver-appointments` - Delivery appointment workflow with message actions.
- `/driver-sales` - Mobile driver sales queue connected to owner review.
- `/field-sales` - Cold-knock and route-side sales workflow.
- `/billing` - Invoice, receipt, and billing workflow.
- `/revenue-pipeline` - Leads, invoices, appointments, and follow-up pipeline.
- `/business-intelligence` - Owner intelligence and operator brain.
- `/system-database` - Live database console.

Default access codes are intended only for local MVP/demo use:

- Owner: `OWNER2026`
- Driver: `DRIVER2026`

Production must set `OWNER_ACCESS_CODE` and `DRIVER_ACCESS_CODE` in Vercel environment variables. Without those variables, internal access fails closed in production.

## Unified AI Command System

The internal AI experience is consolidating around one state-of-the-art front-end shell instead of scattered separate chat boxes.

Important files:

- `components/AiCommandInterface.tsx` - ChatGPT-style AI shell with sidebar, customer threads, subject threads, message board, internal board, context trust display, and trust explanations.
- `components/RoleAIWorkspace.tsx` - Role-safe wrapper that feeds customer, driver, or owner context into the unified AI shell and labels memory with trust metadata.
- `components/PersistentChatBox.tsx` - Persistent chat panel that includes context-trust language in chat answers and saved memory exchanges.
- `lib/context-trust.ts` - Shared trust-label system for source, truth level, confidence, and reason.
- `components/InternalOpsHub.tsx` - Role-aware internal operations menu for owners and drivers.
- `components/OwnerMessageBoard.tsx` - Owner view of queued, sent, failed, replied, follow-up, and escalated customer messages.
- `app/api/ai/context/route.ts` - Central role-safe AI context API that applies trust labels to public, driver, and owner context.
- `app/api/email-system/route.ts` - Shared customer-facing message record API.
- `app/api/internal-board/route.ts` - Owner-driver and owner-approved customer-facing internal board API.
- `database/migrations/20260611_internal_board_messages.sql` - Minimal internal board migration.

The AI shell organizes history by:

- customer
- subject
- message status
- internal board audience
- role: customer, driver, owner
- context source
- truth level

### Internal board rules

- Owners and drivers can read internal board records after internal access.
- Drivers can create owner/driver internal notes.
- Drivers cannot create `customer-approved` board messages.
- Owners can create `customer-approved` records.
- Customer-related board context is stored in metadata rather than creating a second customer-message table.

## Context Trust System

Capital City Provisions now treats mixed memory as a feature, not a bug. The rule is not “Postgres only.” The rule is:

**Postgres is the durable source of operational truth. Memory is the working source of intelligence. Trust labels tell AI how to interpret both.**

The shared trust system lives in `lib/context-trust.ts`.

### Record sources

Supported context sources:

- `postgres` - durable database record.
- `memory` - runtime working memory for local development, demos, and temporary working context.
- `ai-summary` - inferred or synthesized intelligence created by AI/operator-brain logic.
- `customer-message` - customer-provided message or intake context awaiting confirmation.
- `driver-note` - field note or turn-in context from the driver side.
- `owner-override` - owner decision, profile preference, or override.
- `system` - generated system/public context.

### Truth levels

Supported truth levels:

- `official` - AI may treat this as operational source of truth.
- `working` - AI may use this for context, but should verify before final action.
- `inferred` - AI should treat this as a suggestion, not a fact.
- `pending-review` - AI should surface this for owner, driver, or system confirmation.

### AI interpretation rule

AI responses should not blindly trust every record. They should interpret records according to trust metadata:

- Official Postgres records can drive operations.
- Working memory can guide conversation and planning.
- AI summaries can suggest priorities but should not override official records.
- Customer messages and driver notes should be surfaced when they conflict with official status.
- Owner overrides can supersede AI suggestions.

Example expected behavior:

> Official Postgres records show the order is scheduled, but driver-note memory says there may be a partial fulfillment issue. Confirm before promising delivery.

### Where trust labels are currently applied

- `/api/ai/context` labels customer, driver, and owner context before the workspace receives it.
- `RoleAIWorkspace` labels page fallback memory, API context, orders, routes, and driver turn-ins.
- `AiCommandInterface` displays context source, truth level, confidence, and explanation.
- `PersistentChatBox` includes the trust explanation in chat answers and saved AI memory exchanges.
- Operator-brain summaries are labeled as `ai-summary` / `inferred` style context.

## WebAI System

The app includes an open-source, browser-local AI direction using `@mlc-ai/web-llm`.

WebAI is the conversational layer. PostgreSQL is the durable operational layer. Runtime memory is the working intelligence layer. Rules mode is the safety net when the browser cannot load a local model.

### WebAI modes

- **Browser-local LLM:** `LocalAIConcierge.tsx` can load an open-source model in the customer, driver, or owner browser when WebGPU is available.
- **Rules fallback:** If WebGPU is unavailable or model loading fails, the same component answers through role-scoped deterministic rules.
- **Unified command shell:** `AiCommandInterface.tsx` wraps AI chat, organized history, customer/message threads, internal board records, and trust-level explanations.
- **Server route concierge:** `/api/ai/route-concierge` provides deterministic ZIP/route recommendations and can optionally call a self-hosted OpenAI-compatible endpoint through `AI_CONCIERGE_URL`.
- **Postgres-backed operating memory:** Live orders, driver updates, sales leads, reports, messages, board notes, and training exports should come from PostgreSQL in production.
- **Trust-labeled mixed memory:** AI can use memory, summaries, messages, notes, and owner overrides when each record carries source and truth metadata.

### Role boundaries

- Customer AI only discusses boxes, delivery, promotions, giveaway rules, and wholesale inquiries.
- Driver AI focuses on assigned routes, stops, fulfillment, restock notes, fuel notes, sales queue notes, customer-message preparation, internal notes, and turn-ins.
- Owner AI focuses on live orders, reports, route learning, exports, restock planning, sales queue review, message control, internal notes, and profit/loss workflows.

The customer concierge is designed to stay minimized unless the customer opens it. Customer progress is saved locally so the experience can continue across pages without repeatedly interrupting the visitor.

### How WebAI works with the database and memory

- Customer AI can answer public shopping and giveaway questions without needing private database records.
- Driver AI can assist locally, but production fulfillment writes must save through the Postgres-backed APIs before they count as official live operational records.
- Owner AI should use reports, order lifecycle records, restock issues, driver updates, sales queue records, message records, board notes, and training exports generated from PostgreSQL as official context.
- Memory fallback and local turn-ins are valid working context when labeled as `memory` or `driver-note`.
- Operator-brain summaries and training summaries are useful intelligence, but should be labeled as `ai-summary` and treated as inferred guidance.
- Production training exports should come from durable records, not temporary memory state.
- If `CCP_REQUIRE_POSTGRES=true` or the app is running in production and Postgres is unavailable, official live operational routes should fail closed instead of pretending temporary memory is official.

## Data Model Direction

The project now follows a dual-layer intelligence model:

1. **PostgreSQL = durable operational truth.**
2. **Memory = working intelligence and AI context.**
3. **Context trust labels = interpretation rules for AI.**

The owner dashboard and system database create official operational records that populate driver boards, reports, sales queues, message boards, internal board notes, and AI training records. Runtime memory can still provide working context, demos, local notes, and AI intelligence, but it must be labeled clearly so AI knows whether it is official, working, inferred, or pending review. No seeded fake/sample customer records should display as official production UI.

Important files:

- `database/schema.sql` - Production-oriented schema.
- `database/migrations/20260611_internal_board_messages.sql` - Internal board migration.
- `database/README.md` - Database notes.
- `docs/system-database.md` - System database documentation.
- `lib/context-trust.ts` - Source/truth/confidence labels for mixed memory and AI context.
- `lib/ccp-database.ts` - Local runtime database layer for development fallback, pure record builders, and report generation.
- `lib/pg-database.ts` - PostgreSQL source-of-truth wiring for production persistence and reports.
- `components/LocalAIConcierge.tsx` - Browser-local/rules-mode WebAI panel.
- `components/AiCommandInterface.tsx` - Unified AI front-end shell.
- `components/RoleAIWorkspace.tsx` - Role-safe workspace and context-trust labeling bridge.
- `components/PersistentChatBox.tsx` - Persistent chat and trust-aware saved AI exchanges.
- `app/api/ai/context/route.ts` - Central role-safe, trust-labeled AI context API.
- `app/api/ai/route-concierge/route.ts` - Server route concierge and optional self-hosted model bridge.
- `app/api/internal-board/route.ts` - Persistent internal board API.

MVP database concepts include:

- Leads
- Orders
- Delivery routes
- Fulfillment status
- Partial fulfillment
- Restock issues
- Driver notes
- Fuel notes
- Customer message records
- Owner-driver internal board records
- Owner-approved customer-facing board records
- Reports
- Wholesale accounts
- Customer status pipeline
- AI learning records
- Context source and truth metadata

Production should treat PostgreSQL as the only durable source of official truth. Local memory fallback is for development, demos, working context, driver notes, and AI interpretation only. In production, live order creation, lifecycle lead creation, fulfillment writes, sales queue writes, message writes, internal board writes, reports, and training exports should fail closed when PostgreSQL is required but not configured.

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
- `npm run typecheck` passes.
- `npm run license:audit` passes.
- `database/schema.sql` has been applied to the production PostgreSQL database.
- `database/migrations/20260611_internal_board_messages.sql` has been applied or `/api/internal-board` has successfully auto-created the table.
- `DATABASE_URL` is set in production.
- `CCP_REQUIRE_POSTGRES=true` is set in production.
- Owner-authenticated `/api/db/health` returns `ok: true` and `storage: postgres`.
- Owner-authenticated `/api/internal-board` returns `ok: true` and `storage: postgres`.
- Production order, lead-lifecycle, fulfillment, sales queue, message, internal board, report, and training routes fail closed instead of using memory as official truth when Postgres is unavailable.
- `/api/ai/context?role=owner` returns trust-labeled owner context after owner access.
- `/api/ai/context?role=driver` returns trust-labeled driver-scoped context after driver or owner access.
- Customer WebAI can answer public box/delivery/giveaway questions without exposing internal context.
- Driver WebAI only receives driver-scoped route/stop/message/internal-board context.
- Owner WebAI only receives owner-authenticated operational context.
- AI command panels display context source, truth level, confidence, and explanation.
- Chat memory saves include context-trust metadata.
- All customer pages load.
- Mobile header and bottom action bar work.
- Box Concierge stays minimized until clicked.
- Clean Light mode has readable card headings.
- Internal pages redirect to `/internal-access` when not authenticated.
- Owner and driver access codes work.
- Owner dashboard creates records that populate driver boards and reports.

## Official Branch Policy

`origin/main` is the only source of truth for this project.

### No Codespaces Rule

Do not use GitHub Codespaces for normal development on this repository. Codespaces creates extra working copies that drift from `origin/main`, which causes merge conflicts, stale files, and accidental branch divergence.

Forbidden for normal work:

- Phone Codespaces edits.
- Desktop Codespaces edits.
- Long-lived local branches.
- Ordinary VS Code Pull from a stale workspace.
- Force-pushing `main`.
- Keeping uncommitted experiments in any remote workspace.

Allowed workflow:

1. Make production changes directly against `origin/main` through GitHub-managed commits or a clean local clone.
2. Let Vercel deploy from `origin/main`.
3. Test the live site after deployment.
4. Use local development only when a terminal is required for checks, schema application, or build verification.
5. When local development is required, start from a clean reset to `origin/main` and stop after the commit is pushed.

### Clean Local Recovery

Use this before any emergency local work:

```bash
git fetch origin
git checkout main
git reset --hard origin/main
git clean -fd
```

This deletes local uncommitted changes and makes the local clone match `origin/main` exactly.

### Safe Local Push Flow

Only use this after the clean recovery step:

```bash
git checkout main
git pull --ff-only origin main
./wire-postgres.sh
```

If changes are intentionally made locally:

```bash
git add .
git commit -m "Describe the change"
./wire-postgres.sh --push
```

### Operating Law

`origin/main` wins. GitHub commits update it. Vercel deploys from it. Local copies are disposable. Codespaces are not part of the normal workflow.
