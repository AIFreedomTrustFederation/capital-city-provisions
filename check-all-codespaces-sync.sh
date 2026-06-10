#!/usr/bin/env bash
set -euo pipefail

REPO="AIFreedomTrustFederation/capital-city-provisions"

echo "=========================================="
echo " Check Capital City Provisions Codespaces"
echo "=========================================="
echo ""
echo "Repository: $REPO"
echo "Official source: origin/main"
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

CODESPACES=$(gh codespace list --json name,repository,branch,gitStatus -q ".[] | select(.repository == \"$REPO\") | .name")

if [ -z "$CODESPACES" ]; then
  echo "No Codespaces found for $REPO."
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

    if [ -d /workspaces/capital-city-provisions ]; then
      cd /workspaces/capital-city-provisions
    else
      cd /workspaces/* 2>/dev/null || {
        echo "Could not enter /workspaces repo."
        exit 10
      }
    fi

    if ! git rev-parse --git-dir >/dev/null 2>&1; then
      echo "Not a git repository."
      exit 11
    fi

    git fetch origin main >/dev/null 2>&1 || {
      echo "Could not fetch origin/main."
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
      echo "NOT SYNCED: not on main branch."
      exit 13
    fi

    if [ "$LOCAL" != "$REMOTE" ]; then
      echo "NOT SYNCED: local HEAD does not match origin/main."
      git log --oneline --decorate -5
      exit 14
    fi

    if [ -n "$STATUS" ]; then
      echo "NOT CLEAN: uncommitted or untracked files exist:"
      git status --short
      exit 15
    fi

    echo "SYNCED: clean and matches origin/main."
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
  echo "All Capital City Provisions Codespaces are synced and clean."
else
  echo "One or more Capital City Provisions Codespaces are NOT synced."
  echo "Run: bash sync-all-codespaces.sh --no-install --no-build"
  exit 1
fi
