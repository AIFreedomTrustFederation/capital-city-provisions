# Lead Pipeline

The `/api/leads` route receives every landing-page and concierge lead, enriches it, classifies it, and optionally forwards it to owner notification and Google Sheets webhook destinations.

## Environment Variables

Set these in Vercel project settings.

```text
LEADS_WEBHOOK_URL=
LEADS_GOOGLE_SHEETS_WEBHOOK_URL=
```

## Lead Buckets

Leads are classified into these buckets:

- `wholesale`
- `confirmed-route`
- `waitlist-route`
- `household-freezer-box`
- `support`
- `general`

Each lead also receives:

- `priority`
- `ownerAction`
- `ownerText`
- `sheetRow`

## Owner Webhook

`LEADS_WEBHOOK_URL` receives:

```json
{
  "text": "Owner-readable lead summary",
  "lead": {
    "createdAt": "...",
    "routing": {},
    "ownerText": "...",
    "sheetRow": {}
  }
}
```

This works well for Discord, Slack, Make, Zapier, n8n, or any custom webhook that accepts JSON.

## Google Sheets Webhook

`LEADS_GOOGLE_SHEETS_WEBHOOK_URL` receives a flat `sheetRow` object suitable for a Google Apps Script web app or automation service.

Recommended sheet columns:

```text
createdAt, bucket, priority, ownerAction, name, email, phone, address, route, routeStatus, deliveryDay, deliveryWindow, interest, familySize, proteins, budget, recommendation, message, source
```

## Testing

After setting env vars, submit a test lead from the homepage ZIP checker and confirm:

1. The page shows the route-specific thank-you state.
2. The owner webhook receives `text` and `lead`.
3. The sheet receives a new row.
4. Vercel function logs show `Capital City Provisions lead:`.

## Receipt provenance and limitations

The server assigns `createdAt` and `receivedVia: capital-city-provisions-site` after parsing a submission. Caller-supplied values for these fields are ignored. The existing `source` field remains caller-reported for legacy lead classification and must not be used as authenticated origin evidence. `ok: true` confirms handler acceptance, not successful webhook delivery; inspect `notifications` and `storage` separately. Giveaway, support, and general leads do not create lifecycle orders, and the current handler logs the full lead payload; operational access and retention controls remain necessary.
