# Billing and Transaction System

Capital City Provisions uses an email-first billing workflow.

## Operating rule

No customer should become billable without a valid email address.

```text
ZIP check
→ lead or quote
→ owner confirms route and inventory
→ invoice email
→ approved payment method
→ receipt email
→ fulfillment
```

## Current implementation

Schema:

```text
database/schema.sql
```

Billing engine:

```text
lib/billing.ts
```

Owner API:

```text
/api/billing/invoices
```

Owner page:

```text
/billing
```

Owner component:

```text
components/BillingCenter.tsx
```

## Invoice statuses

```text
draft
sent
viewed
partial
paid
void
refunded
```

## Payment statuses

```text
pending
authorized
paid
failed
refunded
disputed
```

## Payment method labels

The billing system supports multiple payment method labels. Every method must still flow through invoice, payment, and receipt records.

```text
manual
cash
ach
zelle
check
btcpay
hosted-card
```

## Payment collection rule

Do not use customer messages, notes, or email bodies as the place where payment details are collected. Use approved payment links, owner-confirmed manual payment notes, or a verified outside payment page.

The CCP app should store safe payment records only: provider, method label, amount, processor reference, fee, net amount, receipt status, and optional card brand/last four when supplied by a payment provider.

## Email records

Every invoice and receipt should create an email log entry.

Email log statuses:

```text
queued
sent
failed
```

The current MVP queues email subject/body records. The next production hardening step is connecting a verified transactional email provider.

## Receipt rule

Every payment record should generate a receipt record and queued receipt email.

Receipts include:

- receipt number
- invoice number
- amount paid
- method label
- balance due
- delivery ZIP
- terms and policy language

## Refund and dispute tracking

The schema includes refund and dispute tracking so the owner can record refunds, partial refunds, disputes, and owner notes without losing original invoice/payment history.

## Tax categories

Line items include tax categories for owner/accountant review:

```text
grocery_food
prepared_food
delivery_fee
merchandise
promo_gift
wholesale
```

Do not hardcode live tax assumptions without owner/accountant review.

## Open-source and fee strategy

Open-source software can reduce platform/software fees, but external payment rails may still have costs. The system should prioritize lower-friction methods first:

```text
cash or local verified payment
ACH or bank transfer
Zelle or check where appropriate
BTCPay Server for Bitcoin / Lightning
hosted card checkout as a convenience option
```

## Remaining hardening before live transactions

- Persist invoice/payment/receipt records to PostgreSQL instead of memory MVP storage.
- Connect transactional email sending and email delivery status updates.
- Add customer invoice view page with secure token.
- Add owner-only payment method settings.
- Add BTCPay Server adapter.
- Add hosted checkout adapter if required.
- Add verified webhook handling for any external payment provider.
- Add refund and void workflows in owner UI.
- Add accounting export for invoices, payments, fees, refunds, and tax categories.
- Add terms of sale, cancellation/refund policy, delivery policy, and food handling language.

## Rule

Invoice first. Email the record. Confirm payment before fulfillment. Preserve every receipt. Keep payment collection out of free-text fields.
