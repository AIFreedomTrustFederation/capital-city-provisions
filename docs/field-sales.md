# Field Sales and Cold Door-to-Door System

Capital City Provisions can create sales from cold door-to-door knocking without breaking route discipline or compliance.

## Goal

Turn a cold knock into a clean operating signal:

```text
Knock
→ ZIP classification
→ conversation status
→ captured lead
→ driver sales queue
→ owner follow-up
→ Operator Brain route demand
```

## Page

```text
/field-sales
```

This page is behind driver access and uses:

```text
components/FieldSalesKnockMode.tsx
```

## What gets captured

- Field rep name
- Lead name
- Phone
- Email
- Street or apartment note
- ZIP
- Household size
- Need
- Offer
- Estimated value
- Knock status
- Callback time
- Real conversation note
- Delivery-zone metadata from `zipZone()`

## Knock statuses

```text
not-home
not-interested
warm
hot
reserved
follow-up
```

These map into the existing live driver-sales queue:

- `not-home` and `not-interested` become skipped/watch-style records
- `warm` and `follow-up` become queued leads
- `hot` becomes pitched
- `reserved` becomes reserved

## Compliance guardrails

Field reps must not:

- claim fake scarcity
- promise delivery before ZIP and route confirmation
- claim purchase improves giveaway odds
- pressure customers at the door
- argue with not-interested households
- imply an order exists when no order exists

Field reps should:

- ask for ZIP first
- explain route confirmation clearly
- capture a real phone or email before marking warm/hot
- leave only approved material where allowed
- keep the giveaway separate from orders

## ZIP rule

All field sales ZIP behavior must use:

```text
lib/service-area.ts
lib/zip-zone.ts
```

No separate hardcoded ZIP route tables.

## Owner workflow

Door-knock leads flow into `/api/ops/driver-sales`, which saves the record into the live sales queue and includes delivery-zone metadata for owner review, Google Sheets, and the Operator Brain.
