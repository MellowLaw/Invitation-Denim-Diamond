import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import WaveTransition from './WaveTransition';
import { DRESS_SWATCHES, EVENT_INFO, LOOKBOOK_SLIDES } from '../data/reunionData';

const WOMEN_CUTOUTS = LOOKBOOK_SLIDES.filter((s) => s.id.startsWith('woman-'));

export default function DressCodeSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.dress-reveal', {
        y: 28,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,filter',
        scrollTrigger: {
          trigger: '.dress-header',
          start: 'top 78%',
          once: true,
        },
      });

      gsap.from('.dress-swatch', {
        y: 22,
        scale: 0.82,
        opacity: 0,
        duration: 0.72,
        stagger: 0.09,
        ease: 'back.out(1.5)',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: '.dress-swatches-grid',
          start: 'top 84%',
          once: true,
        },
      });

      gsap.from('.dress-lady', {
        y: 34,
        scale: 0.94,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: '.dress-ladies-grid',
          start: 'top 82%',
          once: true,
        },
      });

      gsap.from('.dress-squad', {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: '.dress-squad-grid',
          start: 'top 84%',
          once: true,
        },
      });

      gsap.utils.toArray<HTMLElement>('.dress-parallax').forEach((el, idx) => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="dress-code" className="bg-washed-chambray relative overflow-x-clip pt-20 sm:pt-28">
      <div className="denim-twill-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
      <WaveTransition edge="top" toColor="#203d6d" blur={false} heightClass="h-16 sm:h-24" className="z-[5]" />

      {/* TOP-LEFT OVERLOADED COLLAGE */}
      <div className="dress-parallax pointer-events-none absolute -left-14 top-4 z-10 h-52 w-56 select-none sm:-left-8 sm:top-6 sm:h-80 sm:w-80">
        <img src="/assets/stickers/vinyl-disc-black.png" alt="" className="hidden sm:block sm:absolute sm:left-24 sm:top-4 sm:h-32 sm:w-32 sm:opacity-85" />
        <img src="/assets/stickers/disco-ball-clean.png" alt="" className="absolute left-0 top-0 h-32 w-32 drop-shadow-2xl sm:h-56 sm:w-56" />
        <img src="/assets/stickers/star-denim-frayed.png" alt="" className="absolute left-20 top-14 h-14 w-14 -rotate-12 drop-shadow-xl sm:left-36 sm:top-28 sm:h-24 sm:w-24" />
        <img src="/assets/stickers/cowboy-hat-silver.png" alt="" className="hidden sm:block sm:absolute sm:left-2 sm:top-38 sm:h-32 sm:w-auto sm:-rotate-12" />
        <img src="/assets/stickers/star-glitter-silver.png" alt="" className="absolute left-4 top-28 h-12 w-12 rotate-12 sm:left-32 sm:top-52 sm:h-16 sm:w-16" />
      </div>

      {/* TOP-RIGHT OVERLOADED COLLAGE */}
      <div className="dress-parallax pointer-events-none absolute -right-14 top-4 z-10 h-52 w-56 select-none sm:-right-8 sm:top-6 sm:h-80 sm:w-80">
        <img src="/assets/stickers/bow-chrome-large.png" alt="" className="absolute right-2 top-4 h-20 w-auto rotate-12 drop-shadow-2xl sm:right-6 sm:h-36" />
        <img src="/assets/stickers/butterfly-blue.png" alt="" className="absolute right-16 top-16 h-14 w-auto -rotate-12 drop-shadow-xl sm:right-32 sm:top-32 sm:h-24" />
        <img src="/assets/stickers/martini-glass.png" alt="" className="hidden sm:block sm:absolute sm:right-40 sm:top-6 sm:h-24 sm:w-auto sm:-rotate-12 sm:drop-shadow-xl" />
        <img src="/assets/stickers/sparkle-chrome-right.png" alt="" className="absolute right-4 top-24 h-14 w-auto opacity-95 sm:top-44 sm:h-24" />
        <img src="/assets/stickers/lips-silver-1.png" alt="" className="hidden sm:block sm:absolute sm:right-28 sm:top-48 sm:h-16 sm:w-auto sm:rotate-12" />
      </div>

      {/* BOTTOM-LEFT OVERLOADED COLLAGE */}
      <div className="dress-parallax pointer-events-none absolute bottom-10 -left-12 z-10 h-52 w-56 select-none sm:bottom-14 sm:-left-6 sm:h-76 sm:w-80">
        <img src="/assets/stickers/bow-navy-satin.png" alt="" className="hidden sm:block sm:absolute sm:bottom-28 sm:left-4 sm:h-24 sm:w-auto sm:-rotate-12" />
        <img src="/assets/stickers/lips-blue-glossy.png" alt="" className="absolute bottom-4 left-2 h-14 w-auto -rotate-12 drop-shadow-2xl sm:bottom-14 sm:left-8 sm:h-24" />
        <img src="/assets/stickers/heart-chrome-small.png" alt="" className="absolute bottom-14 left-16 h-10 w-auto rotate-12 sm:bottom-36 sm:left-36 sm:h-16" />
        <img src="/assets/stickers/star-glitter-blue.png" alt="" className="absolute bottom-0 left-24 h-12 w-12 rotate-6 sm:left-44 sm:h-20 sm:w-20" />
        <img src="/assets/stickers/pool-ball-2.png" alt="" className="hidden sm:block sm:absolute sm:bottom-20 sm:left-44 sm:h-14 sm:w-14 sm:-rotate-12" />
      </div>

      {/* BOTTOM-RIGHT OVERLOADED COLLAGE */}
      <div className="dress-parallax pointer-events-none absolute bottom-10 -right-12 z-10 h-52 w-56 select-none sm:bottom-14 sm:-right-6 sm:h-76 sm:w-80">
        <img src="/assets/stickers/disco-ball-stars.png" alt="" className="absolute bottom-0 right-0 h-28 w-auto opacity-95 drop-shadow-2xl sm:h-52" />
        <img src="/assets/stickers/denim-smiley-patch.png" alt="" className="absolute bottom-2 right-20 h-14 w-14 -rotate-12 drop-shadow-xl sm:right-40 sm:h-24 sm:w-24" />
        <img src="/assets/stickers/flower-blue.png" alt="" className="hidden sm:block sm:absolute sm:bottom-36 sm:right-6 sm:h-20 sm:w-auto sm:rotate-12" />
        <img src="/assets/stickers/star-chrome-1.png" alt="" className="hidden sm:block sm:absolute sm:bottom-32 sm:right-32 sm:h-16 sm:w-16 sm:-rotate-12" />
      </div>

      <div className="relative z-20 px-4 pb-32 sm:px-8 sm:pb-40">
        {/* FRAMELESS DRESS CODE HEADER */}
        <div className="dress-header soft-radial-scrim editorial-shadow mx-auto max-w-2xl text-center">
          <img
            src="/assets/badges/badge-denim-and-diamonds.png"
            alt="Denim and Diamonds"
            className="dress-reveal mx-auto max-h-24 w-auto object-contain drop-shadow-[0_12px_24px_rgba(4,9,20,0.85)] sm:max-h-32"
          />

          <p className="dress-reveal mt-2 text-lg font-extrabold uppercase tracking-[0.26em] text-white sm:text-xl">
            {EVENT_INFO.theme}
          </p>
          <p className="dress-reveal font-script mt-1 text-3xl text-[#d7e8ff] sm:text-4xl">
            Shine Bright, Dress Right
          </p>

          {/* Pure Floating Color Swatch Circles */}
          <div className="dress-swatches-grid mx-auto mt-7 grid max-w-2xl grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-4">
            {DRESS_SWATCHES.map((swatch) => (
              <div key={swatch.id} className="dress-swatch flex flex-col items-center text-center">
                <span
                  className="h-11 w-11 rounded-full shadow-[0_0_22px_rgba(158,197,255,0.42)] ring-2 ring-white/45 ring-offset-2 ring-offset-[#203d6d]"
                  style={{ backgroundColor: swatch.hex }}
                  aria-hidden="true"
                />
                <span className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-white">
                  {swatch.name}
                </span>
                <span className="mt-0.5 text-[11px] leading-snug text-[#dce9fc]">
                  {swatch.tip}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* COMPACT ALL-VISIBLE BOYS & GIRLS OUTFITS */}
        <div className="mx-auto mt-14 max-w-5xl">
          <div className="text-center">
            <p className="dress-reveal font-script editorial-shadow text-3xl text-[#f5d79b] sm:text-4xl">
              For the Ladies
            </p>
          </div>

          <div className="dress-ladies-grid mt-6 grid grid-cols-3 items-end gap-1.5 sm:grid-cols-6 sm:gap-3">
            {WOMEN_CUTOUTS.map((slide, idx) => (
              <figure key={slide.id} className="dress-lady flex flex-col items-center text-center">
                <img
                  src={slide.src}
                  alt={slide.title}
                  loading="lazy"
                  className={`h-44 w-auto object-contain drop-shadow-[0_18px_28px_rgba(4,8,18,0.9)] transition-transform duration-300 hover:scale-105 sm:h-64 ${
                    idx % 2 === 0 ? '-rotate-1' : 'rotate-1'
                  }`}
                />
                <figcaption className="editorial-shadow mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:text-[11px]">
                  {slide.tag}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="dress-reveal font-script editorial-shadow text-3xl text-[#d7e8ff] sm:text-4xl">
              For the Gents &amp; Full Squad Inspo
            </p>
          </div>

          <div className="dress-squad-grid mt-6 grid grid-cols-1 items-center gap-8 sm:grid-cols-3 sm:gap-6">
            <figure className="dress-squad flex flex-col items-center text-center">
              <img
                src="/assets/lookbook/lookbook-men-trio.png"
                alt="Gents Sparkling Denim Street Styles"
                loading="lazy"
                className="h-64 w-auto object-contain drop-shadow-[0_20px_34px_rgba(4,8,18,0.92)] sm:h-80"
              />
              <figcaption className="editorial-shadow mt-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                Gents Sparkling Denim
              </figcaption>
            </figure>

            <figure className="dress-squad flex flex-col items-center text-center">
              <img
                src="/assets/lookbook/lookbook-women-trio.png"
                alt="Squad Chainmail & Crystal Denim Sets"
                loading="lazy"
                className="h-64 w-auto object-contain drop-shadow-[0_20px_34px_rgba(4,8,18,0.92)] sm:h-80"
              />
              <figcaption className="editorial-shadow mt-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                Squad Glam Sets
              </figcaption>
            </figure>

            <figure className="dress-squad flex flex-col items-center text-center">
              <img
                src="/assets/lookbook/lookbook-moodboard.jpg"
                alt="Denim & Diamonds Style Moodboard"
                loading="lazy"
                className="h-68 w-auto rotate-2 rounded-sm object-contain opacity-95 drop-shadow-[0_22px_36px_rgba(4,8,18,0.92)] sm:h-80"
              />
              <figcaption className="editorial-shadow mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#f5d79b]">
                Full Aesthetic Moodboard
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* Gradient Blur Blend into Airy Ice-Paper Program Timeline */}
      <WaveTransition toColor="#eef2f9" heightClass="h-32 sm:h-44" className="z-[15]" />
    </section>
  );
}
