#!/usr/bin/env bash
set -euo pipefail

echo "========================================"
echo "Capital City Provisions Git Fix + Push"
echo "========================================"

if [ ! -d .git ]; then
  echo "❌ This is not a Git repo. Go to the real repo folder first."
  exit 1
fi

if [ ! -f package.json ]; then
  echo "❌ package.json not found. Run this from the CCP project root."
  exit 1
fi

echo ""
echo "1) Current branch:"
git branch --show-current

BRANCH="$(git branch --show-current)"
if [ "$BRANCH" != "main" ]; then
  echo "⚠️ You are on $BRANCH, not main."
  echo "Switching to main..."
  git checkout main
fi

echo ""
echo "2) Saving current work before pulling..."
git add .

if git diff --cached --quiet; then
  echo "✅ No local changes to commit."
else
  git commit -m "Save local CCP updates before sync"
fi

echo ""
echo "3) Fetching latest GitHub main..."
git fetch origin main

echo ""
echo "4) Checking ahead/behind status..."
LOCAL="$(git rev-parse @)"
REMOTE="$(git rev-parse origin/main)"
BASE="$(git merge-base @ origin/main)"

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "✅ Local and remote are already synced."
elif [ "$LOCAL" = "$BASE" ]; then
  echo "⬇️ Local is behind remote. Pulling..."
  git pull --no-rebase origin main
elif [ "$REMOTE" = "$BASE" ]; then
  echo "⬆️ Local is ahead of remote. Ready to push."
else
  echo "🔀 Branches diverged. Merging remote main into local main..."
  git pull --no-rebase origin main || {
    echo ""
    echo "❌ Merge conflict detected."
    echo "Run:"
    echo "git status"
    echo ""
    echo "Fix conflicted files, then:"
    echo "git add ."
    echo "git commit -m \"Resolve merge conflicts\""
    echo "git push origin main"
    exit 1
  }
fi

echo ""
echo "5) Installing dependencies and updating lockfile..."
npm install

echo ""
echo "6) Checking TypeScript/build..."
npm run typecheck || echo "⚠️ Typecheck failed. Continuing so you can still push fixes."
npm run build || echo "⚠️ Build failed. Continuing so you can still push fixes."

echo ""
echo "7) Committing dependency/build-related updates..."
git add package.json package-lock.json lib/pg-database.ts app/api/leads/route.ts 2>/dev/null || true

if git diff --cached --quiet; then
  echo "✅ No new dependency/code changes to commit."
else
  git commit -m "Sync PostgreSQL wiring and dependency lockfile"
fi

echo ""
echo "8) Pushing to GitHub..."
git push origin main

echo ""
echo "========================================"
echo "✅ DONE"
echo "========================================"
echo "Repo is synced and pushed to origin/main."
echo ""
echo "Next checks:"
echo "git status"
echo "npm run dev"
