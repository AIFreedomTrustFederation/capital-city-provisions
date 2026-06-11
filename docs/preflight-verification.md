# Preflight Verification Workflow

Do not use Vercel as the first build test. Vercel builds are limited, so code should be checked before production deployment.

## Operating Rule

```txt
preflight branch -> GitHub Actions verifies -> main branch -> Vercel deploys
```

## Plain-English Rule

- `preflight` is where we break things, test things, and fix things.
- `main` is what Vercel deploys.
- Never push unverified repair work straight to `main`.
- Run Node checks on `preflight` first.
- When `preflight` passes, sync `main` forward.

## Node / Codespaces Workflow

Use this when working inside GitHub Codespaces, VS Code, or any terminal with Node and npm.

### 1. Get on preflight

```bash
git fetch origin
git checkout preflight
git pull --ff-only origin preflight
```

### 2. Install dependencies

Use `npm ci` when you want the clean CI-style install.

```bash
npm ci
```

Use `npm install` only when intentionally changing dependencies.

### 3. Run full verification

```bash
npm run verify
```

This runs:

```bash
npm run typecheck
npm run license:audit
npm run build
```

### 4. If errors appear

Fix only the files named in the error list first.

For TypeScript output like this:

```txt
Found 4 errors in 3 files.
app/api/billing/invoices/route.ts:37
app/api/scheduling/appointments/route.ts:31
components/RoleAIWorkspace.tsx:39
```

Start with those exact files and lines. Do not jump into unrelated redesign work while preflight is red.

### 5. Re-run verification

```bash
npm run verify
```

Repeat until it passes.

### 6. Commit fixes to preflight

```bash
git status
git add app/api/billing/invoices/route.ts app/api/scheduling/appointments/route.ts components/RoleAIWorkspace.tsx
git commit -m "Fix preflight type errors"
git push origin preflight
```

Use the actual files you changed. The paths above are only an example.

### 7. Let GitHub Actions confirm

After pushing `preflight`, GitHub Actions runs the same verification command.

```txt
.github/workflows/ci.yml
```

If GitHub Actions passes, the sync workflow can advance `main`.

## Quick Commands

### Check current branch

```bash
git branch --show-current
```

### Switch to preflight safely

```bash
git fetch origin
git checkout preflight
git pull --ff-only origin preflight
```

### Run the real build gate

```bash
npm run verify
```

### Push preflight fixes

```bash
git add .
git commit -m "Fix preflight verification"
git push origin preflight
```

### Sync local main after preflight passes

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
```

## Sync Rule

`preflight` is allowed to fail. `main` is not.

After errors are fixed on `preflight` and GitHub Actions passes, `main` should sync forward to the exact verified `preflight` commit.

This repo includes an automation for that:

```txt
.github/workflows/sync-preflight-to-main.yml
```

The sync workflow listens for the CI workflow on `preflight`. If the CI result is successful, it updates `main` to the verified preflight commit without force pushing. If the update is not a fast-forward, it fails instead of overwriting history.

## Verification Command

Run all checks with:

```bash
npm run verify
```

That command runs:

```bash
npm run typecheck
npm run license:audit
npm run build
```

## Branch Workflow

- `main` is the production branch.
- `preflight` is the verification branch.
- GitHub Actions runs verification on both branches.
- Passing `preflight` syncs forward to `main`.
- Failing `preflight` never syncs to `main`.

Recommended workflow:

1. Put new work on `preflight`.
2. Run `npm run verify` in Node/Codespaces.
3. Fix failures on `preflight`.
4. Push `preflight`.
5. Let GitHub Actions run `npm run verify`.
6. When verification passes, the sync workflow advances `main`.
7. Vercel deploys from verified `main`.

## Current Preflight Hardening Notes

Before syncing to `preflight`, keep the TypeScript surface simple:

- Shared helpers should accept normal business objects, not only `Record<string, unknown>`.
- UI source types should accept all context sources, including `system`.
- Trust labels should use owner-facing names in the UI.
- Communication, billing, appointment, board, and AI context records should keep their `contextTrust` metadata.

## CI File

```txt
.github/workflows/ci.yml
```

The workflow installs dependencies with:

```bash
npm ci
```

Then runs:

```bash
npm run verify
```

## Troubleshooting

### Vercel still says build-rate-limit

That is a Vercel account/build-limit issue. Check GitHub Actions and `npm run verify` first. If preflight passes, the code is likely clean even if Vercel refuses another build.

### `npm run verify` fails during typecheck

Fix the TypeScript files listed in the summary. Re-run `npm run verify` after each patch.

### `npm run verify` fails during build

Read the first build error above the stack trace. Fix the first root cause before chasing later errors.

### Local Codespaces branch is wrong

Run:

```bash
git branch --show-current
git fetch origin
git checkout preflight
git pull --ff-only origin preflight
```

### Local branch has messy changes

Save anything important first. Then reset to remote preflight:

```bash
git fetch origin
git checkout preflight
git reset --hard origin/preflight
git clean -fd
```

Only use this when you are sure you do not need local uncommitted changes.

## Why This Exists

GitHub Actions should catch code problems. Vercel should deploy already-verified production work. The `preflight` branch protects the Vercel build limit and keeps production cleaner.

## Operating Law

```txt
Fix errors on preflight.
Never repair production directly when preflight is broken.
Run npm run verify before pushing to main.
When preflight passes, sync main forward.
Vercel only sees verified main.
```
