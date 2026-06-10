#!/usr/bin/env bash
set -Eeuo pipefail

REPO="AIFreedomTrustFederation/capital-city-provisions"
DEFAULT_FLAGS="--no-install --no-build"
SYNC_FLAGS=()

usage() {
  cat <<'EOF'
Usage: bash sync-all-codespaces.sh [options]

Safely run the official Codespace sync process across every Codespace for:
  AIFreedomTrustFederation/capital-city-provisions

Options:
  --full         Run install, typecheck, and build inside each Codespace.
  --no-install  Skip npm install / npm ci.
  --no-build    Skip npm run typecheck and npm run build.
  --help        Show this help.

Default behavior:
  bash sync-current-codespace.sh --no-install --no-build

Official rule:
  origin/main is the source of truth.

What this does:
  1. Lists Codespaces through GitHub CLI.
  2. Filters to this repository only.
  3. SSHs into each Codespace.
  4. Fetches origin/main.
  5. Loads the latest sync-current-codespace.sh directly from origin/main.
  6. Runs that official sync script.
  7. Prints a safe/not-safe summary.

It does not delete Codespaces, force-push, or run git clean.
EOF
}

if [ $# -eq 0 ]; then
  # shellcheck disable=SC2206
  SYNC_FLAGS=($DEFAULT_FLAGS)
else
  while [ $# -gt 0 ]; do
    case "$1" in
      --full)
        SYNC_FLAGS=()
        shift
        ;;
      --no-install|--no-build)
        SYNC_FLAGS+=("$1")
        shift
        ;;
      --help|-h)
        usage
        exit 0
        ;;
      *)
        echo "Unknown option: $1"
        usage
        exit 2
        ;;
    esac
  done
fi

echo "=========================================="
echo " Capital City Provisions Sync All Codespaces"
echo "=========================================="
echo ""
echo "Repository: $REPO"
echo "Official source: origin/main"
echo "Sync flags: ${SYNC_FLAGS[*]:-(full validation)}"
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

CODESPACES=$(gh codespace list --json name,repository -q ".[] | select(.repository == \"$REPO\") | .name")

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

  if gh codespace ssh -c "$CS" -- bash -lc "
    set -Eeuo pipefail

    if [ -d /workspaces/capital-city-provisions ]; then
      cd /workspaces/capital-city-provisions
    else
      cd /workspaces/*
    fi

    if ! git rev-parse --git-dir >/dev/null 2>&1; then
      echo 'ERROR: Not inside a git repository.'
      exit 10
    fi

    echo 'Fetching official origin/main...'
    git fetch --tags origin main

    echo 'Loading latest official sync script from origin/main...'
    git show origin/main:sync-current-codespace.sh > /tmp/ccp-sync-current-codespace.sh
    chmod +x /tmp/ccp-sync-current-codespace.sh

    echo 'Running official sync script...'
    bash /tmp/ccp-sync-current-codespace.sh ${SYNC_FLAGS[*]}
  "; then
    echo "SAFE: $CS synced against origin/main."
  else
    echo "NOT SAFE: $CS needs manual review."
    ALL_SAFE="no"
  fi
done

echo ""
echo "=========================================="
if [ "$ALL_SAFE" = "yes" ]; then
  echo "All repository Codespaces were synced successfully."
  echo "Run this to verify clean state:"
  echo "  bash check-all-codespaces-sync.sh"
else
  echo "One or more Codespaces failed to sync."
  echo "Run this for details:"
  echo "  bash check-all-codespaces-sync.sh"
  exit 1
fi
