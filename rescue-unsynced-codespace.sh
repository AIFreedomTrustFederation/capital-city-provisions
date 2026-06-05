#!/usr/bin/env bash
set -euo pipefail

STAMP=$(date +"%Y%m%d-%H%M%S")
BRANCH="rescue-unsynced-$STAMP"

echo "Creating rescue branch: $BRANCH"

git checkout -b "$BRANCH"

echo "Adding all local files..."
git add -A

if git diff --cached --quiet; then
  echo "No files to commit."
else
  git commit -m "Rescue untracked Codespace files $STAMP"
fi

echo "Pushing rescue branch..."
git push -u origin "$BRANCH"

echo ""
echo "Now returning to main and updating..."
git checkout main
git fetch origin

echo ""
echo "Resetting main to origin/main safely..."
git reset --hard origin/main

echo ""
echo "Clean status:"
git status

echo ""
echo "Rescue branch preserved:"
echo "$BRANCH"
echo ""
echo "If needed, compare it with:"
echo "git diff main..$BRANCH --stat"
