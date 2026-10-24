# Capital City Provisions — Applied Business and Customer Operations

**The applied-business layer of the AI Freedom Trust Federation: a real-world premium provisions company and customer-operations system through which trust, delivery coordination, concierge service, and accountable business workflows are tested in ordinary commerce.**

| Federation metadata | Value |
| --- | --- |
| Layer | `applied-business` |
| Role | applied federation business model and real-world provisions system |
| Workspace | `AIFT/capital-city-provisions` |
| Application | Next.js / TypeScript public sales and customer-operations site |
| Deployment | Vercel from `main` |
| Verification | `npm run verify` with typecheck, lint, and build checks |
| Public brand rule | customer-first provisions company; Federation technology remains behind the service experience |

Capital City Provisions is where the Federation must prove that its principles can survive contact with ordinary work. Customers do not come to this project to study agent architecture. They come to choose food, understand delivery, ask for help, check a route, request a quote, enter a promotion, and receive dependable service. The technology is successful when those relationships become clearer, not when the customer is forced to learn the machinery behind them.

The deeper Federation covenant is carried in the [One Eternal Scroll of ALO'ha](https://aifreedomtrustfederation.github.io/AI-Freedom-Trust/docs/pdf/one-eternal-scroll-of-aloha.pdf), with operational discipline defined by [SOP-ALOHA-001](https://github.com/AIFreedomTrustFederation/AI-Freedom-Trust/blob/main/SOP-ALOHA-001.md). On the public storefront, that covenant appears as care, accuracy, consent, privacy, honest delivery expectations, and a human-readable path to support.

---

## Book I — Trust at the Doorstep

The applied-business layer begins with a simple test: can the system make a real transaction and delivery relationship more trustworthy without making it less human?

Capital City Provisions answers through concierge-led commerce. A customer can understand the offer, check whether delivery is practical, compare freezer-ready options, ask for guidance, provide a ZIP, request follow-up, and move through a buying journey without being treated as raw data for an invisible optimization engine.

Public language therefore remains intentionally non-technical. The customer sees **Customer Concierge, route review, delivery check, stock-up plan, customer care, partner network, and premium provisions**. Internal AI, model, automation, prompt, or infrastructure language belongs behind the interface unless the customer genuinely needs that information to make an informed decision.

---

## Book II — What Capital City Provisions Owns

This repository owns the **real business and customer workflow**. Its public routes include the homepage, menu and freezer-box surfaces, steak delivery, family planning, delivery explanation and map, giveaway and rules, contact, customer portal, concierge, reviews, FAQ, and company story. Components such as `LeadCapture` and `QuickRouteCapture` connect the public experience to ZIP-aware customer intake and delivery review.

Its Federation integrations remain subordinate to that business purpose:

- **AIFT-OS / Runtime → operations:** the Federation can inspect repository health, builds, deployments, and operational tooling without exposing control-plane language to customers.
- **AIFT-Forge → reusable patterns:** shared agent, build, or provider patterns may improve internal operations while the storefront remains a provisions experience.
- **VPS / hosting infrastructure → service availability:** infrastructure may host or support the application; the business retains ownership of customer promises, delivery operations, and public content.
- **Aetherion → future settlement or stewardship interfaces:** any value-system integration must remain optional, explicit, and separate from ordinary customer payment or financial claims until a real governed implementation exists.
- **AetherianGovernance → policy and authority:** promotions, data handling, internal permissions, and high-impact operational decisions can use governed approval patterns.
- **TastyCutz ↔ applied-business peer:** both repositories occupy the applied-business layer, but each keeps its own customer experience, deployment state, data, and source of truth.

This repository is evidence that the Federation can support real work without making every business look like a Federation dashboard.

---

## Book III — SOP-ALOHA-001 in Customer Operations

The shared covenant becomes a service lifecycle:

```text
Receive → Inspect → Name → Propose → Consent → Act → Verify → Record → Return
```

**Receive** accepts a ZIP, quote request, customer question, promotion entry, delivery need, or operational event. **Inspect** checks the information actually provided and the current delivery or product context. **Name** identifies the customer need, route state, requested product, and responsible operational path. **Propose** offers a suitable box, delivery path, or concierge recommendation without presenting a recommendation as a completed order. **Consent** protects customer contact, purchase, promotions, personal information, and any external communication. **Act** performs the approved lead, route-review, order-support, or operational step. **Verify** checks that the request was stored, sent, built, or routed as intended. **Record** keeps the minimum useful customer and operational memory. **Return** gives the customer a clear next step rather than leaving them inside an automated loop.

Local development and verification remain straightforward:

```bash
npm install
npm run dev
npm run verify
```

Focused checks include:

```bash
npm run typecheck
npm run lint
npm run build
```

### CI preflight-to-main promotion boundary

The [preflight promotion workflow](.github/workflows/sync-preflight-to-main.yml)
can update `main` after the **Capital City Provisions CI** workflow passes
for a push to this repository's `preflight` branch. It now checks the
completed run's event, result, source branch, and repository identity, then
reads the current remote `preflight` ref to ensure it still matches the
tested commit before requesting a non-force fast-forward of `main`.
Successful pull-request or manual CI runs and stale preflight runs are
skipped, not treated as authorization to publish their head commits.

Run `npm run test:preflight-sync` to exercise the promotion decision with
mocked GitHub API responses; `npm run verify` includes these regressions.
These tests do not update a real GitHub branch. The ref check and subsequent
update are not atomic, so a concurrent push remains a possible race.
GitHub branch protection, human review, production deployment, and live
customer operations require independent verification. A successful CI
result alone is not proof that Vercel deployed the change.

### Safe local auto-sync boundary

`bash auto-sync-safe.sh` must start on `main`. When the working tree is dirty, it commits the local changes **on a new backup branch**, pushes that backup to `origin`, and only then returns to `main` to fetch, fast-forward, validate, and potentially push. A failed backup push stops the operation; a failed validation does not publish `main`. Backups may contain any locally staged or untracked files, so **inspect for credentials and customer data before invoking this script**. This is not a deployment-health check. Run `npm run test:git-sync` for disposable-repository Git regressions; `npm run verify` includes them.

### Customer quote read boundary

`POST /api/customer-intake` remains public so customers can request quotes. Quote records contain names, email addresses, phone numbers, and other customer-supplied information. **`GET /api/customer-intake` is private** and requires a server-side `CCP_QUOTE_READ_TOKEN` environment variable of at least 32 non-whitespace characters. Generate a strong random token with `openssl rand -hex 32`, configure it in the deployment's secret environment settings, and send it only from an authorized server-side operator client as `Authorization: Bearer <token>`. Never embed the token in browser JavaScript, public `NEXT_PUBLIC_*` variables, query strings, or documentation.

Without a configured token, GET fails closed with HTTP 503; missing or invalid credentials return HTTP 401. Authorized GET responses are marked `Cache-Control: private, no-store` and return at most 200 records from the existing in-memory quote store. The endpoint does not establish durable quote persistence, individual customer authorization, or protection for other operations APIs. The existing `ccp_access` role cookie is **not** sufficient for this private quote export. The verification command `npm run test:quote-read-access` exercises token acceptance and rejection; `npm run verify` also runs these regression tests before typechecking, linting, license audit, and build.

### Internal owner/driver role-cookie limitation

The internal access form checks a configured access code through [`/api/access`](app/api/access/route.ts), then sets the `ccp_access` cookie to the literal role `owner` or `driver`. The [route proxy](proxy.ts) and some [operational API handlers](app/api/ai/context/route.ts) trust that role value without a cryptographic signature or server-side session verification. Cookie attributes such as `HttpOnly`, `SameSite`, and production `Secure` do not authenticate a caller who supplies their own HTTP cookie header. **This role-cookie mechanism is not a production-grade authorization boundary.**

Do not rely on it alone to protect customer records, owner reports, driver operations, or role-specific AI context. Before exposing sensitive operational routes to untrusted clients, enforce server-verified authentication and per-endpoint authorization, or place the interfaces behind independently enforced access controls; add regression tests for unauthorized direct API requests. The separate `CCP_QUOTE_READ_TOKEN` requirement protects only the private quote-listing GET endpoint and does not secure other internal APIs. This section describes the current implementation, not a completed security repair.

The public experience should remain mobile-readable, legally coherent, and free from internal implementation language that does not help the customer.

---

## Book IV — The Federation Proved in Ordinary Service

The significance of Capital City Provisions is not that it demonstrates the most advanced theory in the organization. It demonstrates whether the theory can become dependable service. Trust is tested when the route is late, a customer needs help choosing, a promotion needs clear rules, a lead must not be lost, or an internal system must tell the truth about what happened.

The company remains a company. Its customers are not required to become members of a technical ideology in order to receive good service. The Federation serves quietly through better accountability, better memory, safer automation, and clearer human handoffs.

### The Return of the Word

Here the Word returns at the doorstep. A customer expresses a need, the system understands enough to guide rather than confuse, the business acts, the result is verified in the real world, and the relationship returns as service that can be trusted. Technology fulfills its purpose when the customer remembers the care more than the machinery.
