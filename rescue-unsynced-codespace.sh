#!/usr/bin/env bash
set -euo pipefail

STAMP=$(date +"%Y%m%d-%H%M%S")
BRANCH="rescue-unsynced-$STAMP"

print_header() {
  echo ""
  echo "=========================================="
  echo " $1"
  echo "=========================================="
  echo ""
}

print_header "Rescue Unsynced Codespace Work"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "ERROR: Not inside a git repository."
  exit 1
fi

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

print_header "Returning to main safely"

git checkout main
git fetch origin main

# Verify main has no unpushed or divergent commits before any destructive reset.
LOCAL=$(git rev-parse main)
REMOTE=$(git rev-parse origin/main)
if [ "$LOCAL" != "$REMOTE" ]; then
  echo "ERROR: local main does not match origin/main. Refusing to reset."
  echo "No local commits were discarded."
  echo "Your rescue branch has already been pushed: $BRANCH"
  echo "Inspect local differences with: git log --oneline --decorate origin/main..main"
  echo "If you truly want to discard local main later, do it manually after review."
  exit 1
fi

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
