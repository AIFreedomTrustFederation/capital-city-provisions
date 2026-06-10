#!/usr/bin/env bash
set -Eeuo pipefail

MAIN_BRANCH="main"
REMOTE="origin"
STAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_BRANCH="codespace-backup-${STAMP}"
MAIN_BACKUP_BRANCH="main-diverged-backup-${STAMP}"
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

Official rule:
  origin/main is the source of truth.

What it does:
  1. Verifies this is a Git repository.
  2. Fetches origin/main and tags.
  3. Saves any local branch, local commits, or uncommitted work to a timestamped backup branch.
  4. Pushes the backup branch so no work is lost.
  5. Repoints local main to origin/main so every Codespace matches the official main branch.
  6. Installs dependencies.
  7. Runs typecheck and build.

It does not force-push, delete branches, delete Codespaces, or run git clean.
Local work is preserved on pushed backup branches before local main is aligned.
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

echo "Official source of truth: $REMOTE/$MAIN_BRANCH"
echo "Local Codespaces will be aligned to the official main branch after backups."

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "ERROR: Run this from inside the repository."
  exit 1
fi

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "ERROR: Remote '$REMOTE' is not configured."
  exit 1
fi

CURRENT_BRANCH=$(git branch --show-current || true)
CURRENT_STATUS=$(git status --short)

printf "Current branch: %s\n" "${CURRENT_BRANCH:-detached}"

print_header "Fetching official main"
git fetch --tags "$REMOTE" "$MAIN_BRANCH"

OFFICIAL_REF="$REMOTE/$MAIN_BRANCH"
OFFICIAL_SHA=$(git rev-parse "$OFFICIAL_REF")
CURRENT_HEAD=$(git rev-parse HEAD)

NEEDS_BACKUP="no"

if [ -n "$CURRENT_STATUS" ]; then
  NEEDS_BACKUP="yes"
fi

if [ "${CURRENT_BRANCH:-}" != "$MAIN_BRANCH" ]; then
  NEEDS_BACKUP="yes"
fi

if [ "$CURRENT_HEAD" != "$OFFICIAL_SHA" ]; then
  NEEDS_BACKUP="yes"
fi

if [ "$NEEDS_BACKUP" = "yes" ]; then
  print_header "Saving local work before sync"
  echo "Backup branch: $BACKUP_BRANCH"

  git checkout -B "$BACKUP_BRANCH"
  git add -A

  if git diff --cached --quiet; then
    echo "No uncommitted file changes to commit on backup branch."
  else
    git commit -m "Backup Codespace work before official main sync $STAMP"
  fi

  echo "Pushing backup branch to $REMOTE..."
  git push -u "$REMOTE" "$BACKUP_BRANCH"
else
  echo "Local checkout already matches $OFFICIAL_REF and has no file changes."
fi

print_header "Making local main match official origin/main"

git fetch --tags "$REMOTE" "$MAIN_BRANCH"
OFFICIAL_SHA=$(git rev-parse "$OFFICIAL_REF")

if git show-ref --verify --quiet "refs/heads/$MAIN_BRANCH"; then
  LOCAL_MAIN_SHA=$(git rev-parse "$MAIN_BRANCH")
  if [ "$LOCAL_MAIN_SHA" != "$OFFICIAL_SHA" ]; then
    echo "Local main differs from $OFFICIAL_REF."
    echo "Preserving old local main as: $MAIN_BACKUP_BRANCH"
    git branch "$MAIN_BACKUP_BRANCH" "$MAIN_BRANCH"
    git push -u "$REMOTE" "$MAIN_BACKUP_BRANCH"
  fi
fi

# origin/main is official. This local branch update happens only after backups are pushed.
git checkout -B "$MAIN_BRANCH" "$OFFICIAL_REF"
git branch --set-upstream-to="$REMOTE/$MAIN_BRANCH" "$MAIN_BRANCH" >/dev/null 2>&1 || true
git config pull.rebase true

echo "Local $MAIN_BRANCH is now aligned to $OFFICIAL_REF at $(git rev-parse --short HEAD)."

print_header "Dependency install"

if [ "$RUN_INSTALL" = "yes" ] && [ -f package.json ]; then
  npm install
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
echo "Synced this Codespace with official $REMOTE/$MAIN_BRANCH."

if [ "$NEEDS_BACKUP" = "yes" ]; then
  echo "Backup branch preserved: $BACKUP_BRANCH"
  echo "Compare backup with main: git diff main..$BACKUP_BRANCH --stat"
fi

echo ""
echo "To sync every device/Codespace: run this same command in each Codespace:"
echo "  bash sync-current-codespace.sh"
echo ""
echo "To check all Codespaces after running this in each one:"
echo "  bash check-all-codespaces-sync.sh"
