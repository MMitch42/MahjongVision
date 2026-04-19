import type { Tile, SuitedValue } from '@/lib/scoring/types';

export interface TileGraphicProps {
  tile: Tile;
  size?: 'normal' | 'small';
}

const MAN_NUMERALS: Record<SuitedValue, string> = {
  1: '一', 2: '二', 3: '三', 4: '四', 5: '五',
  6: '六', 7: '七', 8: '八', 9: '九',
};

const HONOR_CHARS: Record<string, string> = {
  east: '東', south: '南', west: '西', north: '北',
  hatsu: '發', chun: '中',
};

const HONOR_COLORS: Record<string, string> = {
  east: '#cc2200', south: '#cc2200', west: '#cc2200', north: '#cc2200',
  hatsu: '#2d7a2d', chun: '#cc2200',
};

function ManGraphic({ value, isAka }: { value: SuitedValue; isAka: boolean }) {
  return (
    <>
      <text x="15" y="22" textAnchor="middle" fontSize="17" fontWeight="bold"
        fill={isAka ? '#cc2200' : '#111111'} fontFamily="serif">
        {MAN_NUMERALS[value]}
      </text>
      <text x="15" y="33" textAnchor="middle" fontSize="9" fill="#555555" fontFamily="serif">
        万
      </text>
    </>
  );
}

function PinGraphic({ value, isAka }: { value: SuitedValue; isAka: boolean }) {
  return (
    <>
      <text x="15" y="20" textAnchor="middle" fontSize="15" fontWeight="bold"
        fill={isAka ? '#cc2200' : '#111111'}>
        {value}
      </text>
      <circle cx="15" cy="31" r="4.5" fill="#1a5fa8" />
    </>
  );
}

function SouGraphic({ value, isAka }: { value: SuitedValue; isAka: boolean }) {
  return (
    <>
      <text x="15" y="20" textAnchor="middle" fontSize="15" fontWeight="bold"
        fill={isAka ? '#cc2200' : '#111111'}>
        {value}
      </text>
      <text x="15" y="33" textAnchor="middle" fontSize="10" fill="#2d7a2d" fontFamily="serif">
        竹
      </text>
    </>
  );
}

function HonorGraphic({ value }: { value: string }) {
  if (value === 'haku') {
    return <rect x="6" y="7" width="18" height="24" rx="2" fill="none" stroke="#1a5fa8" strokeWidth="3" />;
  }
  return (
    <text x="15" y="26" textAnchor="middle" fontSize="20" fontWeight="bold"
      fill={HONOR_COLORS[value] ?? '#111111'} fontFamily="serif">
      {HONOR_CHARS[value]}
    </text>
  );
}

export default function TileGraphic({ tile, size = 'normal' }: TileGraphicProps) {
  const w = size === 'normal' ? 28 : 20;
  const h = size === 'normal' ? 36 : 25;

  return (
    <svg viewBox="0 0 30 38" width={w} height={h} style={{ display: 'block' }}>
      <rect x="0" y="0" width="30" height="38" fill="#f5f0dc" />
      {tile.suit === 'man' && <ManGraphic value={tile.value} isAka={tile.isAka ?? false} />}
      {tile.suit === 'pin' && <PinGraphic value={tile.value} isAka={tile.isAka ?? false} />}
      {tile.suit === 'sou' && <SouGraphic value={tile.value} isAka={tile.isAka ?? false} />}
      {tile.suit === 'honor' && <HonorGraphic value={tile.value} />}
    </svg>
  );
}
