#!/usr/bin/env bash

set -Eeuo pipefail

MAIN_BRANCH="main"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_BRANCH="codespace-backup-${TIMESTAMP}"

echo ""
echo "=========================================="
echo " Capital City Provisions Sync Utility"
echo "=========================================="
echo ""

# Verify repository

if ! git rev-parse --git-dir >/dev/null 2>&1; then
echo "ERROR: Not inside a git repository."
exit 1
fi

# Save current branch

CURRENT_BRANCH=$(git branch --show-current)

echo "Current branch: $CURRENT_BRANCH"
echo ""

# Fetch latest remote data

git fetch --all --prune

# Create backup branch

echo "Creating backup branch..."
git checkout -b "$BACKUP_BRANCH"

# Stage everything

git add -A

# Commit if needed

if git diff --cached --quiet; then
echo "No uncommitted changes found."
else
git commit -m "Automated backup before cleanup $TIMESTAMP"
fi

# Push backup

echo ""
echo "Pushing backup branch..."
git push -u origin "$BACKUP_BRANCH"

# Return to main

echo ""
echo "Switching to main..."
git checkout "$MAIN_BRANCH"

echo ""
echo "Updating main..."
git pull origin "$MAIN_BRANCH"

# Merge

echo ""
echo "Merging backup branch..."

if ! git merge "$BACKUP_BRANCH" --no-edit; then
echo ""
echo "=========================================="
echo " MERGE CONFLICT DETECTED"
echo "=========================================="
echo ""
echo "Run:"
echo "git status"
echo ""
echo "Resolve conflicts manually."
echo ""
echo "No Codespaces were deleted."
exit 1
fi

# Install dependencies

echo ""
echo "Installing dependencies..."

if [ -f package.json ]; then
npm install
fi

# Typecheck

echo ""
echo "Running typecheck..."

if npm run typecheck >/dev/null 2>&1; then
echo "Typecheck passed."
else
echo "Typecheck unavailable or failed."
fi

# Build

echo ""
echo "Running build..."

if ! npm run build; then
echo ""
echo "BUILD FAILED"
echo "No Codespaces will be deleted."
exit 1
fi

# Push main

echo ""
echo "Pushing main..."
git push origin "$MAIN_BRANCH"

# Image inventory

echo ""
echo "=========================================="
echo " PUBLIC IMAGE INVENTORY"
echo "=========================================="

find public -type f 
( -iname "*.png" 
-o -iname "*.jpg" 
-o -iname "*.jpeg" 
-o -iname "*.svg" 
-o -iname "*.webp" ) 
| sort || true

echo ""
echo "Image Count:"

find public -type f 
( -iname "*.png" 
-o -iname "*.jpg" 
-o -iname "*.jpeg" 
-o -iname "*.svg" 
-o -iname "*.webp" ) 
| wc -l || true

echo ""
echo "=========================================="
echo " SUCCESS"
echo "=========================================="
echo ""
echo "Backup Branch:"
echo "$BACKUP_BRANCH"
echo ""

git status

echo ""
echo "Codespaces:"
gh codespace list || true

echo ""
read -p "Delete ALL Codespaces? Type DELETE: " CONFIRM

if [ "$CONFIRM" = "DELETE" ]; then
gh codespace delete --all --force
echo ""
echo "All Codespaces deleted."
else
echo ""
echo "Deletion cancelled."
fi
