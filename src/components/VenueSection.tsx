import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { BellRing, CalendarPlus, Download, MapPin } from 'lucide-react';
import WaveTransition from './WaveTransition';
import { EVENT_INFO } from '../data/reunionData';
import {
  downloadReunionIcs,
  getReunionGoogleCalendarUrl,
  getRsvpReminderGoogleCalendarUrl,
} from '../utils/calendar';
import { useScrollReveal } from '../utils/useScrollReveal';

const VenueMap = lazy(() => import('./VenueMap'));

export default function VenueSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapMountRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useScrollReveal(sectionRef);

  useEffect(() => {
    const el = mapMountRef.current;
    if (!el || shouldLoadMap) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoadMap(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '450px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoadMap]);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced || !sectionRef.current) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.utils.toArray<HTMLElement>('.venue-parallax').forEach((el, idx) => {
        gsap.to(el, {
          y: idx % 2 === 0 ? -36 : 36,
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

  return (
    <section ref={sectionRef} id="venue" className="bg-twilight-sapphire relative overflow-x-clip pt-20 sm:pt-28">
      {/* Subtle Top Feather matching Story bottom blend */}
      <WaveTransition edge="top" toColor="#081326" heightClass="h-16 sm:h-24" className="z-[5]" />

      {/* Top-Left Cluster */}
      <div className="venue-parallax pointer-events-none absolute -left-16 top-4 z-10 h-52 w-56 select-none sm:-left-10 sm:top-6 sm:h-76 sm:w-80">
        <img src="/assets/stickers/vinyl-disc-black.webp" alt="" loading="lazy" decoding="async" className="disco-slow-spin absolute left-0 top-0 h-32 w-32 opacity-90 md:drop-shadow-2xl sm:h-52 sm:w-52" />
        <img src="/assets/stickers/star-denim-studded.webp" alt="" loading="lazy" decoding="async" className="absolute left-16 top-16 h-16 w-16 -rotate-12 md:drop-shadow-xl sm:left-28 sm:top-28 sm:h-26 sm:w-26" />
        <img src="/assets/stickers/bow-navy-satin.webp" alt="" loading="lazy" decoding="async" className="absolute left-6 top-28 h-16 w-auto rotate-12 md:drop-shadow-2xl sm:left-10 sm:top-44 sm:h-24" />
        <img src="/assets/stickers/sparkle-chrome-left.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:left-44 sm:top-2 sm:h-24 sm:w-auto" />
        <img src="/assets/stickers/butterfly-blue.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:left-36 sm:top-40 sm:h-20 sm:w-auto sm:-rotate-12" />
      </div>

      {/* Top-Right Cluster */}
      <div className="venue-parallax pointer-events-none absolute -right-14 top-4 z-10 h-52 w-56 select-none sm:-right-8 sm:top-6 sm:h-76 sm:w-80">
        <img src="/assets/stickers/disco-ball-stars.webp" alt="" loading="lazy" decoding="async" className="absolute right-0 top-0 h-32 w-auto md:drop-shadow-2xl sm:h-52" />
        <img src="/assets/stickers/bow-chrome-small.webp" alt="" loading="lazy" decoding="async" className="absolute right-14 top-16 h-14 w-auto rotate-12 md:drop-shadow-xl sm:right-24 sm:top-28 sm:h-22" />
        <img src="/assets/stickers/star-glitter-blue.webp" alt="" loading="lazy" decoding="async" className="absolute right-4 top-28 h-12 w-12 -rotate-12 sm:right-8 sm:top-44 sm:h-18 sm:w-18" />
        <img src="/assets/stickers/star-glitter-silver.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:right-44 sm:top-8 sm:h-18 sm:w-18" />
        <img src="/assets/stickers/lips-blue-glossy.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:right-36 sm:top-36 sm:h-18 sm:w-auto sm:-rotate-12" />
      </div>

      {/* Bottom-Left Cluster */}
      <div className="venue-parallax pointer-events-none absolute bottom-8 -left-16 z-10 h-48 w-52 select-none sm:bottom-12 sm:-left-12 sm:h-68 sm:w-72">
        <img src="/assets/stickers/glitter-wave-blue.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-4 left-0 h-18 w-40 opacity-85 sm:h-28 sm:w-60" />
        <img src="/assets/stickers/cowboy-hat-silver.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-20 sm:left-0 sm:h-28 sm:w-auto sm:-rotate-12 md:drop-shadow-2xl" />
        <img src="/assets/stickers/pool-ball-2.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-14 left-4 h-12 w-12 -rotate-12 md:drop-shadow-xl sm:bottom-24 sm:left-20 sm:h-18 sm:w-18" />
        <img src="/assets/stickers/flower-blue.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-6 sm:left-36 sm:h-22 sm:w-auto sm:rotate-12" />
        <img src="/assets/stickers/heart-chrome-small.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-44 sm:left-24 sm:h-14 sm:w-auto sm:rotate-12" />
      </div>

      {/* Bottom-Right Cluster */}
      <div className="venue-parallax pointer-events-none absolute bottom-8 -right-16 z-10 h-48 w-52 select-none sm:bottom-12 sm:-right-12 sm:h-68 sm:w-72">
        <img src="/assets/stickers/vinyl-disc-blue.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-24 sm:right-24 sm:h-28 sm:w-28 sm:opacity-85" />
        <img src="/assets/stickers/disco-ball-checkered.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-4 right-0 h-28 w-28 opacity-90 md:drop-shadow-2xl sm:h-44 sm:w-44" />
        <img src="/assets/stickers/star-chrome-2.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-20 right-14 h-12 w-12 rotate-12 md:drop-shadow-xl sm:bottom-32 sm:right-24 sm:h-20 sm:w-20" />
        <img src="/assets/stickers/martini-glass.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-4 sm:right-36 sm:h-24 sm:w-auto sm:-rotate-12" />
        <img src="/assets/stickers/sparkle-chrome-right.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-44 sm:right-8 sm:h-18 sm:w-auto" />
      </div>

      {/* Borderless Monumental Floating Venue Typography + Lazy Native Interactive Map */}
      <div className="relative z-20 mx-auto max-w-3xl px-6 pb-36 text-center sm:px-10 sm:pb-44">
        <div className="venue-header editorial-shadow">
          <h2 className="reveal-item font-editorial text-5xl font-bold tracking-wide text-white drop-shadow-[0_4px_26px_rgba(158,197,255,0.42)] sm:text-7xl">
            {EVENT_INFO.venueName}
          </h2>

          <p
            style={{ transitionDelay: '60ms' }}
            className="reveal-item mx-auto mt-2 max-w-md text-base font-medium text-[#e0ebfc] sm:text-lg"
          >
            {EVENT_INFO.venueLandmark}
          </p>

          <div
            style={{ transitionDelay: '100ms' }}
            className="reveal-item mx-auto my-5 h-px w-28 bg-gradient-to-r from-transparent via-[#d4b483]/85 to-transparent"
          />

          <p
            style={{ transitionDelay: '130ms' }}
            className="reveal-item font-editorial text-2xl font-bold text-white sm:text-3xl"
          >
            {EVENT_INFO.dateDisplay}
          </p>
          <p
            style={{ transitionDelay: '160ms' }}
            className="reveal-item mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#9ec5ff] sm:text-sm"
          >
            {EVENT_INFO.dayTimeDisplay} ({EVENT_INFO.overnightNote})
          </p>
        </div>

        {/* Live Native Interactive Leaflet Map (lazy-loaded near viewport, ZERO editorial-shadow wrapper) */}
        <div ref={mapMountRef} className="reveal-item reveal-scale mx-auto mt-8 max-w-2xl">
          {shouldLoadMap ? (
            <Suspense
              fallback={
                <div className="h-[290px] w-full animate-pulse rounded-2xl bg-[#102344]/80 sm:h-[370px]" />
              }
            >
              <VenueMap />
            </Suspense>
          ) : (
            <div className="h-[290px] w-full rounded-2xl bg-[#102344]/80 sm:h-[370px]" />
          )}
          <p className="mt-2.5 text-[11px] tracking-wide text-[#adc6eb]">
            249 Nagcarlan-Rizal Rd, Brgy. West, Rizal, Laguna 4003 (right in front of Rizal Elementary School). Tap Satellite or drag to explore.
          </p>
        </div>

        {/* Borderless Luminous Action Links */}
        <div className="reveal-item editorial-shadow mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 px-2 text-xs font-bold uppercase tracking-[0.16em] sm:px-6 sm:text-sm">
          <a
            href={EVENT_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="luminous-link"
          >
            <MapPin className="h-4 w-4" />
            Directions (Google Maps)
          </a>

          <a
            href={getReunionGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="luminous-link"
          >
            <CalendarPlus className="h-4 w-4" />
            Google Calendar
          </a>

          <button
            type="button"
            onClick={downloadReunionIcs}
            className="luminous-link cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Apple / .ICS
          </button>

          <a
            href={getRsvpReminderGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="luminous-link"
          >
            <BellRing className="h-4 w-4" />
            Remind Dec 4 Deadline
          </a>
        </div>
      </div>

      {/* Gradient Blend into Washed Chambray Dress Code */}
      <WaveTransition toColor="#203d6d" heightClass="h-32 sm:h-44" className="z-[15]" />
    </section>
  );
}
