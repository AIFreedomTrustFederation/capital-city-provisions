# Capital City Provisions

Capital City Provisions is a Next.js public sales, customer support, and operations site for premium freezer-box delivery, steak/menu presentation, route-aware ZIP capture, customer quote requests, giveaway entry, and stocked-home food planning.

The current public brand rule is simple:

> **Capital City Provisions should feel like a premium provisions company, not a technology product.**

Customer-facing copy should use concierge, support, guide, delivery review, route check, stock-up plan, customer care, and partner network language. Do not use technical assistant language in public brand copy.

Internal code may contain implementation names for tools and helpers, but those names should not appear in customer-facing UI copy.

## Public language rules

Use:

- Customer Concierge
- Guide
- Guided service
- Help choosing
- Route review
- ZIP check
- Delivery check
- Stock-up plan
- Freezer-ready provisions
- Customer care
- Partner network
- Local delivery coordination
- Premium freezer provisions

Avoid in public UI:

- bot
- artificial intelligence
- automation
- algorithm
- model
- LLM
- machine learning
- tech stack
- prompt
- rules mode

Preferred replacements:

- technical helper language -> concierge
- bot -> guide or support
- rules mode -> ready or support ready
- smart/smarter -> clear, clearer, guided, or dependable
- command center -> operations center on internal pages only

## Current public strategy

The homepage is a lightweight gateway instead of a long duplicated sales funnel. It gives customers one clear starting point, then sends them to the dedicated page that matches their need.

Homepage responsibilities:

- Explain the core offer quickly.
- Show the main menu, box, delivery, offer, and contact paths.
- Capture a ZIP through `QuickRouteCapture`.
- Send the saved ZIP into the global lead and customer support flow.
- Keep mobile simple and not overwhelming.
- Avoid stacked floating CTAs on mobile.

Dedicated pages carry the details:

- `/menu` — premium steak-box menu, QR menu, phone ordering, and menu graphics.
- `/freezer-boxes` — freezer package comparison and box selection.
- `/family-freezer-boxes` — family-focused freezer stock-up plans.
- `/steak-delivery` — steak delivery offer page.
- `/how-delivery-works` — delivery process, route grouping, expectations, and trust.
- `/delivery-map` — route area confidence and local delivery planning.
- `/giveaway` — free giveaway entry, rules clarity, and separate order bonus messaging.
- `/official-rules` — giveaway rules and no-purchase-required language.
- `/contact` — sales, support, wholesale, and general questions.
- `/customer` — customer portal.
- `/customer-concierge` — guided help choosing a box.
- `/reviews` — social proof.
- `/faq` — quick answers and objections.
- `/about` — founder story, trust system, and who CCP serves.

## Key customer-flow anchors

These anchors are part of the public customer journey and should not be renamed casually.

- `#quick-route` — rendered by `QuickRouteCapture` on the homepage.
- `#delivery-zone-check` — rendered by `DeliveryZoneCheck` wherever that component is mounted.
- `#customer-account-journey` — rendered by `CustomerAccountJourney` wherever that component is mounted.
- `#qr-menu` — rendered on `/menu` for QR/menu sharing.

Homepage ZIP links should point to `/#quick-route`, not `/#delivery-zone-check`, unless `DeliveryZoneCheck` is added back to the homepage.

## Core components

### `LeadCapture`

File: `components/LeadCapture.tsx`

Purpose:

- Global customer intake.
- Saves customer ZIP and lead memory in the browser.
- Opens the customer concierge modal.
- Recommends a plan from customer answers.
- Posts completed leads to `/api/leads`.

Important storage keys:

- `ccp_delivery_zip`
- `ccp_latest_lead`
- `ccp_customer_saved`

Important event:

- `ccp:delivery-zip`

Important endpoint:

- `POST /api/leads`

Customer-facing warning:

- Do not expose internal helper language in this component.
- On mobile, do not re-enable the old bottom action bar if the robot guide button is active.

### `QuickRouteCapture`

File: `components/QuickRouteCapture.tsx`

Purpose:

- Fast homepage ZIP check.
- Saves ZIP into `ccp_delivery_zip`.
- Dispatches `ccp:delivery-zip` so `LeadCapture` can use the ZIP.
- Saves quick route lead memory.
- Posts route review details.

Important storage keys:

- `ccp_delivery_zip`
- `ccp_quick_route_lead`
- `ccp_route_prompt_page`
- `ccp_latest_lead`

Important endpoints:

- `POST /api/leads`
- `POST /api/delivery-review`

Rendered anchor:

- `id="quick-route"`

Mobile warning:

- `QuickRouteCapture` has a route nudge component. On mobile, that nudge is hidden by `app/mobile-stack-fix.css` to prevent footer clutter.

### `PublicMobileStickyCTA`

File: `components/PublicMobileStickyCTA.tsx`

Purpose:

- Mobile robot-style guide launcher.
- Should be the only floating mobile action near the bottom of the screen.
- Can receive page-specific `zipHref` and `quoteHref` props.

Homepage usage:

```tsx
<PublicMobileStickyCTA zipHref="#quick-route" quoteHref="/customer-concierge" />
```

## Navigation and footer

Navbar public labels should stay simple and customer-focused:

- Menu
- Boxes
- How It Works
- Delivery
- Offer
- Contact
- Team
- Concierge
- Customer Portal

The footer is organized by buyer and business need:

- Shop
- Customers
- Business
- Company
- Legal

The footer includes the LLC name, trust badges, Partner Network notice, copyright language, legal links, and supplier/driver/vendor partnership links.

Footer pages that should exist:

- `/privacy`
- `/terms`
- `/refund-policy`
- `/official-rules`
- `/sms-terms`
- `/accessibility`
- `/affiliate-suppliers`
- `/drivers`
- `/catering-partners`
- `/vendor-intake`
- `/route-partnerships`

## Mobile simplification

The mobile experience should feel clean, not stacked or desperate.

`app/mobile-stack-fix.css` is loaded after the other stylesheets. It hides older floating mobile layers and keeps only the robot guide button floating.

Current mobile cleanup rules:

```css
@media(max-width:760px){
  .mobile-action-bar{display:none!important}
  .theme-toggle{display:none!important}
  .route-nudge{display:none!important}
  .public-mobile-cta{right:14px!important;bottom:calc(14px + env(safe-area-inset-bottom))!important}
  body{padding-bottom:0!important}
}
```

Do not re-enable multiple floating mobile CTAs at the same time.

## Deployment notes

Vercel is connected to GitHub and should deploy from pushes to `main`. If Vercel reports `build-rate-limit`, do not keep pushing small commits. Wait for the build limit to reset, then redeploy once.

Recommended deployment discipline:

- Batch small copy/CSS fixes together.
- Avoid rapid commits while Vercel is rate-limited.
- Use one final polish commit when ready.
- Then manually redeploy from Vercel if the automatic deployment was blocked.

## Verification commands

Full local verification:

```bash
npm run verify
```

That runs typecheck, license audit, and the full Next build.

Build only:

```bash
npm run build
```

Typecheck only:

```bash
npm run typecheck
```

## Final pre-deploy checklist

Before the next Vercel deploy, verify:

- No technical helper language appears in public UI.
- The homepage has one clear ZIP path.
- The mobile footer is not covered by stacked CTAs.
- Only the robot guide launcher floats on mobile.
- Footer accordion sections open and close cleanly on mobile.
- Legal and business footer links resolve to real pages.
- Customer concierge uses guide, concierge, and support language.
- Vercel build limit has reset before pushing another final code batch.
