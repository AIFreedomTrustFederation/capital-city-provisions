#!/usr/bin/env python3
import subprocess
import sys
from pathlib import Path

BRANCH = "main"
REMOTE = "origin"

def run(cmd, check=False):
    print(f"\n$ {' '.join(cmd)}")
    result = subprocess.run(cmd, text=True, capture_output=True)
    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr)
    if check and result.returncode != 0:
        sys.exit(result.returncode)
    return result

def main():
    if not Path(".git").exists():
        print("ERROR: Run this from the repo root.")
        sys.exit(1)

    print("Checking Git status...")
    run(["git", "status", "--short"])

    print("Saving local uncommitted work safely...")
    stash = run(["git", "stash", "push", "-u", "-m", "auto-save-before-pull"])

    print("Fetching latest GitHub changes...")
    run(["git", "fetch", "--tags", REMOTE], check=True)

    print("Rebasing local branch onto GitHub main...")
    rebase = run(["git", "pull", "--rebase", REMOTE, BRANCH])

    if rebase.returncode != 0:
        print("\nRebase failed, likely due to conflicts.")
        print("Run:")
        print("  git status")
        print("Fix files, then:")
        print("  git add .")
        print("  git rebase --continue")
        print("Or abort with:")
        print("  git rebase --abort")
        sys.exit(1)

    print("Restoring saved local work...")
    pop = run(["git", "stash", "pop"])

    if pop.returncode != 0:
        print("\nStash pop had conflicts.")
        print("Run:")
        print("  git status")
        print("Fix conflicts, then:")
        print("  git add .")
        print("  git commit -m 'Resolve local changes after sync'")
        sys.exit(1)

    print("Setting pull behavior to rebase by default...")
    run(["git", "config", "pull.rebase", "true"])

    print("Final status:")
    run(["git", "status"])

    print("\nDone. If everything looks good, run:")
    print("  git add .")
    print("  git commit -m 'Update site assets and homepage'")
    print("  git push origin main")

if __name__ == "__main__":
    main()
    