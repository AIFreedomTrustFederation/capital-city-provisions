#!/usr/bin/env bash
set -euo pipefail

# Capital City Provisions menu graphic uploader
# Run from the repo root in Codespaces:
#   bash scripts/upload-menu-image.sh
#
# This script lets you upload/replace ONE wired menu image at a time.
# The website currently expects:
#   public/menu/guarantee-menu.png
#   public/menu/premium-steak-box.png

MENU_DIR="public/menu"
mkdir -p "$MENU_DIR"

echo ""
echo "Capital City Provisions - Menu Image Uploader"
echo "---------------------------------------------"
echo "This wires one uploaded image at a time into the exact path used by /menu."
echo ""
echo "Choose which menu image you are uploading:"
echo "  1) Guarantee / delivery / payment menu graphic"
echo "     -> $MENU_DIR/guarantee-menu.png"
echo ""
echo "  2) Premium steak box pricing menu graphic"
echo "     -> $MENU_DIR/premium-steak-box.png"
echo ""
read -rp "Enter 1 or 2: " choice

case "$choice" in
  1)
    TARGET="$MENU_DIR/guarantee-menu.png"
    LABEL="guarantee menu graphic"
    ;;
  2)
    TARGET="$MENU_DIR/premium-steak-box.png"
    LABEL="premium steak box menu graphic"
    ;;
  *)
    echo "Invalid choice. Please run again and choose 1 or 2."
    exit 1
    ;;
esac

echo ""
echo "Now upload the image from your phone into Codespaces."
echo "Good temporary places are:"
echo "  ./uploads"
echo "  ./public/menu"
echo "  the repo root"
echo ""
echo "After uploading, paste the file path here."
echo "Examples:"
echo "  uploads/my-menu-photo.png"
echo "  public/menu/IMG_1234.PNG"
echo "  IMG_1234.jpeg"
echo ""
read -rp "Path to uploaded image: " SOURCE

# Remove surrounding quotes if the path was pasted with quotes.
SOURCE="${SOURCE%\"}"
SOURCE="${SOURCE#\"}"
SOURCE="${SOURCE%\'}"
SOURCE="${SOURCE#\'}"

if [[ ! -f "$SOURCE" ]]; then
  echo "File not found: $SOURCE"
  echo "Upload the image into Codespaces first, then run this script again."
  exit 1
fi

EXT="${SOURCE##*.}"
EXT_LOWER="$(printf '%s' "$EXT" | tr '[:upper:]' '[:lower:]')"

if [[ "$EXT_LOWER" != "png" && "$EXT_LOWER" != "jpg" && "$EXT_LOWER" != "jpeg" && "$EXT_LOWER" != "webp" ]]; then
  echo "Unsupported image type: .$EXT"
  echo "Please upload a PNG, JPG, JPEG, or WEBP image."
  exit 1
fi

if [[ -f "$TARGET" ]]; then
  BACKUP="$TARGET.backup-$(date +%Y%m%d-%H%M%S)"
  cp "$TARGET" "$BACKUP"
  echo "Existing file backed up to: $BACKUP"
fi

# The page is wired to PNG filenames. This copies the uploaded image into the wired path.
# If you upload JPG/WEBP, it will still be named .png. Most browsers handle this, but PNG export is best.
cp "$SOURCE" "$TARGET"

echo ""
echo "Installed $LABEL:"
echo "  $TARGET"
echo ""

if command -v file >/dev/null 2>&1; then
  echo "Detected file type:"
  file "$TARGET" || true
  echo ""
fi

if command -v git >/dev/null 2>&1; then
  git add "$TARGET"
  echo "Git status:"
  git status --short "$TARGET"
  echo ""
  read -rp "Commit and push this image now? [y/N]: " do_commit
  case "$do_commit" in
    y|Y|yes|YES)
      git commit -m "Add $LABEL"
      git push
      echo "Done. Image committed and pushed."
      ;;
    *)
      echo "Not committed yet. When ready, run:"
      echo "  git add $TARGET"
      echo "  git commit -m \"Add $LABEL\""
      echo "  git push"
      ;;
  esac
fi

echo ""
echo "Menu page reference is already wired to: /$TARGET"
