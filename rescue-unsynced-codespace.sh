#!/usr/bin/env bash
set -euo pipefail

STAMP=$(date +"%Y%m%d-%H%M%S")
RESCUE_BRANCH="rescue-unsynced-$STAMP"
MAIN_BRANCH="main"

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

START_BRANCH=$(git branch --show-current)
echo "Starting branch: $START_BRANCH"
echo "Rescue branch:   $RESCUE_BRANCH"

git fetch origin

print_header "Saving everything to rescue branch"

git checkout -b "$RESCUE_BRANCH"
git add -A

if git diff --cached --quiet; then
  echo "No staged changes to commit."
else
  git commit -m "Rescue unsynced Codespace work $STAMP"
fi

git push -u origin "$RESCUE_BRANCH"

print_header "Checking main without destructive reset"

git checkout "$MAIN_BRANCH"
git fetch origin "$MAIN_BRANCH"

LOCAL_MAIN=$(git rev-parse "$MAIN_BRANCH")
REMOTE_MAIN=$(git rev-parse "origin/$MAIN_BRANCH")

if [ "$LOCAL_MAIN" = "$REMOTE_MAIN" ]; then
  echo "main already matches origin/main."
else
  echo "main does not match origin/main. Attempting safe fast-forward only."
  if git merge --ff-only "origin/$MAIN_BRANCH"; then
    echo "main fast-forwarded safely."
  else
    echo "ERROR: main cannot be fast-forwarded safely."
    echo "No reset was performed. No local commits were discarded."
    echo "Your work is preserved on rescue branch: $RESCUE_BRANCH"
    echo "Inspect with: git log --oneline --decorate --graph --all -20"
    exit 1
  fi
fi

echo ""
echo "Final status:"
git status

echo ""
echo "Rescue branch preserved: $RESCUE_BRANCH"
echo "Compare rescue branch with main:"
echo "git diff main..$RESCUE_BRANCH --stat"
