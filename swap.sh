#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# Default: convert .svg references to .png
# Usage:  ./swap-logo.sh png     → svg becomes png
#         ./swap-logo.sh svg     → png becomes svg

TARGET="${1:-png}"

case "$TARGET" in
  png|svg) ;;
  *) echo "Usage: $0 [png|svg]"; exit 1 ;;
esac

if [[ "$TARGET" == "png" ]]; then SOURCE="svg"; else SOURCE="png"; fi

cd "$HOME/astrovexus"

echo "Swapping /logo…  .$SOURCE  →  .$TARGET"
echo

for f in src/components/Nav.tsx src/components/Footer.tsx index.html; do
  if [[ ! -f "$f" ]]; then
    echo "skip:  $f  (not found)"
    continue
  fi
  cp "$f" "$f.bak"
  sed -i "s|/logo-mark\.$SOURCE|/logo-mark.$TARGET|g" "$f"
  sed -i "s|/logo\.$SOURCE|/logo.$TARGET|g" "$f"
  echo "done:  $f"
done

# Favicon MIME type — only relevant when target is png
if [[ "$TARGET" == "png" && -f index.html ]]; then
  sed -i 's|type="image/svg+xml"|type="image/png"|g' index.html
fi

echo
echo "Backups saved as <file>.bak"
echo "To revert all:  find . -name '*.bak' -exec sh -c 'mv \"\$1\" \"\${1%.bak}\"' _ {} \\;"
