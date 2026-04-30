#!/bin/bash
# Downloads all FluffyStuff riichi-mahjong-tiles (CC0 public domain) into this directory.
# Run from ~/MahjongVision/public/tiles/
# Usage: bash download.sh

BASE="https://raw.githubusercontent.com/FluffyStuff/riichi-mahjong-tiles/master/Regular"

FILES=(
  Man1 Man2 Man3 Man4 Man5 Man6 Man7 Man8 Man9
  Pin1 Pin2 Pin3 Pin4 Pin5 Pin6 Pin7 Pin8 Pin9
  Sou1 Sou2 Sou3 Sou4 Sou5 Sou6 Sou7 Sou8 Sou9
  Ton Nan Shaa Pei
  Haku Hatsu Chun
  Man5-Dora Pin5-Dora Sou5-Dora
)

for name in "${FILES[@]}"; do
  echo "Downloading ${name}.svg..."
  curl -sf "$BASE/${name}.svg" -o "${name}.svg" || echo "  FAILED: ${name}.svg"
done

echo "Done."
