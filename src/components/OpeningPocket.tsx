import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ShinyText from './reactbits/ShinyText';
import ChromeWord from './ChromeWord';
import { EVENT_INFO } from '../data/reunionData';

interface OpeningPocketProps {
  onOpened: () => void;
}

export default function OpeningPocket({ onOpened }: OpeningPocketProps) {
  const [opening, setOpening] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tlCornerRef = useRef<HTMLDivElement>(null);
  const trCornerRef = useRef<HTMLDivElement>(null);
  const blCornerRef = useRef<HTMLDivElement>(null);
  const brCornerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(tlCornerRef.current, { x: -40, y: -40, opacity: 0, duration: 0.85, ease: 'power3.out', clearProps: 'transform' });
      gsap.from(trCornerRef.current, { x: 40, y: -40, opacity: 0, duration: 0.85, ease: 'power3.out', clearProps: 'transform' });
      gsap.from(blCornerRef.current, { x: -40, y: 40, opacity: 0, duration: 0.85, ease: 'power3.out', clearProps: 'transform' });
      gsap.from(brCornerRef.current, { x: 40, y: 40, opacity: 0, duration: 0.85, ease: 'power3.out', clearProps: 'transform' });
      gsap.from('.pocket-center-item', {
        y: 22,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.78,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,filter',
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced) {
      onOpened();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => onOpened(),
    });

    tl.to(tlCornerRef.current, { x: -160, y: -160, opacity: 0, duration: 0.78, ease: 'power3.inOut' }, 0)
      .to(trCornerRef.current, { x: 160, y: -160, opacity: 0, duration: 0.78, ease: 'power3.inOut' }, 0)
      .to(blCornerRef.current, { x: -160, y: 160, opacity: 0, duration: 0.78, ease: 'power3.inOut' }, 0)
      .to(brCornerRef.current, { x: 160, y: 160, opacity: 0, duration: 0.78, ease: 'power3.inOut' }, 0)
      .to(centerRef.current, { scale: 1.08, opacity: 0, duration: 0.55, ease: 'power2.in' }, 0.12)
      .to(rootRef.current, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0.6);
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1428] via-[#132648] to-[#0b172d]"
      role="dialog"
      aria-modal="true"
      aria-label="Open Diamond Reunion Invitation"
    >
      <div className="denim-twill-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
      {/* Top-Left Overloaded Collage Cluster */}
      <div ref={tlCornerRef} className="pointer-events-none absolute -left-10 -top-10 z-10 h-60 w-60 select-none sm:-left-8 sm:-top-8 sm:h-84 sm:w-84">
        <img src="/assets/stickers/vinyl-disc-blue.png" alt="" className="absolute left-14 top-0 h-28 w-28 opacity-85 sm:left-24 sm:h-40 sm:w-40" />
        <img src="/assets/stickers/disco-ball-checkered.png" alt="" className="absolute left-0 top-0 h-40 w-40 drop-shadow-[0_18px_28px_rgba(4,8,18,0.8)] sm:h-60 sm:w-60" />
        <img src="/assets/stickers/star-denim-studded.png" alt="" className="absolute left-24 top-24 h-20 w-20 -rotate-12 drop-shadow-xl sm:left-36 sm:top-36 sm:h-28 sm:w-28" />
        <img src="/assets/stickers/star-glitter-silver.png" alt="" className="absolute left-4 top-32 h-14 w-14 rotate-12 opacity-90 sm:top-48 sm:h-20 sm:w-20" />
        <img src="/assets/stickers/sparkle-chrome-left.png" alt="" className="absolute left-36 top-6 h-16 w-auto opacity-90 sm:left-56 sm:top-10 sm:h-24" />
        <img src="/assets/stickers/lips-silver-1.png" alt="" className="hidden sm:block sm:absolute sm:left-8 sm:top-56 sm:h-16 sm:w-auto sm:-rotate-12" />
      </div>

      {/* Top-Right Overloaded Collage Cluster */}
      <div ref={trCornerRef} className="pointer-events-none absolute -right-10 -top-10 z-10 h-60 w-60 select-none sm:-right-8 sm:-top-8 sm:h-84 sm:w-84">
        <img src="/assets/stickers/disco-ball-clean.png" alt="" className="absolute right-0 top-0 h-44 w-44 drop-shadow-[0_18px_28px_rgba(4,8,18,0.8)] sm:h-64 sm:w-64" />
        <img src="/assets/stickers/bow-navy-satin.png" alt="" className="absolute right-4 top-4 h-28 w-auto rotate-12 drop-shadow-2xl sm:right-8 sm:top-6 sm:h-40" />
        <img src="/assets/stickers/bow-chrome.png" alt="" className="absolute right-8 top-6 h-16 w-auto -rotate-6 drop-shadow-xl sm:right-14 sm:top-10 sm:h-24" />
        <img src="/assets/stickers/butterfly-blue.png" alt="" className="absolute right-32 top-24 h-16 w-auto -rotate-12 drop-shadow-xl sm:right-48 sm:top-36 sm:h-24" />
        <img src="/assets/stickers/flower-blue.png" alt="" className="absolute right-6 top-36 h-16 w-auto rotate-12 drop-shadow-xl sm:top-52 sm:h-24" />
        <img src="/assets/stickers/star-chrome-1.png" alt="" className="hidden sm:block sm:absolute sm:right-56 sm:top-10 sm:h-14 sm:w-14 sm:rotate-12" />
      </div>

      {/* Bottom-Left Overloaded Collage Cluster (left-anchored cowboy hat + denim patches) */}
      <div ref={blCornerRef} className="pointer-events-none absolute -bottom-10 -left-10 z-10 h-60 w-60 select-none sm:-bottom-8 sm:-left-8 sm:h-84 sm:w-84">
        <img src="/assets/stickers/glitter-wave-blue.png" alt="" className="absolute bottom-0 left-0 h-24 w-48 opacity-85 sm:h-36 sm:w-72" />
        <img src="/assets/stickers/disco-ball-stars.png" alt="" className="absolute bottom-0 left-0 h-40 w-40 drop-shadow-[0_18px_28px_rgba(4,8,18,0.8)] sm:h-60 sm:w-60" />
        <img src="/assets/stickers/cowboy-hat-silver.png" alt="" className="absolute bottom-24 left-2 h-24 w-auto -rotate-12 drop-shadow-2xl sm:bottom-36 sm:h-36" />
        <img src="/assets/stickers/denim-smiley-patch.png" alt="" className="absolute bottom-2 left-28 h-20 w-20 -rotate-12 drop-shadow-xl sm:left-40 sm:h-28 sm:w-28" />
        <img src="/assets/stickers/heart-chrome-small.png" alt="" className="absolute bottom-28 left-28 h-12 w-auto rotate-12 drop-shadow-xl sm:bottom-44 sm:left-44 sm:h-16" />
        <img src="/assets/stickers/star-denim-frayed.png" alt="" className="absolute bottom-8 left-44 h-14 w-14 rotate-6 sm:left-64 sm:h-20 sm:w-20" />
        <img src="/assets/stickers/bow-chrome-small.png" alt="" className="hidden sm:block sm:absolute sm:bottom-52 sm:left-16 sm:h-16 sm:w-auto sm:rotate-6" />
      </div>

      {/* Bottom-Right Overloaded Collage Cluster (zero balloons; crisp disco & chrome decals) */}
      <div ref={brCornerRef} className="pointer-events-none absolute -bottom-8 -right-8 z-10 h-60 w-64 select-none sm:-bottom-6 sm:-right-6 sm:h-84 sm:w-88">
        <img src="/assets/stickers/disco-ball-checkered.png" alt="" className="absolute bottom-0 right-24 h-28 w-28 opacity-90 drop-shadow-2xl sm:right-40 sm:h-44 sm:w-44" />
        <img src="/assets/stickers/disco-girl.png" alt="" className="absolute bottom-0 right-0 h-40 w-auto drop-shadow-[0_18px_28px_rgba(4,8,18,0.85)] sm:h-60" />
        <img src="/assets/stickers/bow-chrome-large.png" alt="" className="hidden sm:block sm:absolute sm:bottom-36 sm:right-40 sm:h-24 sm:w-auto sm:-rotate-12 sm:drop-shadow-xl" />
        <img src="/assets/stickers/lips-blue-glossy.png" alt="" className="absolute bottom-4 right-28 h-14 w-auto -rotate-12 drop-shadow-xl sm:right-48 sm:h-22" />
        <img src="/assets/stickers/pool-ball-2.png" alt="" className="absolute bottom-24 right-20 h-10 w-10 rotate-12 drop-shadow-xl sm:bottom-36 sm:right-28 sm:h-14 sm:w-14" />
        <img src="/assets/stickers/martini-glass.png" alt="" className="absolute bottom-28 right-32 h-18 w-auto -rotate-12 drop-shadow-xl sm:bottom-44 sm:right-48 sm:h-26" />
        <img src="/assets/stickers/star-glitter-blue.png" alt="" className="absolute bottom-36 right-6 h-12 w-12 rotate-12 sm:bottom-56 sm:h-16 sm:w-16" />
        <img src="/assets/stickers/sparkle-chrome-right.png" alt="" className="hidden sm:block sm:absolute sm:bottom-48 sm:right-24 sm:h-20 sm:w-auto sm:opacity-95" />
      </div>

      {/* Borderless Center Floating Typography & Chrome Star Seal */}
      <div ref={centerRef} className="soft-radial-scrim relative z-20 mx-auto flex max-w-md flex-col items-center px-6 py-12 text-center">
        <span className="pocket-center-item font-script editorial-shadow block text-4xl text-[#9ec5ff] sm:text-5xl">
          The Last
        </span>
        <div className="pocket-center-item">
          <ChromeWord word="DIAMOND" className="mt-1" letterClassName="h-10 sm:h-14" />
        </div>
        <p className="pocket-center-item font-editorial editorial-shadow mt-2 text-2xl font-semibold tracking-wide text-white sm:text-3xl">
          <ShinyText text="12 Years Later" color="#dce7f8" shineColor="#ffffff" speed={2.2} />
        </p>
        <p className="pocket-center-item font-editorial editorial-shadow mt-1.5 text-base italic tracking-wide text-[#f5d79b] sm:text-lg">
          {EVENT_INFO.schoolShort} Section Diamond
        </p>

        {/* Borderless Tactile Chrome Star Trigger */}
        <button
          type="button"
          onClick={handleOpen}
          className="pocket-center-item group mt-7 flex cursor-pointer flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#9ec5ff]"
        >
          <img
            src="/assets/stickers/star-chrome-puffy.png"
            alt="Tap star to open invitation"
            className="float-star h-24 w-24 object-contain drop-shadow-[0_0_28px_rgba(158,197,255,0.65)] transition-transform duration-300 group-hover:scale-110 group-active:scale-95 sm:h-28 sm:w-28"
          />
          <span className="editorial-shadow mt-2 text-xs font-extrabold uppercase tracking-[0.32em] text-white transition group-hover:text-[#f4dfb7]">
            Tap to Enter
          </span>
        </button>
      </div>
    </div>
  );
}
