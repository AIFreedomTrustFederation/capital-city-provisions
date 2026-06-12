# Capital City Provisions

Capital City Provisions is a Next.js customer-facing sales and operations site for premium freezer-box delivery, steak/menu presentation, route-aware ZIP capture, customer quote requests, giveaway entry, and AI-assisted box guidance.

The current build is designed around one rule: **the public site can look simple, but the customer path must stay wired into the CCP AI/lead engine.**

## Current public strategy

The homepage is now a lightweight gateway instead of a long duplicated sales funnel. It gives customers one clear starting point, then sends them to the dedicated page that matches their need.

Homepage responsibilities:

- Explain the core offer quickly.
- Show the main menu/box/giveaway paths.
- Capture a ZIP through `QuickRouteCapture`.
- Dispatch the saved ZIP into the global CCP AI/lead system.
- Keep mobile simple and not overwhelming.

Dedicated pages carry the details:

- `/menu` — premium steak-box menu, QR menu, phone ordering, menu graphics.
- `/freezer-boxes` — freezer package comparison and box selection.
- `/how-delivery-works` — delivery process, route grouping, expectations, and trust.
- `/delivery-map` — route area confidence and local delivery planning.
- `/giveaway` — free giveaway entry, rules clarity, and separate order bonus messaging.
- `/contact` — sales, support, wholesale, and general questions.
- `/customer` — customer portal.
- `/customer-concierge` — guided help choosing a box.
- `/pay` — deposit/invoice/payment path.
- `/reviews` — social proof.
- `/faq` — quick answers and objections.
- `/about` — founder story, trust system, and who CCP serves.

## Key customer-flow anchors

These anchors are part of the public customer journey and should not be renamed casually.

- `#quick-route` — rendered by `QuickRouteCapture` on the homepage. This is the primary homepage ZIP route check.
- `#delivery-zone-check` — rendered by `DeliveryZoneCheck` wherever that component is mounted. This performs the API-backed delivery-zone lookup.
- `#customer-account-journey` — rendered by `CustomerAccountJourney` wherever that component is mounted. This handles the full account/quote request flow.
- `#qr-menu` — rendered on `/menu` for QR/menu sharing.

Because the homepage was simplified, homepage ZIP links should point to `/#quick-route`, not `/#delivery-zone-check`, unless `DeliveryZoneCheck` is added back to the homepage.

## CCP AI / lead engine wiring

The global customer AI and lead layer is mounted in `app/layout.tsx`:

```tsx
<Navbar />{children}<Footer /><LeadCapture />
```

That means `LeadCapture` is available across the public site.

### `LeadCapture`

File: `components/LeadCapture.tsx`

Purpose:

- Global AI-assisted customer intake.
- Saves customer ZIP and lead memory in the browser.
- Opens the customer concierge modal.
- Recommends a plan from customer answers.
- Passes context into `LocalAIConcierge`.
- Posts completed leads to `/api/leads`.

Important storage keys:

- `ccp_delivery_zip`
- `ccp_latest_lead`
- `ccp_customer_saved`

Important event:

- `ccp:delivery-zip`

Important endpoint:

- `POST /api/leads`

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

### `DeliveryZoneCheck`

File: `components/DeliveryZoneCheck.tsx`

Purpose:

- API-backed ZIP zone lookup.
- Shows route coverage result.
- Routes supported ZIPs toward boxes and manual review ZIPs toward contact.

Important endpoint:

- `GET /api/delivery-zone?zip=#####`

Rendered anchor:

- `id="delivery-zone-check"`

### `CustomerAccountJourney`

File: `components/CustomerAccountJourney.tsx`

Purpose:

- Full quote/account intake form.
- Captures name, email, phone, ZIP, household, freezer space, preferred box, protein mix, budget, restock interest, giveaway interest, and notes.
- Creates customer/account and intake records.

Important endpoints:

- `POST /api/customer-account`
- `POST /api/customer-intake`

Rendered anchor:

- `id="customer-account-journey"`

### `PublicMobileStickyCTA`

File: `components/PublicMobileStickyCTA.tsx`

Purpose:

