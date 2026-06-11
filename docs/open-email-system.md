# Open Email System

Capital City Provisions uses an internal message center and backup inbox without storing email secrets in Vercel or the app.

## Current path

```text
AI customer message generator
→ internal message record
→ Postgres backup inbox/outbox
→ owner sends from aifreedomtrust@gmail.com
→ customer replies to Gmail or plus-address department route
→ owner imports/forwards reply into CCP inbox backup
→ owner/customer AI context
```

## No-secret rule

Do not store Gmail, SMTP, app-password, or mailbox secrets in Vercel or the repo.

The app should generate the best customer message and preserve the record. The actual send remains owner-controlled through Gmail or the device mail app.

## Department routing

Use Gmail plus-address routing from the existing mailbox:

```text
aifreedomtrust+ccp-sales@gmail.com
aifreedomtrust+ccp-billing@gmail.com
aifreedomtrust+ccp-delivery@gmail.com
aifreedomtrust+ccp-support@gmail.com
aifreedomtrust+ccp-owner@gmail.com
```

These all arrive in the same Gmail inbox, while allowing Gmail filters/labels to sort by department.

## Files

```text
lib/customer-messages.ts
lib/ccp-email-routing.ts
lib/email-system.ts
app/api/email-system/route.ts
components/EmailCommandCenter.tsx
app/billing/page.tsx
database/schema.sql
```

## Database tables

Existing transaction emails are recorded in:

```text
billing_email_log
```

The internal inbox/outbox backup is recorded in:

```text
customer_email_messages
```

## Owner UI

The owner opens:

```text
/billing#email-command
```

The owner can:

- generate customer-ready messages by stage
- queue generated outbound records
- review inbox/outbox backup records
- manually import received customer replies

## Message stages

```text
lead-thank-you
quote-reminder
invoice-ready
receipt-issued
appointment-confirmed
delivery-follow-up
```

## Received email backup

No app secret is needed for received email if the owner uses Gmail as the source of truth and then imports customer replies into CCP.

Supported no-secret methods:

```text
copy/paste customer reply into the Email Command Center
forward relevant customer replies to a department plus-address for Gmail filtering
later: export Gmail messages and import them through a local/offline job
```

## Why not automatic Gmail send without secrets?

A server cannot send as a Gmail account without authorization. That authorization is a secret, OAuth grant, app password, or token somewhere. Since the rule is no secrets in Vercel/app, the safest design is owner-controlled compose/send plus internal backup records.

## Future optional adapters

Only add these if the owner later accepts a secret stored outside the repo:

```text
local-only SMTP sender
self-hosted mail server
IMAP import worker
Gmail API OAuth outside Vercel
```

## Rule

AI writes. CCP remembers. Gmail sends. Gmail receives. Owner imports or routes replies back into CCP. No mailbox secrets live in Vercel.
