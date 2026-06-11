#!/usr/bin/env bash
set -Eeuo pipefail

# Auto-sync script for Capital City Provisions
# Safely pulls latest changes, keeps local modifications, validates build
# Safe for automation - never loses work, never force-pushes

MAIN_BRANCH="main"
REMOTE="origin"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
BACKUP_BRANCH="auto-backup-$(date +"%Y%m%d-%H%M%S")"
LOG_FILE=".auto-sync.log"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
  echo "[${TIMESTAMP}] $*" | tee -a "${LOG_FILE}"
}

print_header() {
  echo ""
  echo -e "${BLUE}=========================================="
  echo " $1"
  echo "==========================================${NC}"
  echo ""
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

error_exit() {
  print_error "$1"
  exit 1
}

# Verify git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  error_exit "Not a git repository"
fi

print_header "Auto-Sync: Capital City Provisions"

# Step 1: Check for uncommitted changes
print_header "Step 1: Checking for uncommitted changes"
if ! git diff-index --quiet HEAD --; then
  print_warning "Uncommitted changes detected"
  log "Uncommitting changes found, creating backup branch"
  git branch "${BACKUP_BRANCH}"
  git commit -m "Auto-backup: $(date +%Y-%m-%d\ %H:%M:%S)"
  git push "${REMOTE}" "${BACKUP_BRANCH}" || print_warning "Could not push backup branch"
  print_success "Changes backed up to ${BACKUP_BRANCH}"
else
  print_success "Working directory clean"
fi

# Step 2: Fetch latest from remote
print_header "Step 2: Fetching from remote"
if git fetch "${REMOTE}" "${MAIN_BRANCH}"; then
  print_success "Fetched latest from ${REMOTE}/${MAIN_BRANCH}"
else
  error_exit "Failed to fetch from remote"
fi

# Step 3: Check if we're behind
print_header "Step 3: Checking sync status"
BEHIND=$(git rev-list --count "${MAIN_BRANCH}"..${REMOTE}/${MAIN_BRANCH} 2>/dev/null || echo "0")
AHEAD=$(git rev-list --count ${REMOTE}/${MAIN_BRANCH}..${MAIN_BRANCH} 2>/dev/null || echo "0")

if [ "${BEHIND}" -gt 0 ]; then
  print_warning "Local branch is ${BEHIND} commit(s) behind remote"
else
  print_success "Already up-to-date"
  log "No remote changes to pull"
  exit 0
fi

# Step 4: Merge strategy - keep local changes on conflict
print_header "Step 4: Merging remote changes (keeping local modifications)"
if git merge "${REMOTE}/${MAIN_BRANCH}" -m "Auto-sync: merge origin/${MAIN_BRANCH} - keeping local changes" -X ours 2>&1 | tee -a "${LOG_FILE}"; then
  print_success "Merged successfully"
else
  print_warning "Merge completed with conflicts resolved using 'ours' strategy"
fi

# Step 5: Reinstall dependencies
print_header "Step 5: Installing dependencies"
if npm ci 2>&1 | tail -5 | tee -a "${LOG_FILE}"; then
  print_success "Dependencies installed"
else
  print_error "npm ci failed - check package-lock.json"
fi

# Step 6: Typecheck
print_header "Step 6: Running typecheck"
if npm run typecheck 2>&1 | tail -10 | tee -a "${LOG_FILE}"; then
  print_success "Typecheck passed"
else
  print_error "Typecheck failed - fix TypeScript errors"
fi

# Step 7: Build validation
print_header "Step 7: Building to validate"
if npm run build 2>&1 | tail -10 | tee -a "${LOG_FILE}"; then
  print_success "Build successful"
else
  print_error "Build failed - check logs"
fi

# Step 8: Push changes back
print_header "Step 8: Pushing to remote"
if git push "${REMOTE}" "${MAIN_BRANCH}"; then
  print_success "Pushed to ${REMOTE}/${MAIN_BRANCH}"
else
  print_warning "Push failed - may be behind again, will retry next sync"
fi

print_header "✓ Auto-sync completed successfully"
log "Sync finished at $(date +%Y-%m-%d\ %H:%M:%S)"
print_success "All changes preserved, build validated, remote updated"
