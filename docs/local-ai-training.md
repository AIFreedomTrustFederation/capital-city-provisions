# Local AI Training And Memory

Capital City Provisions uses open-source, repo-owned AI memory. The goal is to make customer, driver, and owner chat smarter without API keys, hosted AI services, or external training servers.

## Current Approach

The app uses three layers:

1. Role prompts in `components/LocalAIConcierge.tsx`.
2. Operational memory from `lib/ccp-database.ts` and `lib/ops-memory.ts`.
3. Repo-owned knowledge and training examples in `data/ai/`.

This is retrieval-first. The browser LLM is guided by local context and curated examples before any true fine-tuning is attempted.

## Files

- `data/ai/ccp-knowledge-base.json` stores durable business rules, role boundaries, deployment lessons, and route-learning signals.
- `data/ai/training-examples.jsonl` stores prompt/response examples that can be used for retrieval, evaluation, or local fine-tuning.
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

- Assigned stops
- Delivery status
- Fulfillment and partial fulfillment
- Restock issues
- Substitutions
- Fuel and miles
- Turn-ins

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

## Training Loop

1. Capture operational events as structured records.
2. Keep sample data separate from live data.
3. Review events before converting them into route rules.
4. Export approved examples to JSONL.
5. Use JSONL for local retrieval immediately.
6. Optionally fine-tune an open-source model outside production, then commit only license-safe adapters or config.

## External API Policy

Do not require external AI APIs for chat. The repo may use open-source packages and locally loaded models. If a model must be downloaded by the browser, disclose that it is an open-source local model and provide rules-mode fallback for unsupported devices.

## Deployment Lessons To Remember

- `typescript@5.7.0` does not exist. Use `5.7.3` for the 5.7 line.
- Next 16 defaults to Turbopack. This app currently builds with `next build --webpack`.
- Vercel build-rate-limit pages are not code failures.
- Pin exact dependency versions only after confirming the version exists.
- Keep Vercel install/build commands explicit.

## Next Improvement

Add an owner-only training review screen that reads `trainingDataset` from the live database and lets the owner approve examples before they are appended to `data/ai/training-examples.jsonl`.
