#!/usr/bin/env bash
set -Eeuo pipefail

MAIN_BRANCH="main"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_BRANCH="codespace-backup-${TIMESTAMP}"

# Files and folders that should never be restored from a rescue/backup branch.
# These are the usual source of merge conflicts or generated dependency noise.
EXCLUDE_REGEX='(^|/)(package-lock\.json|npm-shrinkwrap\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb)$|(^|/)(node_modules|\.next|dist|build|coverage)/'

print_header() {
  echo ""
  echo "=========================================="
  echo " $1"
  echo "=========================================="
  echo ""
}

run_optional() {
  local label="$1"
  shift

  echo ""
  echo "$label..."

  if "$@"; then
    echo "$label passed."
  else
    echo "$label unavailable or failed. Continuing safely."
  fi
}

print_header "Capital City Provisions Conflict-Safe Sync"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "ERROR: Not inside a git repository."
  exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
echo "Backup branch:  $BACKUP_BRANCH"

echo ""
echo "Fetching latest remote data..."
git fetch --all --prune

print_header "Creating safety backup branch"

# Create a full backup branch first so no local work is lost.
git checkout -b "$BACKUP_BRANCH"
git add -A

if git diff --cached --quiet; then
  echo "No uncommitted changes found. Creating branch without a new commit."
else
  git commit -m "Automated backup before conflict-safe sync $TIMESTAMP"
fi

echo ""
echo "Pushing backup branch..."
git push -u origin "$BACKUP_BRANCH"

print_header "Resetting main to clean remote state"

git checkout "$MAIN_BRANCH"
git fetch origin "$MAIN_BRANCH"
git reset --hard "origin/$MAIN_BRANCH"

print_header "Applying safe files from backup branch"

APPLIED_COUNT=0
SKIPPED_COUNT=0

# Use diff against clean main, but restore file-by-file instead of merging.
# This avoids Git conflict markers entirely.
while IFS= read -r FILE_PATH; do
  [ -n "$FILE_PATH" ] || continue

  if echo "$FILE_PATH" | grep -Eq "$EXCLUDE_REGEX"; then
    echo "SKIP conflict-prone/generated file: $FILE_PATH"
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    continue
  fi

  if git cat-file -e "$BACKUP_BRANCH:$FILE_PATH" 2>/dev/null; then
    echo "APPLY: $FILE_PATH"
    git restore --source "$BACKUP_BRANCH" -- "$FILE_PATH"
  else
    echo "REMOVE: $FILE_PATH"
    git rm -r --ignore-unmatch -- "$FILE_PATH" >/dev/null 2>&1 || true
  fi

  APPLIED_COUNT=$((APPLIED_COUNT + 1))
done < <(git diff --name-only "$MAIN_BRANCH" "$BACKUP_BRANCH")

echo ""
echo "Applied files: $APPLIED_COUNT"
echo "Skipped files: $SKIPPED_COUNT"

if git diff --quiet && git diff --cached --quiet; then
  echo ""
  echo "No safe file changes to commit. Main remains clean."
else
  echo ""
  echo "Staging safe changes..."
  git add -A

  echo ""
  echo "Committing safe changes..."
  git commit -m "Apply conflict-safe Codespace backup $TIMESTAMP"
fi

print_header "Dependency install and validation"

if [ -f package.json ]; then
  if [ -f package-lock.json ]; then
    run_optional "npm ci" npm ci
  else
    run_optional "npm install" npm install
  fi
else
  echo "No package.json found. Skipping npm install."
fi

if [ -f package.json ]; then
  if npm run | grep -q "typecheck"; then
    run_optional "Typecheck" npm run typecheck
  else
    echo "No typecheck script found. Skipping typecheck."
  fi

  if npm run | grep -q "build"; then
    echo ""
    echo "Running build..."
    if ! npm run build; then
      echo ""
      echo "BUILD FAILED. Main was not pushed."
      echo "Your backup branch is preserved here: $BACKUP_BRANCH"
      exit 1
    fi
  else
    echo "No build script found. Skipping build."
  fi
fi

print_header "Pushing main"

git push origin "$MAIN_BRANCH"

print_header "Public image inventory"

IMAGE_LIST=$(find public -type f 2>/dev/null | grep -Ei '\.(png|jpg|jpeg|svg|webp)$' | sort || true)

if [ -n "$IMAGE_LIST" ]; then
  echo "$IMAGE_LIST"
else
  echo "No public image files found."
fi

echo ""
echo "Image Count:"
if [ -n "$IMAGE_LIST" ]; then
  echo "$IMAGE_LIST" | wc -l
else
  echo "0"
fi

print_header "Success"

echo "Backup branch preserved: $BACKUP_BRANCH"
echo "Main branch updated without merge conflicts."
echo "Lockfiles and generated folders were intentionally left under main's control."
echo ""
git status

if command -v gh >/dev/null 2>&1; then
  echo ""
  echo "Codespaces:"
  gh codespace list || true

  echo ""
  read -r -p "Delete ALL Codespaces only if everything above is clean? Type DELETE: " CONFIRM

  if [ "$CONFIRM" = "DELETE" ]; then
    gh codespace delete --all --force
    echo "All Codespaces deleted."
  else
    echo "Deletion cancelled."
  fi
else
  echo "GitHub CLI not found. Skipping Codespace deletion prompt."
fi
