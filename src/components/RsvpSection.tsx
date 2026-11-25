import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import ShinyText from './reactbits/ShinyText';
import WaveTransition from './WaveTransition';
import { EVENT_INFO } from '../data/reunionData';
import { useScrollReveal } from '../utils/useScrollReveal';

export default function RsvpSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useScrollReveal(sectionRef);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced || !sectionRef.current) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.utils.toArray<HTMLElement>('.rsvp-parallax').forEach((el, idx) => {
        gsap.to(el, {
          y: idx % 2 === 0 ? -34 : 34,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EVENT_INFO.rsvpUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt('Copy Form Link:', EVENT_INFO.rsvpUrl);
    }
  };

  return (
    <section ref={sectionRef} id="attendance" className="bg-midnight-sparkle relative overflow-x-clip px-4 pb-44 pt-32 sm:px-8 sm:pb-48 sm:pt-36">
      <div className="denim-twill-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
      <WaveTransition edge="top" toColor="#081122" heightClass="h-16 sm:h-24" className="z-[5]" />

      {/* TOP-LEFT OVERLOADED COLLAGE */}
      <div className="rsvp-parallax pointer-events-none absolute -left-14 top-4 z-10 h-52 w-56 select-none sm:-left-8 sm:top-6 sm:h-80 sm:w-84">
        <img src="/assets/stickers/disco-ball-checkered.webp" alt="" loading="lazy" decoding="async" className="absolute left-0 top-0 h-30 w-30 opacity-90 md:drop-shadow-2xl sm:h-56 sm:w-56" />
        <img src="/assets/stickers/bow-navy-satin.webp" alt="" loading="lazy" decoding="async" className="absolute left-12 top-12 h-16 w-auto -rotate-12 sm:left-28 sm:top-28 sm:h-32" />
        <img src="/assets/stickers/heart-chrome-small.webp" alt="" loading="lazy" decoding="async" className="absolute left-24 top-2 h-9 w-auto rotate-12 sm:left-48 sm:h-16" />
        <img src="/assets/stickers/martini-glass.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:left-40 sm:top-32 sm:h-24 sm:w-auto sm:-rotate-12 md:drop-shadow-xl" />
        <img src="/assets/stickers/pool-ball-2.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:left-6 sm:top-48 sm:h-14 sm:w-14 sm:rotate-12" />
      </div>

      {/* TOP-RIGHT OVERLOADED COLLAGE */}
      <div className="rsvp-parallax pointer-events-none absolute -right-14 top-4 z-10 h-52 w-56 select-none sm:-right-8 sm:top-6 sm:h-80 sm:w-84">
        <img src="/assets/stickers/disco-ball-stars.webp" alt="" loading="lazy" decoding="async" className="absolute right-0 top-0 h-30 w-auto md:drop-shadow-2xl sm:h-56" />
        <img src="/assets/stickers/bow-chrome-large.webp" alt="" loading="lazy" decoding="async" className="absolute right-10 top-12 h-16 w-auto rotate-12 sm:right-24 sm:top-28 sm:h-32" />
        <img src="/assets/stickers/star-glitter-silver.webp" alt="" loading="lazy" decoding="async" className="absolute right-4 top-28 h-12 w-12 rotate-12 sm:right-8 sm:top-48 sm:h-16 sm:w-16" />
        <img src="/assets/stickers/butterfly-blue.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:right-48 sm:top-10 sm:h-24 sm:w-auto sm:-rotate-12" />
        <img src="/assets/stickers/bow-chrome.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:right-36 sm:top-36 sm:h-20 sm:w-auto sm:-rotate-12" />
      </div>

      {/* BOTTOM-LEFT OVERLOADED COLLAGE */}
      <div className="rsvp-parallax pointer-events-none absolute bottom-12 -left-14 z-10 h-52 w-52 select-none sm:bottom-14 sm:-left-10 sm:h-80 sm:w-80">
        <img src="/assets/stickers/glitter-wave-blue.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-0 left-0 h-20 w-44 opacity-90 sm:h-32 sm:w-68" />
        <img src="/assets/stickers/vinyl-disc-blue.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-2 left-24 h-20 w-20 opacity-90 sm:left-36 sm:h-32 sm:w-32" />
        <img src="/assets/stickers/cowboy-hat-silver.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-14 left-0 h-24 w-auto -rotate-12 md:drop-shadow-2xl sm:bottom-24 sm:left-2 sm:h-40" />
        <img src="/assets/stickers/flower-blue.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-8 sm:left-10 sm:h-24 sm:w-auto sm:rotate-12 md:drop-shadow-xl" />
        <img src="/assets/stickers/star-denim-studded.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-28 left-20 h-12 w-12 rotate-12 md:drop-shadow-xl sm:bottom-44 sm:left-36 sm:h-20 sm:w-20" />
        <img src="/assets/stickers/butterfly-blue.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-36 sm:left-16 sm:h-20 sm:w-auto sm:-rotate-12" />
        <img src="/assets/stickers/heart-chrome-small.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-16 sm:left-44 sm:h-14 sm:w-auto sm:rotate-12" />
      </div>

      {/* BOTTOM-RIGHT OVERLOADED COLLAGE */}
      <div className="rsvp-parallax pointer-events-none absolute bottom-12 -right-14 z-10 h-52 w-52 select-none sm:bottom-14 sm:-right-8 sm:h-80 sm:w-80">
        <img src="/assets/stickers/disco-ball-clean.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-0 right-12 h-28 w-28 opacity-90 md:drop-shadow-2xl sm:right-24 sm:h-44 sm:w-44" />
        <img src="/assets/stickers/disco-girl.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-2 right-0 h-32 w-auto md:drop-shadow-[0_18px_32px_rgba(4,8,18,0.88)] sm:h-52" />
        <img src="/assets/stickers/lips-blue-glossy.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-12 right-24 h-12 w-auto -rotate-12 md:drop-shadow-xl sm:bottom-24 sm:right-40 sm:h-20" />
        <img src="/assets/stickers/denim-smiley-patch.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-2 sm:right-48 sm:h-20 sm:w-20 sm:-rotate-12" />
        <img src="/assets/stickers/star-glitter-blue.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-32 right-6 h-12 w-12 rotate-12 sm:bottom-48 sm:right-12 sm:h-16 sm:w-16" />
        <img src="/assets/stickers/sparkle-chrome-left.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-44 sm:right-32 sm:h-20 sm:w-auto sm:opacity-95" />
        <img src="/assets/stickers/lips-silver-2.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-24 sm:right-52 sm:h-14 sm:w-auto sm:rotate-12" />
      </div>

      {/* FRAMELESS ATTENDANCE FORM FINALE */}
      <div className="rsvp-content soft-radial-scrim editorial-shadow relative z-20 mx-auto max-w-xl px-4 py-8 text-center">
        <h2 className="reveal-item font-editorial text-5xl font-bold text-white sm:text-6xl">
          <ShinyText text="Count Yourself In" color="#ffffff" shineColor="#9ec5ff" speed={2.3} />
        </h2>

        <p
          style={{ transitionDelay: '60ms' }}
          className="reveal-item mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#dce7f8] sm:text-base"
        >
          Help us finalize the headcount, food, games, and raffle prizes for Diamond&apos;s overnight reunion. Kindly fill out our Google Form on or before:
        </p>

        <p
          style={{ transitionDelay: '110ms' }}
          className="reveal-item mt-4 font-editorial text-2xl font-bold tracking-wide text-[#f5d79b] sm:text-3xl"
        >
          {EVENT_INFO.rsvpDeadlineDisplay}
        </p>

        <div
          style={{ transitionDelay: '150ms' }}
          className="reveal-item mt-7 flex flex-col items-center gap-3"
        >
          <a
            href={EVENT_INFO.rsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textShadow: 'none' }}
            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f7e2b8] via-[#ffffff] to-[#d6e6ff] px-8 py-3.5 text-sm font-extrabold uppercase tracking-[0.16em] text-[#0c1930] shadow-[0_10px_30px_rgba(158,197,255,0.45),0_1px_0_rgba(255,255,255,0.9)_inset] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(245,215,155,0.62)] active:scale-95 sm:text-base"
          >
            Fill Out Attendance Form
            <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#bdd5f9] transition hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                Link Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Form Link ({EVENT_INFO.rsvpUrl.replace('https://', '')})
              </>
            )}
          </button>
        </div>

        <p
          style={{ transitionDelay: '190ms' }}
          className="reveal-item font-script mt-7 text-4xl text-[#9ec5ff]"
        >
          See you there, Diamond!
        </p>
      </div>

      {/* Borderless Editorial Footer */}
      <footer className="reveal-item editorial-shadow relative z-20 mx-auto mt-16 max-w-xs text-center text-xs leading-relaxed text-[#b9cff2] sm:max-w-lg">
        <p className="font-editorial text-lg font-semibold text-white">
          {EVENT_INFO.title}
        </p>
        <p className="mt-0.5">{EVENT_INFO.schoolFull}</p>
        <p className="mt-0.5">2014-2015</p>
        <p className="mt-0.5 font-medium text-[#dce7f8]">IV - Diamond</p>
        <p className="mt-0.5 text-[11px] text-[#96b2dd]">
          {EVENT_INFO.venueName}, {EVENT_INFO.venueLandmark}
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-[#cfe1fc]">
          {EVENT_INFO.dateDisplay}
        </p>
      </footer>
    </section>
  );
}
