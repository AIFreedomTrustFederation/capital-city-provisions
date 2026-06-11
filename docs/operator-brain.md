# Owner Operator Brain

The Operator Brain is the owner-only intelligence layer for Capital City Provisions.

It does not replace PostgreSQL. PostgreSQL remains the durable source of truth. The brain reads source-of-truth records and turns them into operator actions.

## Source-of-truth inputs

- Live orders
- Driver sales leads
- Owner reports
- Route demand
- Fulfillment/restock signals
- Training/event records

## API

```text
/api/ops/operator-brain
```

This route requires owner access through the `ccp_access=owner` cookie.

In production, if `CCP_REQUIRE_POSTGRES=true` and PostgreSQL is unavailable, the operator brain fails closed instead of using temporary memory.

## Output

The API returns:

- `recommendedActions` — what the owner should do first
- `hotZips` — ZIP demand ranked by orders, leads, and value
- `routes` — route focus ranked by value, open stops, and restock pressure
- `restockRisks` — inventory warnings from fulfillment and product signals
- `salesPriorities` — driver sales leads ranked by value and intent

## Owner UI

```text
/business-intelligence
```

This owner-gated page renders `OperatorBrainPanel`, which calls `/api/ops/operator-brain`.

## Owner WebAI context

`/api/ai/context?role=owner` also includes a compact `operatorBrain` object so Owner AI can answer questions like:

- What should I do first today?
- Which ZIP is hottest?
- Which sales lead should I follow up with first?
- What inventory should I protect before promising premium boxes?
- Which route needs attention?

## Rule

WebAI talks. PostgreSQL remembers. Rules mode protects the experience. Role boundaries protect the data. Operator Brain tells the owner what to do next.
