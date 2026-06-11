# Auto-Sync Setup Guide

## Overview

The `auto-sync-safe.sh` script keeps your repository automatically synchronized with remote changes while:
- ✓ Preserving all local code changes
- ✓ Resolving conflicts by keeping your modifications
- ✓ Validating TypeScript and builds
- ✓ Logging all operations
- ✓ Never force-pushing or losing work

## Quick Start

```bash
bash auto-sync-safe.sh
```

## How It Works

1. **Backup**: Creates a timestamped backup branch if uncommitted changes exist
2. **Fetch**: Gets latest from `origin/main`
3. **Merge**: Merges with `-X ours` strategy (your changes win on conflicts)
4. **Validate**: Runs `npm ci`, `typecheck`, and `build`
5. **Push**: Updates remote with the merged result

## Automated Scheduling

### Option A: Crontab (Recommended for Codespaces)

Add to crontab with `crontab -e`:

```bash
# Run auto-sync every 30 minutes
*/30 * * * * cd /workspaces/capital-city-provisions && bash auto-sync-safe.sh >> .auto-sync-cron.log 2>&1

# Run twice daily (6 AM and 6 PM)
0 6,18 * * * cd /workspaces/capital-city-provisions && bash auto-sync-safe.sh >> .auto-sync-cron.log 2>&1
```

### Option B: GitHub Actions (Production)

Create `.github/workflows/auto-sync.yml`:

```yaml
name: Auto-Sync Repo

on:
  schedule:
    # Every 30 minutes
    - cron: '*/30 * * * *'
  workflow_dispatch:  # Allow manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Run auto-sync
        run: bash auto-sync-safe.sh

      - name: Commit and push results
        run: |
          git config user.name "Auto-Sync Bot"
          git config user.email "auto-sync@github.local"
          if git diff --quiet; then
            echo "No changes to commit"
          else
            git add .
            git commit -m "chore: auto-sync $(date +%Y-%m-%d\ %H:%M:%S)"
            git push
          fi
```

### Option C: Systemd Timer (Linux/Codespace)

1. Create `/etc/systemd/user/auto-sync-capital.service`:

```ini
[Unit]
Description=Auto-sync Capital City Provisions
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
WorkingDirectory=/workspaces/capital-city-provisions
ExecStart=/workspaces/capital-city-provisions/auto-sync-safe.sh
StandardOutput=journal
StandardError=journal
```

2. Create `/etc/systemd/user/auto-sync-capital.timer`:

```ini
[Unit]
Description=Run auto-sync every 30 minutes
Requires=auto-sync-capital.service

[Timer]
OnBootSec=5min
OnUnitActiveSec=30min
Persistent=true

[Install]
WantedBy=timers.target
```

3. Enable and start:

```bash
systemctl --user daemon-reload
systemctl --user enable auto-sync-capital.timer
systemctl --user start auto-sync-capital.timer
systemctl --user status auto-sync-capital.timer
```

## Monitoring

Check the log file:

```bash
tail -f .auto-sync.log
```

View sync history:

```bash
# Last 20 sync operations
tail -20 .auto-sync.log

# Check for failures
grep "✗\|Error\|failed" .auto-sync.log
```

## Conflict Resolution Strategy

When conflicts occur, the script uses the `-X ours` merge strategy:

- **Your changes**: Always kept (never overwritten)
- **Remote changes**: Integrated where they don't conflict
- **Result**: Safe, automatic merge that preserves your work

### Example Conflict Scenario

```
Remote changes:  "export const NEW_FEATURE = true"
Your changes:    "export const NEW_FEATURE = false"
Result after sync: Your version kept (NEW_FEATURE = false)
```

## Troubleshooting

### Build failed after sync

```bash
# Check what changed
git log --oneline -5

# Review conflicts manually
git diff HEAD

# Revert sync if needed
git reset --hard origin/main  # Use with caution!
```

### Script won't run

```bash
# Verify it's executable
chmod +x auto-sync-safe.sh

# Test manually first
bash auto-sync-safe.sh

# Check logs
cat .auto-sync.log
```

### Too many backup branches

```bash
# Clean up old backups (keep last 10)
git branch | grep "auto-backup-" | sort -r | tail -n +11 | xargs git branch -D
```

## Best Practices

✓ **Do:**
- Run regularly (every 30 min - 2 hours)
- Check logs weekly
- Monitor build failures in `.auto-sync.log`
- Test manually first before scheduling

✗ **Don't:**
- Run with `--force-push` or `--hard-reset`
- Disable build validation
- Use on `production` branch without approval
- Run concurrently (will cause conflicts)

## Disabling Auto-Sync

### Crontab

```bash
crontab -e  # Comment out or remove the line
```

### GitHub Actions

```bash
git rm .github/workflows/auto-sync.yml
git commit -m "Disable auto-sync"
```

### Systemd

```bash
systemctl --user disable auto-sync-capital.timer
systemctl --user stop auto-sync-capital.timer
```
