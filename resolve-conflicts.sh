#!/usr/bin/env bash
set -euo pipefail

echo "1) Conflicted files:"
git diff --name-only --diff-filter=U || true

echo ""
echo "2) Status:"
git status --short

echo ""
echo "3) Auto-resolving common generated files..."
for file in package-lock.json package.json; do
  if git diff --name-only --diff-filter=U | grep -qx "$file"; then
    echo "Resolving $file by keeping remote version first..."
    git checkout --theirs "$file"
    git add "$file"
  fi
done

echo ""
echo "4) Remaining conflicts:"
git diff --name-only --diff-filter=U || true

if [ -n "$(git diff --name-only --diff-filter=U)" ]; then
  echo ""
  echo "❌ Still has conflicts. Open these files and remove <<<<<<< ======= >>>>>>> markers:"
  git diff --name-only --diff-filter=U
  exit 1
fi

echo ""
echo "5) Finish merge commit..."
git add .
git commit -m "Resolve merge conflicts"

echo ""
echo "6) Push..."
git push origin main

echo "✅ Done"
