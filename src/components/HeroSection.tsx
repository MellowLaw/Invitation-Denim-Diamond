import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Clock } from 'lucide-react';
import ChromeWord from './ChromeWord';
import ShinyText from './reactbits/ShinyText';
import Silk from './reactbits/Silk';
import WaveTransition from './WaveTransition';
import { EVENT_INFO } from '../data/reunionData';

interface HeroSectionProps {
  isMobile: boolean;
  active: boolean;
}

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function getTimeRemaining(targetIso: string): TimeParts {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, expired: false };
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export default function HeroSection({ isMobile, active }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [formLeft, setFormLeft] = useState(() => getTimeRemaining(EVENT_INFO.rsvpDeadlineIso));
  const [eventLeft, setEventLeft] = useState(() => getTimeRemaining(EVENT_INFO.startIso));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFormLeft(getTimeRemaining(EVENT_INFO.rsvpDeadlineIso));
      setEventLeft(getTimeRemaining(EVENT_INFO.startIso));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Pure GPU entrance timeline gated on pocket gate unlock
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(['.hero-stagger', '.hero-corner'], { clearProps: 'all' });
        return;
      }

      if (!active) {
        gsap.set('.hero-corner', { opacity: 0, scale: 0.94 });
        gsap.set('.hero-stagger', { opacity: 0, y: 18 });
        return;
      }

      gsap.fromTo(
        '.hero-corner',
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.05,
          ease: 'power3.out',
          force3D: true,
          clearProps: 'transform',
        }
      );

      gsap.fromTo(
        '.hero-stagger',
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.055,
          ease: 'power3.out',
          force3D: true,
          clearProps: 'transform',
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [active]);

  // Desktop-only scroll parallax so touch scrolling on mobile stays 60fps
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced || !sectionRef.current) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.utils.toArray<HTMLElement>('.hero-parallax').forEach((el, idx) => {
        const speed = Number(el.dataset.speed || 35);
        gsap.to(el, {
          y: idx % 2 === 0 ? -speed : speed,
          rotation: idx % 2 === 0 ? 5 : -5,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.1,
          },
        });
      });

      gsap.to('.hero-content-wrap', {
        y: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.1,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-x-clip bg-[#0c172b] px-6 pb-36 pt-32 sm:px-16 sm:pb-44 sm:pt-36"
    >
      {/* Exclusive Living Indigo Denim Silk Shader for Hero (paused while curtain covers it) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Silk
          color="#142748"
          sheenColor="#7fa7e6"
          speed={2.5}
          scale={1.25}
          sheen={0.55}
          depth={0.72}
          glow={0.22}
          dpr={isMobile ? 0.75 : 1.25}
          mouseInteraction={!isMobile}
          clickRipple={!isMobile}
          paused={!active}
        />
        <div className="denim-twill-overlay absolute inset-0" aria-hidden="true" />
      </div>

      {/* TOP-LEFT OVERLOADED COLLAGE */}
      <div
        data-speed="38"
        className="hero-corner hero-parallax pointer-events-none absolute -left-16 -top-14 z-10 h-52 w-52 select-none sm:-left-12 sm:-top-12 sm:h-72 sm:w-72 lg:h-80 lg:w-80"
      >
        <img src="/assets/stickers/vinyl-disc-blue.webp" alt="" decoding="async" className="absolute left-12 top-0 h-24 w-24 opacity-90 sm:left-24 sm:h-36 sm:w-36" />
        <img src="/assets/stickers/disco-ball-checkered.webp" alt="" decoding="async" className="disco-slow-spin absolute left-0 top-0 h-32 w-32 md:drop-shadow-[0_18px_30px_rgba(4,8,18,0.8)] sm:h-52 sm:w-52" />
        <img src="/assets/stickers/star-denim-studded.webp" alt="" decoding="async" className="absolute left-16 top-16 h-16 w-16 -rotate-12 md:drop-shadow-xl sm:left-28 sm:top-28 sm:h-24 sm:w-24" />
        <img src="/assets/stickers/bow-chrome-small.webp" alt="" decoding="async" className="absolute left-6 top-6 h-14 w-auto rotate-12 md:drop-shadow-xl sm:left-10 sm:top-8 sm:h-20" />
        <img src="/assets/stickers/star-glitter-silver.webp" alt="" decoding="async" className="absolute left-4 top-28 h-12 w-12 rotate-12 opacity-90 sm:top-44 sm:h-18 sm:w-18" />
        <img src="/assets/stickers/flower-blue.webp" alt="" decoding="async" className="hidden sm:block sm:absolute sm:left-32 sm:top-44 sm:h-20 sm:w-auto sm:-rotate-12 md:drop-shadow-xl" />
        <img src="/assets/stickers/sparkle-chrome-left.webp" alt="" decoding="async" className="hidden lg:block lg:absolute lg:left-44 lg:top-8 lg:h-24 lg:w-auto" />
      </div>

      {/* TOP-RIGHT OVERLOADED COLLAGE */}
      <div
        data-speed="44"
        className="hero-corner hero-parallax pointer-events-none absolute -right-16 -top-14 z-10 h-52 w-52 select-none sm:-right-12 sm:-top-12 sm:h-72 sm:w-72 lg:h-80 lg:w-80"
      >
        <img src="/assets/stickers/disco-ball-clean.webp" alt="" decoding="async" className="absolute right-0 top-0 h-36 w-36 md:drop-shadow-[0_18px_30px_rgba(4,8,18,0.8)] sm:h-52 sm:w-52" />
        <img src="/assets/stickers/bow-navy-satin.webp" alt="" decoding="async" className="absolute right-4 top-4 h-24 w-auto rotate-12 md:drop-shadow-2xl sm:right-8 sm:h-36" />
        <img src="/assets/stickers/bow-chrome-large.webp" alt="" decoding="async" className="absolute right-8 top-6 h-14 w-auto -rotate-6 md:drop-shadow-xl sm:right-12 sm:top-10 sm:h-22" />
        <img src="/assets/stickers/butterfly-blue.webp" alt="" decoding="async" className="absolute right-20 top-24 h-12 w-auto -rotate-12 md:drop-shadow-xl sm:right-36 sm:top-32 sm:h-18" />
        <img src="/assets/stickers/star-glitter-blue.webp" alt="" decoding="async" className="absolute right-6 top-32 h-12 w-12 rotate-12 opacity-95 sm:right-10 sm:top-44 sm:h-16 sm:w-16" />
        <img src="/assets/stickers/sparkle-chrome-right.webp" alt="" decoding="async" className="hidden sm:block sm:absolute sm:right-40 sm:top-4 sm:h-20 sm:w-auto sm:opacity-95" />
        <img src="/assets/stickers/lips-blue-glossy.webp" alt="" decoding="async" className="hidden lg:block lg:absolute lg:right-36 lg:top-20 lg:h-20 lg:w-auto lg:-rotate-12" />
      </div>

      {/* BOTTOM-LEFT OVERLOADED COLLAGE */}
      <div
        data-speed="28"
        className="hero-corner hero-parallax pointer-events-none absolute bottom-6 -left-16 z-10 h-52 w-56 select-none sm:bottom-10 sm:-left-12 sm:h-72 sm:w-80"
      >
        <img src="/assets/stickers/glitter-wave-blue.webp" alt="" decoding="async" className="absolute bottom-6 left-0 h-20 w-44 opacity-90 sm:bottom-8 sm:h-32 sm:w-64" />
        <img src="/assets/stickers/vinyl-disc-black.webp" alt="" decoding="async" className="hidden sm:block sm:absolute sm:bottom-24 sm:left-24 sm:h-28 sm:w-28 sm:opacity-85" />
        <img src="/assets/stickers/cowboy-hat-silver.webp" alt="" decoding="async" className="absolute bottom-14 left-2 h-22 w-auto -rotate-12 md:drop-shadow-2xl sm:bottom-24 sm:h-36" />
        <img src="/assets/stickers/pool-ball-2.webp" alt="" decoding="async" className="absolute bottom-24 left-18 h-10 w-10 -rotate-12 md:drop-shadow-xl sm:bottom-36 sm:left-28 sm:h-16 sm:w-16" />
        <img src="/assets/stickers/denim-smiley-patch.webp" alt="" decoding="async" className="absolute bottom-8 left-16 h-14 w-14 -rotate-12 md:drop-shadow-xl sm:bottom-10 sm:left-24 sm:h-22 sm:w-22" />
        <img src="/assets/stickers/lips-silver-1.webp" alt="" decoding="async" className="absolute bottom-2 left-28 h-10 w-auto rotate-12 opacity-90 sm:bottom-4 sm:left-40 sm:h-16" />
        <img src="/assets/stickers/heart-chrome-small.webp" alt="" decoding="async" className="hidden lg:block lg:absolute lg:bottom-28 lg:left-44 lg:h-14 lg:w-auto lg:rotate-12" />
      </div>

      {/* BOTTOM-RIGHT OVERLOADED COLLAGE */}
      <div
        data-speed="36"
        className="hero-corner hero-parallax pointer-events-none absolute bottom-6 -right-14 z-10 h-52 w-52 select-none sm:bottom-10 sm:-right-10 sm:h-72 sm:w-80"
      >
        <img src="/assets/stickers/disco-girl.webp" alt="" decoding="async" className="absolute bottom-4 right-0 h-36 w-auto md:drop-shadow-[0_18px_32px_rgba(4,8,18,0.88)] sm:bottom-6 sm:h-56" />
        <img src="/assets/stickers/martini-glass.webp" alt="" decoding="async" className="hidden sm:block sm:absolute sm:bottom-20 sm:right-32 sm:h-28 sm:w-auto sm:-rotate-12" />
        <img src="/assets/stickers/balloon-dog-chrome.webp" alt="" decoding="async" className="absolute bottom-2 right-24 h-16 w-auto -rotate-12 md:drop-shadow-xl sm:bottom-6 sm:right-36 sm:h-24" />
        <img src="/assets/stickers/flower-blue.webp" alt="" decoding="async" className="absolute bottom-28 right-4 h-12 w-auto rotate-12 sm:bottom-44 sm:right-8 sm:h-20" />
        <img src="/assets/stickers/sparkle-chrome-right.webp" alt="" decoding="async" className="hidden sm:block sm:absolute sm:bottom-36 sm:right-28 sm:h-18 sm:w-auto sm:opacity-90" />
        <img src="/assets/stickers/star-chrome-1.webp" alt="" decoding="async" className="hidden lg:block lg:absolute lg:bottom-12 lg:right-48 lg:h-16 lg:w-16 lg:rotate-12" />
      </div>

      {/* FRAMELESS CENTER FLOATING POSTER TYPOGRAPHY */}
      <div className="hero-content-wrap soft-radial-scrim relative z-20 mx-auto w-full max-w-xl px-4 py-8 text-center">
        <div className="hero-stagger">
          <span className="font-script editorial-shadow block text-4xl leading-none text-[#9ec5ff] sm:text-5xl">
            The Last
          </span>
          <ChromeWord
            word="DIAMOND"
            className="mt-1"
            letterClassName="h-10 xs:h-11 sm:h-16 md:h-[4.4rem]"
          />
        </div>

        <p className="hero-stagger editorial-shadow mt-2 text-base font-bold uppercase tracking-[0.34em] sm:text-xl">
          <ShinyText text="12 Years Later" color="#dce7f8" shineColor="#ffffff" speed={2.4} />
        </p>

        <div className="hero-stagger editorial-shadow mt-4 space-y-1">
          <p className="font-editorial text-lg italic text-[#f5d79b] sm:text-xl">
            4th Year High School Reunion, Section Diamond
          </p>
          <p className="font-editorial text-xl font-bold tracking-wide text-white sm:text-2xl">
            {EVENT_INFO.schoolFull}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bdd5f9] sm:text-sm">
            Advisory of {EVENT_INFO.adviser}
          </p>
        </div>

        {/* Split Date & Time with Single Hairline */}
        <div className="hero-stagger editorial-shadow mx-auto mt-7 grid max-w-md grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d4b483]">
              Save the Date
            </p>
            <p className="font-editorial mt-0.5 text-2xl font-bold text-white sm:text-3xl">
              Jan. 23–24
            </p>
            <p className="text-xs font-medium tracking-wider text-[#cfe1fc]">Sat–Sun, 2027</p>
          </div>

          <div className="h-14 w-px bg-white/35" aria-hidden="true" />

          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d4b483]">
              Call Time
            </p>
            <p className="font-editorial mt-0.5 text-2xl font-bold text-white sm:text-3xl">
              5:00 PM
            </p>
            <p className="text-xs font-medium tracking-wider text-[#cfe1fc]">Onwards (Overnight)</p>
          </div>
        </div>

        {/* Live Countdowns & Pill CTA */}
        <div className="hero-stagger editorial-shadow mt-8 space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#9ec5ff]">
              Countdown to Reunion Night
            </p>
            <div className="mx-auto mt-2 grid max-w-xs grid-cols-4 gap-2 text-white">
              {[
                { label: 'Days', value: eventLeft.days },
                { label: 'Hrs', value: pad2(eventLeft.hours) },
                { label: 'Min', value: pad2(eventLeft.minutes) },
                { label: 'Sec', value: pad2(eventLeft.seconds) },
              ].map((unit) => (
                <div key={unit.label}>
                  <span className="font-editorial block text-3xl font-bold leading-none tabular-nums sm:text-4xl">
                    {unit.value}
                  </span>
                  <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.24em] text-[#b9d0f5]">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-1">
            <p className="inline-flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#f5d79b]">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              Form Deadline: Dec. 04, 2026 (11:59 PM)
            </p>
            <p className="mt-1 font-mono text-xs font-bold tabular-nums tracking-[0.12em] text-white">
              {formLeft.expired
                ? 'Form Closed'
                : `${formLeft.days}d ${pad2(formLeft.hours)}h ${pad2(formLeft.minutes)}m ${pad2(formLeft.seconds)}s left`}
            </p>
            <div className="mt-4">
              <a
                href={EVENT_INFO.rsvpUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textShadow: 'none' }}
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f7e2b8] via-[#ffffff] to-[#d6e6ff] px-7 py-3.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#0c1930] shadow-[0_10px_30px_rgba(158,197,255,0.45),0_1px_0_rgba(255,255,255,0.9)_inset] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(245,215,155,0.62)] active:scale-95 sm:px-8 sm:text-sm"
              >
                Confirm Attendance via Google Forms
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Seamless Gradient Fade into Story Section */}
      <WaveTransition toColor="#f3f0e8" heightClass="h-32 sm:h-44" className="z-[15]" />
    </section>
  );
}
