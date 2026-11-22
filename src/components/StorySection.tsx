import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import CurvedLoop from './reactbits/CurvedLoop';
import WaveTransition from './WaveTransition';
import { EVENT_INFO } from '../data/reunionData';
import { useScrollReveal } from '../utils/useScrollReveal';

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced || !sectionRef.current) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.utils.toArray<HTMLElement>('.story-parallax').forEach((el, idx) => {
        gsap.to(el, {
          y: idx % 2 === 0 ? -34 : 34,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.15,
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="story" className="bg-ivory-watercolor relative overflow-x-clip pt-10 text-[#10203b] sm:pt-16">
      {/* Subtle Top Feather matching Hero bottom fade */}
      <WaveTransition edge="top" toColor="#f3f0e8" heightClass="h-14 sm:h-20" className="z-[5]" />

      {/* Flowing Curved Navy Ribbon Marquee */}
      <div className="relative z-20 -mx-2 select-none overflow-hidden py-2">
        <CurvedLoop
          marqueeText="THE LAST DIAMOND • 12 YEARS LATER • PINHS • MA'AM TERESA SUAZO • SPARKLING DENIM"
          speed={1.35}
          curveAmount={95}
          shape="wave"
          fontSize={38}
          fontWeight={700}
          color="#162b4f"
          edgeFade={0.14}
          scrollBoost={0.7}
          wrapperClassName="w-full py-2 flex items-center justify-center"
          className="font-editorial tracking-wide"
        />
      </div>

      {/* Overloaded Right-Edge & Bottom-Left Asset Cascade */}
      <div className="relative mx-auto max-w-5xl px-6 pb-36 pt-12 sm:px-16 sm:pb-44 sm:pt-16">
        {/* Top-Left Accent Cluster */}
        <div className="story-parallax pointer-events-none absolute -left-14 top-0 z-10 h-52 w-52 select-none sm:-left-10 sm:h-72 sm:w-72">
          <img src="/assets/stickers/vinyl-disc-blue.webp" alt="" loading="lazy" decoding="async" className="absolute left-16 top-2 h-24 w-24 opacity-90 sm:left-28 sm:h-36 sm:w-36" />
          <img src="/assets/stickers/disco-ball-checkered.webp" alt="" loading="lazy" decoding="async" className="absolute left-0 top-0 h-30 w-30 opacity-95 md:drop-shadow-2xl sm:h-48 sm:w-48" />
          <img src="/assets/stickers/bow-navy-satin.webp" alt="" loading="lazy" decoding="async" className="absolute left-14 top-14 h-14 w-auto -rotate-12 sm:left-24 sm:top-24 sm:h-24" />
          <img src="/assets/stickers/star-denim-studded.webp" alt="" loading="lazy" decoding="async" className="absolute left-4 top-28 h-12 w-12 rotate-12 md:drop-shadow-xl sm:left-8 sm:top-44 sm:h-20 sm:w-20" />
          <img src="/assets/stickers/sparkle-chrome-left.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:left-40 sm:top-32 sm:h-20 sm:w-auto sm:opacity-90" />
        </div>

        {/* Right-Edge Cascading Cluster */}
        <div className="story-parallax pointer-events-none absolute -right-14 top-0 z-10 h-full w-48 select-none sm:-right-8 sm:w-72">
          <img src="/assets/stickers/disco-ball-clean.webp" alt="" loading="lazy" decoding="async" className="absolute right-0 top-0 h-32 w-32 md:drop-shadow-2xl sm:h-52 sm:w-52" />
          <img src="/assets/stickers/bow-navy-satin.webp" alt="" loading="lazy" decoding="async" className="absolute right-4 top-2 h-20 w-auto rotate-12 sm:right-6 sm:h-32" />
          <img src="/assets/stickers/bow-chrome-large.webp" alt="" loading="lazy" decoding="async" className="absolute right-6 top-6 h-12 w-auto -rotate-6 sm:right-10 sm:h-22" />
          <img src="/assets/stickers/butterfly-blue.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:right-36 sm:top-36 sm:h-22 sm:w-auto sm:-rotate-12" />
          <img src="/assets/stickers/martini-glass.webp" alt="" loading="lazy" decoding="async" className="hidden md:block md:absolute md:right-28 md:top-56 md:h-24 md:w-auto md:-rotate-12 md:drop-shadow-xl" />
          <img src="/assets/stickers/flower-blue.webp" alt="" loading="lazy" decoding="async" className="hidden md:block md:absolute md:right-4 md:top-60 md:h-22 md:w-auto" />
          <img src="/assets/stickers/star-glitter-silver.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:right-14 sm:bottom-32 sm:h-16 sm:w-16 sm:rotate-12" />
          <img src="/assets/stickers/lips-blue-glossy.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-8 right-2 h-14 w-auto -rotate-6 md:drop-shadow-xl sm:bottom-14 sm:right-6 sm:h-22" />
          <img src="/assets/stickers/lips-silver-2.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-24 sm:right-28 sm:h-14 sm:w-auto sm:rotate-12 sm:opacity-90" />
        </div>

        {/* Bottom-Left Cascading Cluster */}
        <div className="story-parallax pointer-events-none absolute bottom-10 -left-14 z-10 h-48 w-56 select-none sm:bottom-14 sm:-left-10 sm:h-68 sm:w-80">
          <img src="/assets/stickers/disco-ball-stars.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-0 left-0 h-30 w-30 md:drop-shadow-2xl sm:h-48 sm:w-48" />
          <img src="/assets/stickers/butterfly-blue.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-4 left-20 h-12 w-auto rotate-12 sm:left-32 sm:h-20" />
          <img src="/assets/stickers/pool-ball-2.webp" alt="" loading="lazy" decoding="async" className="absolute bottom-24 left-12 h-10 w-10 -rotate-12 md:drop-shadow-xl sm:bottom-36 sm:left-16 sm:h-14 sm:w-14" />
          <img src="/assets/stickers/heart-chrome-small.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-32 sm:left-36 sm:h-14 sm:w-auto sm:-rotate-12" />
          <img src="/assets/stickers/bow-chrome.webp" alt="" loading="lazy" decoding="async" className="hidden sm:block sm:absolute sm:bottom-10 sm:left-44 sm:h-16 sm:w-auto sm:rotate-6" />
        </div>

        {/* Borderless Editorial Dedication Typography */}
        <div className="story-content editorial-shadow-light relative z-20 mx-auto max-w-lg px-4 py-6 text-center">
          <h2 className="reveal-item font-editorial text-4xl font-bold text-[#0e1f3d] sm:text-5xl">
            Honoring the Final Diamond Class
          </h2>
          <p
            style={{ transitionDelay: '70ms' }}
            className="reveal-item mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#1f3559] sm:text-base"
          >
            Twelve years after walking out of the halls of{' '}
            <strong className="font-bold text-[#0e1f3d]">{EVENT_INFO.schoolFull}</strong> as the{' '}
            <span className="italic text-[#274b85]">last Section Diamond</span> under the beloved guidance of{' '}
            <strong className="font-bold text-[#0e1f3d]">{EVENT_INFO.adviser}</strong>, we are gathering back under one roof for an unforgettable overnight reunion.
          </p>
          <p
            style={{ transitionDelay: '130ms' }}
            className="reveal-item font-script mt-5 text-3xl text-[#244985] sm:text-4xl"
          >
            Bring your shining, shimmering self
          </p>
        </div>
      </div>

      {/* Gradient Blend into Midnight Twilight Venue */}
      <WaveTransition toColor="#081326" heightClass="h-32 sm:h-44" className="z-[15]" />
    </section>
  );
}
