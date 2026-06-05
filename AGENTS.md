# AGENTS.md — Capital City Provisions

Repository-level instructions for Codex and other AI coding agents.

## Project Summary

Capital City Provisions is a premium protein delivery website built with Next.js, React, TypeScript, Tailwind CSS, and Vercel Analytics.

The site supports:

- Customer-facing marketing pages
- Freezer box pages
- Catalog and delivery pages
- Wholesale inquiry flow
- Lead capture API route
- Internal operational pages such as driver, ops, and reports

## Primary Goals

When working in this repository, prioritize:

1. Launch readiness
2. Customer trust
3. Mobile responsiveness
4. Conversion rate improvements
5. SEO and local search visibility
6. Clean, maintainable TypeScript/React code
7. Safe Git workflow with no destructive operations

## Brand Voice

Use a premium, trustworthy, local-service tone.

Preferred phrases:

- Modern quality. Traditional values.
- Delivered with a heartbeat.
- Premium proteins delivered with care.
- Family freezer boxes.
- Ranch-direct quality.

Avoid language that sounds generic, cheap, spammy, or exaggerated.

## Technical Stack

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS plus project CSS
- Analytics: Vercel Analytics
- Runtime target: Vercel

## Common Commands

Use these commands before proposing or finalizing code changes:

```bash
npm install
npm run typecheck
npm run build
```

`npm run lint` exists in `package.json`, but may depend on Next.js/ESLint compatibility. If lint fails because of framework tooling, report it separately from build/typecheck failures.

## Git Safety Rules

Never run destructive Git commands unless the user explicitly asks and a backup branch has already been pushed.

Do not run automatically:

```bash
git reset --hard
git clean -fd
git push --force
git branch -D
gh codespace delete --all --force
```

If rescue or cleanup is needed:

1. Create a timestamped backup branch.
2. Commit all local work to that branch.
3. Push the backup branch.
4. Only then continue with safe recovery steps.

Use fast-forward-only updates when possible:

```bash
git fetch origin
git merge --ff-only origin/main
```

## Codespace Workflow

This repository includes utility scripts for Codespace cleanup and recovery.

- `sync-all-codespaces.sh` — creates a backup branch and applies safe file changes without raw merging.
- `check-all-codespaces-sync.sh` — checks whether all Codespaces are clean and synced.
- `rescue-unsynced-codespace.sh` — preserves unsynced work on a rescue branch without destructive reset.

When modifying these scripts:

- Preserve backup-first behavior.
- Avoid raw merges from stale rescue branches.
- Skip generated or conflict-prone files unless specifically required.
- Never delete Codespaces unless all checks pass and the user confirms.

## Conflict-Prone Files

Do not restore these from rescue branches unless the task explicitly requires it:

- `package-lock.json`
- `npm-shrinkwrap.json`
- `yarn.lock`
- `pnpm-lock.yaml`
- `bun.lockb`
- `node_modules/`
- `.next/`
- `dist/`
- `build/`
- `coverage/`

For dependency updates, update `package.json` intentionally, then regenerate the lockfile from a clean `main` checkout.

## Public Image Inventory

Images should live under:

```text
public/images/
```

Expected image formats:

- `.png`
- `.jpg`
- `.jpeg`
- `.svg`
- `.webp`

Use this inventory command:

```bash
find public -type f 2>/dev/null | grep -Ei '\.(png|jpg|jpeg|svg|webp)$' | sort
```

## Coding Guidelines

- Prefer small, focused changes.
- Keep public-facing navigation customer-safe.
- Do not expose internal pages such as driver, ops, or reports in public navigation unless explicitly requested.
- Use semantic HTML where practical.
- Keep CTAs clear and conversion-focused.
- Make mobile behavior a first-class requirement.
- Avoid placeholder content on customer-facing pages unless clearly marked.

## SEO Guidelines

For new public pages, add or preserve useful metadata around:

- Premium meat delivery
- Freezer boxes
- Wholesale meat supplier
- Ranch-direct proteins
- Local delivery area
- Beef, pork, poultry, seafood delivery

Keep copy natural and customer-focused rather than keyword-stuffed.

## Pull Request Expectations

Every PR should include:

- Summary of changes
- Tests run
- Screenshots if visual UI changed
- Notes about risk or follow-up work

Before opening a PR, run:

```bash
npm run typecheck
npm run build
```

## Security and Privacy

- Do not commit secrets, API keys, tokens, customer data, or private credentials.
- Do not add packages that appear unofficial, abandoned, or suspicious.
- Be especially cautious with packages using names that imitate Codex, OpenAI, GitHub, Vercel, or Next.js.
- Prefer official package sources and minimal dependencies.

## Agent Behavior

When given an implementation task:

1. Inspect relevant files first.
2. Make the smallest safe change.
3. Validate with typecheck and build.
4. Explain exactly what changed.
5. Call out anything not completed.

When unsure, stop and ask rather than making risky infrastructure changes.
