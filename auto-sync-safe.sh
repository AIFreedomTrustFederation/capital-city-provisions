#!/usr/bin/env bash
set -Eeuo pipefail

# Auto-sync script for Capital City Provisions
# Pulls latest changes, preserves local work, validates, then pushes only if validation passes.

MAIN_BRANCH="main"
REMOTE="origin"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
BACKUP_BRANCH="auto-backup-$(date +"%Y%m%d-%H%M%S")"
LOG_FILE=".auto-sync.log"
VALIDATION_FAILED=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo "[${TIMESTAMP}] $*" | tee -a "${LOG_FILE}"; }
print_header() { echo ""; echo -e "${BLUE}=========================================="; echo " $1"; echo "==========================================${NC}"; echo ""; }
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
error_exit() { print_error "$1"; exit 1; }

if ! git rev-parse --git-dir > /dev/null 2>&1; then error_exit "Not a git repository"; fi

print_header "Auto-Sync: Capital City Provisions"

print_header "Step 1: Checking for uncommitted changes"
if ! git diff-index --quiet HEAD -- || [ -n "$(git status --porcelain)" ]; then
  print_warning "Uncommitted changes detected"
  log "Uncommitted changes found; creating backup branch"
  git add -A
  git branch "${BACKUP_BRANCH}"
  git commit -m "Auto-backup: $(date +%Y-%m-%d\ %H:%M:%S)"
  git push "${REMOTE}" "${BACKUP_BRANCH}" || print_warning "Could not push backup branch"
  print_success "Changes backed up to ${BACKUP_BRANCH}"
else
  print_success "Working directory clean"
fi

print_header "Step 2: Fetching from remote"
git fetch "${REMOTE}" "${MAIN_BRANCH}" || error_exit "Failed to fetch from remote"
print_success "Fetched latest from ${REMOTE}/${MAIN_BRANCH}"

print_header "Step 3: Checking sync status"
BEHIND=$(git rev-list --count "${MAIN_BRANCH}"..${REMOTE}/${MAIN_BRANCH} 2>/dev/null || echo "0")
if [ "${BEHIND}" -gt 0 ]; then
  print_warning "Local branch is ${BEHIND} commit(s) behind remote"
  print_header "Step 4: Fast-forwarding remote changes"
  git merge --ff-only "${REMOTE}/${MAIN_BRANCH}" || error_exit "Fast-forward failed; resolve manually instead of auto-merging with ours"
  print_success "Fast-forwarded successfully"
else
  print_success "Already up-to-date"
fi

print_header "Step 5: Installing dependencies"
if npm ci 2>&1 | tee -a "${LOG_FILE}"; then print_success "Dependencies installed"; else print_error "npm ci failed"; VALIDATION_FAILED=1; fi

print_header "Step 6: Running typecheck"
if npm run typecheck 2>&1 | tee -a "${LOG_FILE}"; then print_success "Typecheck passed"; else print_error "Typecheck failed"; VALIDATION_FAILED=1; fi

print_header "Step 7: Building to validate"
if npm run build 2>&1 | tee -a "${LOG_FILE}"; then print_success "Build successful"; else print_error "Build failed"; VALIDATION_FAILED=1; fi

if [ "${VALIDATION_FAILED}" -ne 0 ]; then
  print_error "Validation failed; not pushing to remote. Fix errors, then rerun."
  log "Sync stopped because validation failed"
  exit 1
fi

print_header "Step 8: Pushing to remote"
git push "${REMOTE}" "${MAIN_BRANCH}" || error_exit "Push failed"
print_success "Pushed to ${REMOTE}/${MAIN_BRANCH}"

print_header "✓ Auto-sync completed successfully"
log "Sync finished at $(date +%Y-%m-%d\ %H:%M:%S)"
print_success "All changes preserved, validated, and remote updated"
