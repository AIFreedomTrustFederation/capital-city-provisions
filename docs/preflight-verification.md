# Preflight Verification Workflow

Do not use Vercel as the first build test. Vercel builds are limited, so code should be checked before production deployment.

## Operating Rule

```txt
preflight branch -> GitHub Actions verifies -> main branch -> Vercel deploys
```

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

Recommended workflow:

1. Put new work on `preflight`.
2. Let GitHub Actions run `npm run verify`.
3. Fix failures on `preflight`.
4. Merge or fast-forward verified work into `main`.
5. Let Vercel deploy only after GitHub verification passes.

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
