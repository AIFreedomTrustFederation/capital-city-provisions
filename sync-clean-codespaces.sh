#!/usr/bin/env bash
set -euo pipefail

REPO="AIFreedomTrustFederation/capital-city-provisions"
BRANCH="main"
BACKUP_BRANCH="backup-before-cleanup-$(date +%Y%m%d-%H%M%S)"
COMMIT_MSG="Sync Codespace work before cleanup"

echo "1) Checking repo..."
git status
git branch --show-current

echo "2) Creating backup branch..."
git checkout -b "$BACKUP_BRANCH"

echo "3) Adding all files, including public images..."
git add .

if git diff --cached --quiet; then
  echo "No local changes to commit."
else
  git commit -m "$COMMIT_MSG"
fi

echo "4) Pushing backup branch..."
git push origin "$BACKUP_BRANCH"

echo "5) Updating main..."
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "6) Merging backup into main..."
git merge "$BACKUP_BRANCH" || {
  echo ""
  echo "MERGE CONFLICTS FOUND."
  echo "Resolve conflicts manually, then run:"
  echo "git add ."
  echo "git commit -m 'Resolve merge conflicts from Codespace sync'"
  echo "git push origin main"
  exit 1
}

echo "7) Testing build..."
npm install
npm run typecheck || true
npm run build

echo "8) Pushing main..."
git push origin "$BRANCH"

echo "9) Image count in public folder:"
find public -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" -o -iname "*.svg" \) | sort
echo "Total images:"
find public -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" -o -iname "*.svg" \) | wc -l

echo ""
echo "Main is synced."
echo ""
echo "To delete OTHER Codespaces, run this manually after confirming:"
echo "gh codespace list"
echo "gh codespace delete --all"
