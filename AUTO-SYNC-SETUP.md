# Auto-Sync Setup Guide

## Overview

The `auto-sync-safe.sh` script keeps local work backed up while protecting `main` from broken pushes.

It now follows a fail-closed rule:

- backs up local changes to a timestamped branch
- fetches latest `origin/main`
- fast-forwards only when safe
- runs install, typecheck, and build
- pushes only when validation passes
- stops instead of auto-resolving conflicts

## Quick Start

```bash
bash auto-sync-safe.sh
```

## Important Safety Rules

Do not schedule this blindly until the local workflow is stable.

The script does not use `git merge -X ours` anymore. If fast-forward is not possible, it stops and asks for manual resolution. This prevents accidental overwrites of remote work.

The script also refuses to push when `npm ci`, `npm run typecheck`, or `npm run build` fails.

## Logs

Local logs are written to `.auto-sync.log`, which is ignored by git.

```bash
tail -f .auto-sync.log
```

## Recommended Manual Flow

```bash
git checkout main
git pull --ff-only origin main
npm ci
npm run typecheck
npm run build
git add -A
git commit -m "Describe the change"
git push origin main
```

## When Auto-Sync Stops

If the script stops because fast-forward is impossible:

```bash
git status
git log --oneline --decorate -5
git pull --ff-only origin main
```

If manual merge is needed, review the conflict by hand. Do not force-push and do not blindly keep local changes over remote changes.

## Disabling Auto-Sync

Remove any cron, timer, or GitHub Actions schedule that calls `auto-sync-safe.sh`.
