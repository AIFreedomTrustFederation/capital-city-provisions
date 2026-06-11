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

## Customer lead capture

`components/LeadCapture.tsx` now uses `zipZone()` instead of a local hardcoded route table.

Customer leads submitted through the box concierge now carry:

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

The lead is enriched before posting to `/api/leads`, so current owner notifications and sheet rows can receive the ZIP-zone fields without requiring the production lead route to be rewritten first.

## Driver sales capture

`components/DriverSalesRouteMode.tsx` now enriches driver-captured leads with ZIP-zone metadata before saving them.

`/api/ops/driver-sales` also calls `withZipZone()` server-side, preserving ZIP-zone fields into:

- live driver sales queue
- PostgreSQL driver sales lead save
- owner webhook text
- Google Sheets webhook payload

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

## Remaining server-side hardening

The large production `/api/leads` route should eventually call `withZipZone()` directly as a server-side backstop. The client-side lead concierge already sends the ZIP-zone fields, but server-side enrichment would protect future non-browser lead sources.

When editing `/api/leads`, preserve these fields in owner text, sheet row, lifecycle order notes, and any Postgres order metadata available.

## Rule

Do not create new hardcoded route ZIP tables. Use `lib/service-area.ts` and `lib/zip-zone.ts` for all ZIP logic.
