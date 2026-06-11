# Preflight Verification Workflow

Do not use Vercel as the first build test. Vercel builds are limited, so code should be checked before production deployment.

## Operating Rule

```txt
preflight branch -> GitHub Actions verifies -> main branch -> Vercel deploys
```

## Sync Rule

`preflight` is allowed to fail. `main` is not.

After errors are fixed on `preflight` and GitHub Actions passes, `main` should sync forward to the exact verified `preflight` commit.

This repo now includes an automation for that:

```txt
.github/workflows/sync-preflight-to-main.yml
```

The sync workflow listens for the CI workflow on `preflight`. If the CI result is successful, it updates `main` to the verified preflight commit without force pushing. If the update is not a fast-forward, it will fail instead of overwriting history.

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
2. Let GitHub Actions run `npm run verify`.
3. Fix failures on `preflight`.
4. When verification passes, the sync workflow advances `main`.
5. Vercel deploys from verified `main`.

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

## Why This Exists

GitHub Actions should catch code problems. Vercel should deploy already-verified production work. The `preflight` branch protects the Vercel build limit and keeps production cleaner.

## Operating Law

```txt
Fix errors on preflight.
Never repair production directly when preflight is broken.
When preflight passes, sync main forward.
Vercel only sees verified main.
```
