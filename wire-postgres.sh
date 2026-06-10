#!/usr/bin/env bash
set -euo pipefail

# Capital City Provisions development helper
# Purpose:
# - Keep local development synced with origin/main as the source of truth.
# - Verify PostgreSQL wiring without overwriting application source files.
# - Run the same checks expected before pushing production-facing changes.
#
# This script intentionally does NOT rewrite lib/pg-database.ts, commit automatically,
# or force-push main. Main stays the source of truth by fast-forwarding from origin/main
# before validation and pushing only normal commits you intentionally created.

ROOT_MARKER="package.json"
DEFAULT_BRANCH="main"
REMOTE="origin"
APPLY_SCHEMA=false
PUSH=false
NO_INSTALL=false
SKIP_CHECKS=false

usage() {
  cat <<'USAGE'
Usage: ./wire-postgres.sh [options]

Options:
  --apply-schema   Apply database/schema.sql to DATABASE_URL using psql.
  --push           Push current local commits to origin/main after checks pass.
  --no-install     Skip npm install/npm ci step.
  --skip-checks    Skip typecheck, license audit, and build.
  --help           Show this help.

Recommended development flow:
  ./wire-postgres.sh
  ./wire-postgres.sh --apply-schema
  ./wire-postgres.sh --push

Required production env vars:
  DATABASE_URL=postgres-connection-string
  CCP_REQUIRE_POSTGRES=true
  OWNER_ACCESS_CODE=secure-owner-code
  DRIVER_ACCESS_CODE=secure-driver-code
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --apply-schema) APPLY_SCHEMA=true ;;
    --push) PUSH=true ;;
    --no-install) NO_INSTALL=true ;;
    --skip-checks) SKIP_CHECKS=true ;;
    --help|-h) usage; exit 0 ;;
    *) echo "❌ Unknown option: $arg"; usage; exit 1 ;;
  esac
done

echo "🔧 Capital City Provisions Postgres + main sync helper"

if [ ! -f "$ROOT_MARKER" ]; then
  echo "❌ Run this from the project root where package.json exists."
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "❌ git is required."
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$CURRENT_BRANCH" != "$DEFAULT_BRANCH" ]; then
  echo "❌ You are on '$CURRENT_BRANCH'. Switch to '$DEFAULT_BRANCH' before running this helper."
  echo "   This protects origin/main as the single source of truth."
  exit 1
fi

echo "📡 Fetching latest $REMOTE/$DEFAULT_BRANCH..."
git fetch "$REMOTE" "$DEFAULT_BRANCH"

LOCAL_SHA="$(git rev-parse "$DEFAULT_BRANCH")"
REMOTE_SHA="$(git rev-parse "$REMOTE/$DEFAULT_BRANCH")"
BASE_SHA="$(git merge-base "$DEFAULT_BRANCH" "$REMOTE/$DEFAULT_BRANCH")"

if [ "$LOCAL_SHA" = "$REMOTE_SHA" ]; then
  echo "✅ Local $DEFAULT_BRANCH already matches $REMOTE/$DEFAULT_BRANCH."
elif [ "$LOCAL_SHA" = "$BASE_SHA" ]; then
  echo "⬇️ Local $DEFAULT_BRANCH is behind. Fast-forwarding from $REMOTE/$DEFAULT_BRANCH..."
  git pull --ff-only "$REMOTE" "$DEFAULT_BRANCH"
elif [ "$REMOTE_SHA" = "$BASE_SHA" ]; then
  echo "⬆️ Local $DEFAULT_BRANCH has commits not yet pushed. Continuing with validation."
else
  echo "❌ Local $DEFAULT_BRANCH and $REMOTE/$DEFAULT_BRANCH have diverged."
  echo "   Resolve divergence manually. Do not force-push main."
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️ Local working tree has changes. They will be validated but not auto-committed."
  git status --short
else
  echo "✅ Working tree is clean."
fi

if [ "$NO_INSTALL" = false ]; then
  if [ -f package-lock.json ]; then
    echo "📦 Installing exact dependencies with npm ci..."
    npm ci
  else
    echo "📦 Installing dependencies with npm install..."
    npm install
  fi
else
  echo "⏭️ Skipping dependency install."
fi

if ! node -e "require('pg'); console.log('✅ pg package is available')"; then
  echo "❌ pg package is missing. Run npm install pg @types/pg, commit package changes, then rerun."
  exit 1
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "⚠️ DATABASE_URL is not set. Local demo memory may work, but production Postgres validation cannot run."
else
  echo "✅ DATABASE_URL is set."
fi

if [ "${CCP_REQUIRE_POSTGRES:-}" != "true" ]; then
  echo "⚠️ CCP_REQUIRE_POSTGRES is not true in this shell. Set it in production to force fail-closed live ops."
else
  echo "✅ CCP_REQUIRE_POSTGRES=true."
fi

if [ "$APPLY_SCHEMA" = true ]; then
  if [ -z "${DATABASE_URL:-}" ]; then
    echo "❌ Cannot apply schema because DATABASE_URL is not set."
    exit 1
  fi
  if ! command -v psql >/dev/null 2>&1; then
    echo "❌ psql is required for --apply-schema. Install PostgreSQL client tools and rerun."
    exit 1
  fi
  echo "🗄️ Applying database/schema.sql to DATABASE_URL..."
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/schema.sql
  echo "✅ Schema applied."
else
  echo "ℹ️ Schema not applied. Use --apply-schema when DATABASE_URL points to the intended database."
fi

if [ "$SKIP_CHECKS" = false ]; then
  echo "🧪 Running typecheck..."
  npm run typecheck

  echo "📜 Running license audit..."
  npm run license:audit

  echo "🏗️ Running production build..."
  npm run build
else
  echo "⏭️ Skipping checks."
fi

if [ -n "${DATABASE_URL:-}" ]; then
  echo "🔍 Postgres health endpoint reminder: after deployment, verify /api/db/health returns ok=true and storage=postgres."
fi

echo "📌 Final git status:"
git status --short

if [ "$PUSH" = true ]; then
  CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
  if [ "$CURRENT_BRANCH" != "$DEFAULT_BRANCH" ]; then
    echo "❌ Refusing to push because current branch is '$CURRENT_BRANCH', not '$DEFAULT_BRANCH'."
    exit 1
  fi
  echo "🚀 Pushing committed changes to $REMOTE/$DEFAULT_BRANCH..."
  git push "$REMOTE" "$DEFAULT_BRANCH"
  echo "✅ Pushed. origin/main is updated."
else
  echo "✅ Validation complete. No push was performed. Use --push after committing intentional changes."
fi
