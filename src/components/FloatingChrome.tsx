import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { EVENT_INFO } from '../data/reunionData';

interface FloatingChromeProps {
  playing: boolean;
  onToggleMusic: () => void;
}

export default function FloatingChrome({ playing, onToggleMusic }: FloatingChromeProps) {
  const [showFormLink, setShowFormLink] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowFormLink(window.scrollY > 420);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Quick Floating Attendance Pill Button (bottom-left) */}
      <a
        href={EVENT_INFO.rsvpUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textShadow: 'none' }}
        className={`fixed bottom-4 left-4 z-40 inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/60 bg-white/95 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0c1930] shadow-[0_8px_24px_rgba(4,10,24,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f7e2b8] sm:bottom-6 sm:left-6 ${
          showFormLink ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        Confirm Attendance
        <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
      </a>

      {/* Bare Floating Spinning Black Vinyl Disc Toggle (bottom-right) */}
      <button
        type="button"
        onClick={onToggleMusic}
        aria-label={playing ? 'Mute reunion background music' : 'Play reunion background music'}
        aria-pressed={playing}
        className="group fixed bottom-3 right-4 z-40 flex min-h-[48px] cursor-pointer flex-col items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9ec5ff] sm:bottom-5 sm:right-6"
      >
        <img
          src="/assets/stickers/vinyl-disc-black.png"
          alt=""
          className={`h-12 w-12 rounded-full object-contain drop-shadow-[0_10px_20px_rgba(4,9,20,0.85)] transition-transform duration-300 group-hover:scale-110 vinyl-spin sm:h-14 sm:w-14 ${
            playing ? '' : 'vinyl-spin-paused'
          }`}
        />
        <span className="editorial-shadow text-[9px] font-bold uppercase tracking-[0.22em] text-[#e5ecf7]">
          {playing ? 'Playing' : 'Music'}
        </span>
      </button>
    </>
  );
}
