# AI Data

This folder stores Capital City Provisions repo-owned AI memory so the system can stay open-source, portable, and external-API-free for normal chat.

## Files

- `ccp-knowledge-base.json` - durable rules, role boundaries, deployment lessons, route-learning signals, and owner rules.
- `training-examples.jsonl` - curated supervised examples for retrieval, evaluation, or local fine-tuning.

## How To Use Repo-Owned Examples

Run the local export script from the repo root:

```bash
node scripts/export-ai-training.mjs
```

It writes:

```bash
training-output/ccp-local-training.jsonl
```

That output can be used by local open-source tooling such as llama.cpp, Ollama-adjacent local workflows, MLX, Axolotl, or any other license-compatible trainer.

## Live Operational Training

Live operational training records are different from repo-owned examples.

- Repo-owned examples live in `data/ai/`.
- Live operational records should come from PostgreSQL through `/api/db/training` in production.
- Local in-memory training records are development/demo only.
- Owner approval is required before live operational events are committed back into repo-owned examples or used for fine-tuning.

## Safety Rules

- Keep customer, driver, and owner examples separated by role.
- Never train customer chat to reveal owner or driver tools.
- Never train the model to say buying improves giveaway odds.
- Keep sample data separate from live records.
- Keep private customer data out of the repo unless it has been reviewed, approved, and intentionally sanitized.
- Owner approval is required before live operational events become training examples.
