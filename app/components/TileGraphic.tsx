import type { Tile, SuitedValue } from '@/lib/scoring/types';

export interface TileGraphicProps {
  tile: Tile;
  size?: 'normal' | 'small';
}

/**
 * Maps a Tile to its SVG filename in /public/tiles/.
 * Tile images: FluffyStuff/riichi-mahjong-tiles (CC0 public domain)
 * https://github.com/FluffyStuff/riichi-mahjong-tiles
 */
function tileFileName(tile: Tile): string {
  if (tile.suit === 'honor') {
    const map: Record<string, string> = {
      east:  'Ton',
      south: 'Nan',
      west:  'Shaa',
      north: 'Pei',
      haku:  'Haku',
      hatsu: 'Hatsu',
      chun:  'Chun',
    };
    return map[tile.value as string] ?? 'Blank';
  }

  const suit = tile.suit === 'man' ? 'Man'
             : tile.suit === 'pin' ? 'Pin'
             : 'Sou';
  const val = tile.value as SuitedValue;

  // Red 5 (aka dora)
  if (val === 5 && tile.isAka) return `${suit}5-Dora`;

  return `${suit}${val}`;
}

export default function TileGraphic({ tile, size = 'normal' }: TileGraphicProps) {
  const w = size === 'normal' ? 40 : 28;
  const h = size === 'normal' ? 56 : 39;
  const src = `/tiles/${tileFileName(tile)}.svg`;

  return (
    <span style={{
      display: 'inline-flex',
      background: '#f5f0dc',
      borderRadius: 3,
      padding: 2,
      boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
      lineHeight: 0,
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={tileFileName(tile)}
        width={w}
        height={h}
        style={{ display: 'block', imageRendering: 'auto' }}
        draggable={false}
      />
    </span>
  );
}
