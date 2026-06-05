#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo " Check All Codespaces Sync Status"
echo "=========================================="
echo ""

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: GitHub CLI not found."
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: GitHub CLI is not authenticated."
  echo "Run: gh auth login"
  exit 1
fi

CODESPACES=$(gh codespace list --json name,repository,branch,gitStatus -q '.[].name')

if [ -z "$CODESPACES" ]; then
  echo "No Codespaces found."
  exit 0
fi

ALL_SAFE="yes"

for CS in $CODESPACES; do
  echo ""
  echo "------------------------------------------"
  echo "Codespace: $CS"
  echo "------------------------------------------"

  if gh codespace ssh -c "$CS" -- bash -lc '
    set -e

    cd /workspaces/* 2>/dev/null || {
      echo "❌ Could not enter /workspaces repo."
      exit 10
    }

    if ! git rev-parse --git-dir >/dev/null 2>&1; then
      echo "❌ Not a git repository."
      exit 11
    fi

    git fetch origin >/dev/null 2>&1 || {
      echo "❌ Could not fetch origin."
      exit 12
    }

    BRANCH=$(git branch --show-current)
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    STATUS=$(git status --short)

    echo "Branch: $BRANCH"
    echo "Local:  $LOCAL"
    echo "Remote: $REMOTE"

    if [ "$BRANCH" != "main" ]; then
      echo "❌ Not on main branch."
      exit 13
    fi

    if [ "$LOCAL" != "$REMOTE" ]; then
      echo "❌ Local HEAD does not match origin/main."
      git log --oneline --decorate -5
      exit 14
    fi

    if [ -n "$STATUS" ]; then
      echo "❌ Uncommitted or untracked files exist:"
      git status --short
      exit 15
    fi

    echo "✅ Fully synced with origin/main and clean."
  '; then
    echo "SAFE: $CS"
  else
    echo "NOT SAFE: $CS"
    ALL_SAFE="no"
  fi
done

echo ""
echo "=========================================="

if [ "$ALL_SAFE" = "yes" ]; then
  echo "✅ All Codespaces are synced and clean."
  echo ""
  read -r -p "Delete ALL Codespaces now? Type DELETE: " CONFIRM

  if [ "$CONFIRM" = "DELETE" ]; then
    gh codespace delete --all --force
    echo "All Codespaces deleted."
  else
    echo "Deletion cancelled."
  fi
else
  echo "❌ One or more Codespaces are NOT synced."
  echo "Do not delete yet."
fi
