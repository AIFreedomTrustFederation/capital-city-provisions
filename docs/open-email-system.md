# Open Email System

Capital City Provisions uses an internal email command center and backup inbox before connecting any paid email service.

## Current path

```text
AI customer message generator
→ internal email record
→ Postgres backup inbox/outbox
→ manual send or future SMTP adapter
→ received reply import
→ owner/customer AI context
```

## Files

```text
lib/customer-messages.ts
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
- queue generated outbound messages
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

## Free/open-source-first delivery strategy

The most open and low-cost path is standard SMTP.

Environment variables planned for SMTP:

```text
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_FROM
```

The current system stores and queues messages without requiring a paid API. Once an SMTP runtime sender is installed and configured, queued records can be sent and then marked sent or failed.

## Current limitation

The app does not yet install a runtime SMTP sender dependency. Until that is added, queued emails remain available for manual sending and backup. This avoids breaking deployment while preserving the full communication record.

## Future adapters

Possible open-source-friendly adapters:

```text
self-hosted SMTP
mailcow SMTP
Postfix/Dovecot SMTP/IMAP
Gmail SMTP if used manually
Nodemailer adapter after dependency install
IMAP import worker for received replies
```

## Rule

Every customer communication should be recorded before or after it is sent. The system should never depend on a provider dashboard as the only copy of customer history.
