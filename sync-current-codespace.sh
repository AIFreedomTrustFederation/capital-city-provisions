#!/usr/bin/env bash
set -Eeuo pipefail

MAIN_BRANCH="main"
REMOTE="origin"
STAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_BRANCH="codespace-backup-${STAMP}"
RUN_BUILD="yes"
RUN_INSTALL="yes"

print_header() {
  echo ""
  echo "=========================================="
  echo " $1"
  echo "=========================================="
  echo ""
}

usage() {
  cat <<'EOF'
Usage: bash sync-current-codespace.sh [options]

Safely sync the current Codespace with origin/main.

Options:
  --no-install   Skip npm install / npm ci
  --no-build     Skip npm run typecheck and npm run build
  --help         Show this help

What it does:
  1. Verifies this is a Git repository.
  2. Saves local work to a timestamped backup branch when needed.
  3. Pushes the backup branch so no work is lost.
  4. Checks out main and fast-forwards from origin/main only.
  5. Installs dependencies.
  6. Runs typecheck and build.

It does not run git reset --hard, git clean, force push, or delete Codespaces.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --no-install)
      RUN_INSTALL="no"
      shift
      ;;
    --no-build)
      RUN_BUILD="no"
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

print_header "Capital City Provisions Codespace Sync"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "ERROR: Run this from inside the repository."
  exit 1
fi

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "ERROR: Remote '$REMOTE' is not configured."
  exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
CURRENT_STATUS=$(git status --short)

printf "Current branch: %s\n" "${CURRENT_BRANCH:-detached}"

print_header "Fetching remote"
git fetch "$REMOTE" "$MAIN_BRANCH"

NEEDS_BACKUP="no"

if [ -n "$CURRENT_STATUS" ]; then
  NEEDS_BACKUP="yes"
fi

if [ "${CURRENT_BRANCH:-}" != "$MAIN_BRANCH" ]; then
  NEEDS_BACKUP="yes"
fi

if [ "$NEEDS_BACKUP" = "yes" ]; then
  print_header "Saving local work to backup branch"
  echo "Backup branch: $BACKUP_BRANCH"

  git checkout -b "$BACKUP_BRANCH"
  git add -A

  if git diff --cached --quiet; then
    echo "No file changes to commit on backup branch."
  else
    git commit -m "Backup Codespace work before sync $STAMP"
  fi

  echo "Pushing backup branch to $REMOTE..."
  git push -u "$REMOTE" "$BACKUP_BRANCH"
else
  echo "No local changes found on main. Backup branch not needed."
fi

print_header "Syncing main with origin/main"

git checkout "$MAIN_BRANCH"
git fetch "$REMOTE" "$MAIN_BRANCH"

if git merge --ff-only "$REMOTE/$MAIN_BRANCH"; then
  echo "main is now fast-forwarded to $REMOTE/$MAIN_BRANCH."
else
  echo "ERROR: main cannot be fast-forwarded cleanly."
  echo "No destructive reset was performed."
  if [ "$NEEDS_BACKUP" = "yes" ]; then
    echo "Your local work is preserved on: $BACKUP_BRANCH"
  fi
  echo "Inspect with: git log --oneline --decorate --graph --all -20"
  exit 1
fi

print_header "Dependency install"

if [ "$RUN_INSTALL" = "yes" ] && [ -f package.json ]; then
  if [ -f package-lock.json ]; then
    npm install
  else
    npm install
  fi
else
  echo "Skipping dependency install."
fi

print_header "Validation"

if [ "$RUN_BUILD" = "yes" ] && [ -f package.json ]; then
  if npm run | grep -q "typecheck"; then
    npm run typecheck
  else
    echo "No typecheck script found."
  fi

  if npm run | grep -q "build"; then
    npm run build
  else
    echo "No build script found."
  fi
else
  echo "Skipping typecheck and build."
fi

print_header "Final status"
git status

echo ""
echo "Synced current Codespace with $REMOTE/$MAIN_BRANCH."

if [ "$NEEDS_BACKUP" = "yes" ]; then
  echo "Backup branch preserved: $BACKUP_BRANCH"
  echo "Compare backup with main: git diff main..$BACKUP_BRANCH --stat"
fi

echo ""
echo "To check all Codespaces after running this in each one:"
echo "  bash check-all-codespaces-sync.sh"
