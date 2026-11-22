interface ChromeWordProps {
  word: string;
  className?: string;
  letterClassName?: string;
}

const TILTS = [-4, 2, -2.5, 3, -3.5, 2.5, -1.5, 3];

export default function ChromeWord({
  word,
  className = '',
  letterClassName = 'h-10 sm:h-16 md:h-20',
}: ChromeWordProps) {
  const letters = word.toUpperCase().replace(/[^A-Z]/g, '').split('');

  return (
    <div
      className={`inline-flex max-w-full flex-nowrap items-center justify-center gap-0.5 sm:gap-1 ${className}`.trim()}
      role="heading"
      aria-label={word}
    >
      {letters.map((ch, idx) => (
        <img
          key={`${ch}-${idx}`}
          src={`/assets/letters/letter-${ch}.webp`}
          alt={ch}
          decoding="async"
          fetchPriority="high"
          draggable={false}
          className={`${letterClassName} w-auto select-none object-contain drop-shadow-[0_6px_14px_rgba(12,23,43,0.45)] transition-transform duration-300 hover:scale-110`.trim()}
          style={{
            transform: `rotate(${TILTS[idx % TILTS.length]}deg) translateY(${idx % 2 === 0 ? -2 : 2}px)`,
          }}
        />
      ))}
    </div>
  );
}
