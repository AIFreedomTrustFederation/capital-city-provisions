#!/usr/bin/env bash
set -euo pipefail

FILE="sync-all-codespaces.sh"

if [ ! -f "$FILE" ]; then
  echo "ERROR: $FILE not found."
  exit 1
fi

cp "$FILE" "${FILE}.bak"

awk '
BEGIN { skip=0 }
/echo " PUBLIC IMAGE INVENTORY"/ {
  print "echo \"==========================================\""
  print "echo \" PUBLIC IMAGE INVENTORY\""
  print "echo \"==========================================\""
  print ""
  print "IMAGE_LIST=$(find public -type f 2>/dev/null | grep -Ei '\\'\\.(png|jpg|jpeg|svg|webp)\\'\\' | sort || true)"
  print ""
  print "if [ -n \"$IMAGE_LIST\" ]; then"
  print "  echo \"$IMAGE_LIST\""
  print "else"
  print "  echo \"No public image files found.\""
  print "fi"
  print ""
  print "echo \"\""
  print "echo \"Image Count:\""
  print "if [ -n \"$IMAGE_LIST\" ]; then"
  print "  echo \"$IMAGE_LIST\" | wc -l"
  print "else"
  print "  echo \"0\""
  print "fi"
  skip=1
  next
}
skip==1 && /echo " SUCCESS"/ {
  print ""
  print "echo \"==========================================\""
  print "echo \" SUCCESS\""
  skip=0
  next
}
skip==1 { next }
{ print }
' "$FILE" > "${FILE}.tmp"

mv "${FILE}.tmp" "$FILE"
chmod +x "$FILE"

echo "Patch complete."
echo "Backup saved as ${FILE}.bak"
