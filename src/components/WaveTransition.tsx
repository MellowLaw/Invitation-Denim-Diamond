interface WaveTransitionProps {
  toColor: string;
  edge?: 'bottom' | 'top';
  heightClass?: string;
  blur?: boolean;
  className?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = Number.parseInt(clean[0] + clean[0], 16);
    const g = Number.parseInt(clean[1] + clean[1], 16);
    const b = Number.parseInt(clean[2] + clean[2], 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return [r, g, b];
    }
  }
  if (clean.length === 6) {
    const r = Number.parseInt(clean.slice(0, 2), 16);
    const g = Number.parseInt(clean.slice(2, 4), 16);
    const b = Number.parseInt(clean.slice(4, 6), 16);
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      return [r, g, b];
    }
  }
  return [12, 23, 43];
}

export default function WaveTransition({
  toColor,
  edge = 'bottom',
  heightClass = 'h-32 sm:h-44',
  blur = true,
  className = '',
}: WaveTransitionProps) {
  const [r, g, b] = hexToRgb(toColor);
  const direction = edge === 'top' ? 'to top' : 'to bottom';

  const gradientStops = [
    `rgba(${r}, ${g}, ${b}, 0) 0%`,
    `rgba(${r}, ${g}, ${b}, 0.08) 22%`,
    `rgba(${r}, ${g}, ${b}, 0.28) 46%`,
    `rgba(${r}, ${g}, ${b}, 0.62) 70%`,
    `rgba(${r}, ${g}, ${b}, 0.9) 88%`,
    `rgba(${r}, ${g}, ${b}, 1) 100%`,
  ].join(', ');

  const blurMask = `linear-gradient(${direction}, transparent 0%, rgba(0, 0, 0, 0.45) 55%, black 100%)`;

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${
        edge === 'top' ? 'top-0' : 'bottom-0'
      } select-none ${heightClass} ${className}`.trim()}
      aria-hidden="true"
    >
      {blur && (
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            maskImage: blurMask,
            WebkitMaskImage: blurMask,
          }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${direction}, ${gradientStops})`,
        }}
      />
    </div>
  );
}