- Mobile quick action bar.
- Defaults to protected quote/ZIP anchors.
- Can receive page-specific `zipHref` and `quoteHref` props so it does not point to anchors that are not rendered on a given page.

Homepage usage:

```tsx
<PublicMobileStickyCTA zipHref="#quick-route" quoteHref="/customer-concierge" />
```

## Navigation and footer

### Navbar

File: `components/Navbar.tsx`

Core public labels are intentionally stable:

- Menu
- Boxes
- How It Works
- Delivery
- Giveaway
- Contact
- Team
- Start Quote
- Customer Portal

Avoid changing these labels unless the AI/customer system is updated to match.

### Footer

File: `components/Footer.tsx`

The footer is organized by buyer need:

- Shop By Need
- Delivery
- Business
- Help
- Promotions

It routes customers to the correct dedicated page instead of making the homepage carry every explanation.

## Mobile simplification

File: `app/mobile-simplify.css`

Purpose:

- Makes mobile less overwhelming.
- Reduces visible hero buttons.
- Compresses trust bars.
- Hides lower-priority homepage cards on small screens.
- Keeps forms, routes, anchors, and APIs intact.

This stylesheet is imported last in `app/layout.tsx` so it can override earlier mobile styles without rewriting the whole design system.

## Page-by-page plain-language map

### `/`

Gateway homepage. It introduces CCP, captures a quick ZIP route request through `QuickRouteCapture`, and sends customers to the right page: menu, boxes, delivery, giveaway, or contact. It does not duplicate the full quote form or detailed delivery page.

### `/menu`

Graphic menu and QR page. Built for quick sharing, scanning, phone orders, and premium steak-box presentation. Links customers to boxes, ZIP check, and concierge help.

### `/freezer-boxes`

Main freezer package comparison page. Explains the box options and helps customers choose the right package level.

### `/how-delivery-works`

Trust/process page. Explains ZIP-first delivery, route grouping, confirmation, and how CCP avoids overpromising.

### `/delivery-map`

Local route confidence page. Helps customers understand service area direction and route planning.

### `/giveaway`

Free giveaway page. Keeps no-purchase-required messaging clear and separates giveaway entry from limited order bonuses.

### `/official-rules`

Legal rules page for the giveaway.

### `/contact`

Customer routing page for sales, support, wholesale, and general questions.

### `/customer`

Customer portal path for people who have already started or need to continue.

### `/customer-concierge`

Guided help choosing. This is the best destination for customers who are not sure what to order.

### `/pay`

Payment/deposit/invoice path.

### `/reviews`

Social proof and customer trust page.

### `/faq`

Quick answers about ZIP checks, boxes, waitlists, wholesale, and follow-up.

### `/about`

Founder story, brand trust, service values, and public-versus-private system explanation.

### Local SEO pages

These pages target specific search intent and should route people into the main customer flow instead of duplicating the homepage:

- `/meat-delivery-sacramento`
- `/beef-delivery-sacramento`
- `/steak-delivery-sacramento`
- `/freezer-boxes-sacramento`
- `/family-freezer-boxes`
- `/steak-delivery`
- `/food-security-freezer-boxes`

## Do-not-break list

Do not casually rename, remove, or bypass these without checking the AI/lead flow:

- `LeadCapture`
- `QuickRouteCapture`
- `DeliveryZoneCheck`
- `CustomerAccountJourney`
- `PublicMobileStickyCTA`
- `LocalAIConcierge`
- `ccp_delivery_zip`
- `ccp_latest_lead`
- `ccp_customer_saved`
- `ccp:delivery-zip`
- `/api/leads`
- `/api/delivery-review`
- `/api/delivery-zone`
- `/api/customer-account`
- `/api/customer-intake`
- `/giveaway`
- `/official-rules`

## Current deployment notes

- The project is deployed on Vercel.
- GitHub `main` pushes trigger Vercel builds.
- Do not store Vercel API tokens, GitHub tokens, payment credentials, or mail credentials in the repo.
- Vercel/API tokens belong in provider settings or environment variables only.

## Development commands

```bash
npm install
npm run dev
npm run build
```

Use Node 20+ per the package requirements.
