# AI Data

This folder stores Capital City Provisions AI memory in the repo so the system can stay open-source, portable, and external-API-free.

## Files

- `ccp-knowledge-base.json` - durable rules, role boundaries, deployment lessons, route-learning signals, and owner rules.
- `training-examples.jsonl` - supervised examples for retrieval, evaluation, or local fine-tuning.

## How To Use

Run the local export script from the repo root:

```bash
node scripts/export-ai-training.mjs
```

It writes:

```bash
training-output/ccp-local-training.jsonl
```

That output can be used by local open-source tooling such as llama.cpp, Ollama-adjacent local workflows, MLX, Axolotl, or any other license-compatible trainer. Do not commit private customer data unless it has been reviewed and approved for training.

## Safety Rules

- Keep customer, driver, and owner examples separated by role.
- Never train customer chat to reveal owner or driver tools.
- Never train the model to say buying improves giveaway odds.
- Keep sample data separate from live records.
- Owner approval is required before live operational events become training examples.
