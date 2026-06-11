# ZIP Operating System

Capital City Provisions uses Rancho Cordova 95670 as the delivery hub for ZIP-based routing.

## Source of truth

The ZIP map lives in:

```text
lib/service-area.ts
```

The shared ZIP classifier lives in:

```text
lib/zip-zone.ts
```

All customer-facing ZIP behavior, AI route behavior, lead enrichment, driver sales, and owner intelligence should use the shared ZIP-zone model instead of hardcoded one-off route tables.

## Public APIs

```text
/api/delivery-zone?zip=95670
```

Returns customer-safe ZIP status:

- `active`
- `group-route`
- `edge-route`
- `manual-review`
- `unknown`

```text
/api/ai/zip-route-concierge
```

POST endpoint for ZIP-aware route and box recommendations.

## Public UI

The reusable customer ZIP checker is:

```text
components/DeliveryZoneCheck.tsx
```

It is currently wired into:

- `/`
- `/freezer-boxes`
- `/delivery-map`

## Owner UI

Owner service-area intelligence is available at:

```text
/service-area-intelligence
```

Owner business intelligence is available at:

```text
/business-intelligence
```

## Owner Operator Brain

The Operator Brain uses the service map to score ZIP demand against delivery-ring economics:

- near demand is stronger than far demand
- active/core ZIPs are easier to route
- near ZIPs should be grouped
- extended ZIPs require grouped demand before dispatch
- outside-area ZIPs require manual review

API:

```text
/api/ops/operator-brain
```

## Lead enrichment target

Every lead/order should eventually store these fields:

```text
zip
deliveryZoneStatus
deliveryZoneCity
deliveryZoneCounty
deliveryZoneRing
deliveryZoneMinutes
deliveryZonePriority
deliveryZoneMessage
deliveryZoneNotes
```

These fields should travel into:

- Postgres lifecycle orders
- owner notifications
- Google Sheets row exports
- driver sales leads
- owner Operator Brain scoring
- WebAI owner context

## Rule

Do not create new hardcoded route ZIP tables. Use `lib/service-area.ts` and `lib/zip-zone.ts` for all ZIP logic.
