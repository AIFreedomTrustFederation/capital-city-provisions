#!/usr/bin/env python3
"""README-aligned Codespace sync helper.

This Python wrapper intentionally delegates to sync-current-codespace.sh so the
project uses one official, safe sync path.

It does not run destructive reset, clean, force-push, or delete commands.
Run it from the repository root in each Codespace:

  python3 fix_git.py
  python3 fix_git.py --no-build
  python3 fix_git.py --no-install --no-build
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

SYNC_SCRIPT = Path("sync-current-codespace.sh")
ALLOWED_ARGS = {"--no-install", "--no-build", "--help", "-h"}


def fail(message: str, code: int = 1) -> None:
    print(f"ERROR: {message}")
    sys.exit(code)


def main() -> None:
    if not Path(".git").exists():
        fail("Run this from the repository root.")

    unknown = [arg for arg in sys.argv[1:] if arg not in ALLOWED_ARGS]
    if unknown:
        fail("Unknown option(s): " + ", ".join(unknown), 2)

    if not SYNC_SCRIPT.exists():
        fail("sync-current-codespace.sh is missing. Pull the latest repository copy first.")

    print("Capital City Provisions README-aligned sync")
    print("Delegating to: bash sync-current-codespace.sh")
    print("Safe mode: no reset --hard, no clean, no force-push, no delete")

    cmd = ["bash", str(SYNC_SCRIPT), *sys.argv[1:]]
    result = subprocess.run(cmd)
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
