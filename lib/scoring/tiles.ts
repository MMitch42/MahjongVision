import type { Tile, SuitedTile, HonorTile, WindValue, DragonValue } from "./types";
import { WIND_DORA_ORDER, DRAGON_DORA_ORDER } from "./types";

export function isSuited(t: Tile): t is SuitedTile {
  return t.suit !== "honor";
}

export function isHonor(t: Tile): t is HonorTile {
  return t.suit === "honor";
}

export function isWind(t: Tile): t is HonorTile & { value: WindValue } {
  return isHonor(t) && WIND_DORA_ORDER.includes(t.value as WindValue);
}

export function isDragon(t: Tile): t is HonorTile & { value: DragonValue } {
  return isHonor(t) && DRAGON_DORA_ORDER.includes(t.value as DragonValue);
}

export function isTerminal(t: Tile): boolean {
  return isSuited(t) && (t.value === 1 || t.value === 9);
}

export function isTerminalOrHonor(t: Tile): boolean {
  return isHonor(t) || isTerminal(t);
}

export function tilesEqual(a: Tile, b: Tile): boolean {
  if (a.suit !== b.suit) return false;
  if (isSuited(a) && isSuited(b)) return a.value === b.value;
  if (isHonor(a) && isHonor(b)) return a.value === b.value;
  return false;
}

/** Ignores aka when comparing for dora/grouping purposes */
export function tilesEqualIgnoreAka(a: Tile, b: Tile): boolean {
  return tilesEqual(a, b);
}

export function tileKey(t: Tile): string {
  return `${t.suit}:${t.value}`;
}

export function doraFromIndicator(indicator: Tile): Tile {
  if (isHonor(indicator)) {
    if (isWind(indicator)) {
      const idx = WIND_DORA_ORDER.indexOf(indicator.value as WindValue);
      return { suit: "honor", value: WIND_DORA_ORDER[(idx + 1) % 4] };
    } else {
      const idx = DRAGON_DORA_ORDER.indexOf(indicator.value as DragonValue);
      return { suit: "honor", value: DRAGON_DORA_ORDER[(idx + 1) % 3] };
    }
  }
  const s = indicator as SuitedTile;
  const nextVal = s.value === 9 ? 1 : s.value + 1;
  return { suit: s.suit, value: nextVal as SuitedTile["value"] };
}

export function countDora(tiles: Tile[], indicators: Tile[]): number {
  const doraList = indicators.map(doraFromIndicator);
  let count = 0;
  for (const tile of tiles) {
    for (const dora of doraList) {
      if (tilesEqual(tile, dora)) count++;
    }
  }
  return count;
}

export function countAkaDora(tiles: Tile[]): number {
  return tiles.filter((t) => isSuited(t) && (t as SuitedTile).isAka === true).length;
}

/** Sort tiles for grouping: suited by suit+value, honors by value string */
export function sortTiles(tiles: Tile[]): Tile[] {
  return [...tiles].sort((a, b) => {
    const suitOrder = { man: 0, pin: 1, sou: 2, honor: 3 };
    if (suitOrder[a.suit] !== suitOrder[b.suit]) return suitOrder[a.suit] - suitOrder[b.suit];
    if (isSuited(a) && isSuited(b)) return a.value - b.value;
    if (isHonor(a) && isHonor(b)) return String(a.value).localeCompare(String(b.value));
    return 0;
  });
}
