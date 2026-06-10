# Local AI Training And Memory

Capital City Provisions uses open-source, repo-owned AI memory plus production operational records. The goal is to make customer, driver, and owner chat smarter without requiring external AI APIs for normal chat.

## Current Approach

The app uses four layers:

1. Role prompts in `components/LocalAIConcierge.tsx`.
2. Browser-local WebAI through `@mlc-ai/web-llm` when WebGPU is available.
3. Rules-mode fallback when the local model cannot load.
4. Production operational memory from PostgreSQL-backed APIs, with local in-memory fallback only for development/demo mode.

This is retrieval-first. The browser LLM is guided by role-safe context and curated examples before any true fine-tuning is attempted.

## Files

- `components/LocalAIConcierge.tsx` runs the customer, driver, and owner WebAI panel.
- `app/api/ai/context/route.ts` provides the role-safe WebAI context endpoint.
- `app/api/ai/route-concierge/route.ts` provides deterministic route help and optional self-hosted model bridge.
- `app/api/db/training/route.ts` exports live training records from PostgreSQL in production.
- `data/ai/ccp-knowledge-base.json` stores durable business rules, role boundaries, deployment lessons, and route-learning signals.
- `data/ai/training-examples.jsonl` stores curated repo-owned prompt/response examples that can be used for retrieval, evaluation, or local fine-tuning.
- `lib/ai-knowledge.ts` loads the repo knowledge into the app.

## Role Separation

Customer AI may discuss:

- Freezer boxes
- Steak delivery
- ZIP and route estimates
- Delivery process
- Wholesale inquiry intake
- Cheesecake order bonus
- Free giveaway rules

Customer AI must not discuss:

- Driver tools
- Owner reports
- Profit/loss
- Internal database details
- Access codes
- Route training internals
- Driver turn-ins

Driver AI may discuss:

- Assigned live stops
- Delivery status
- Fulfillment and partial fulfillment
- Restock issues
- Substitutions
- Fuel and miles
- Turn-ins
- Driver sales queue actions

Owner AI may discuss:

- Leads
- Orders
- Routes
- Reports
- Restock risk
- Profit estimates
- Exports
- Database health
- Deployment lessons
- Route learning
- Sales queue review

## WebAI Context Endpoint

`/api/ai/context` is now the official role-safe context layer before WebAI receives operating memory.

```text
/api/ai/context?role=customer
/api/ai/context?role=driver
/api/ai/context?role=owner
```

Context rules:

- Customer context is public-safe and does not require private operational records.
- Driver context requires driver or owner session access.
- Owner context requires owner session access.
- Owner and driver context use PostgreSQL when available.
- In production or when `CCP_REQUIRE_POSTGRES=true`, operational context fails closed if PostgreSQL is unavailable.

## Training Sources

There are two training-memory paths:

1. **Repo-owned examples:** `scripts/export-ai-training.mjs` exports curated files from `data/ai/` into `training-output/ccp-local-training.jsonl`.
2. **Live operational examples:** `/api/db/training` exports structured learning events from the live database. In production, this should come from PostgreSQL, not temporary memory state.

Repo-owned examples are safe defaults. Live operational examples must be owner-reviewed before they are committed to repo-owned training files or used for fine-tuning.

## Training Loop

1. Capture operational events as structured live records.
2. Keep fake/sample records out of production UI and live training memory.
3. Store production events in PostgreSQL.
4. Review events before converting them into route rules.
5. Export approved examples to JSONL.
6. Use JSONL for local retrieval immediately.
7. Optionally fine-tune an open-source model outside production, then commit only license-safe adapters or config.

## External API Policy

Do not require external AI APIs for normal chat. The repo may use open-source packages, locally loaded models, and optional self-hosted model endpoints. If a model must be downloaded by the browser, disclose that it is an open-source local model and provide rules-mode fallback for unsupported devices.

## Deployment Lessons To Remember

- `typescript@5.7.0` does not exist. Use `5.7.3` for the 5.7 line.
- Next 16 defaults to Turbopack. This app currently builds with `next build --webpack`.
- Vercel build-rate-limit pages are not code failures.
- Pin exact dependency versions only after confirming the version exists.
- Keep Vercel install/build commands explicit.
- Production AI training exports should use PostgreSQL-backed records.

## Next Improvement

Wire the UI WebAI panels to request `/api/ai/context` before answering, then pass that context into `LocalAIConcierge` by role.
