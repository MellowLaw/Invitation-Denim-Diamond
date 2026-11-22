import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WaveTransition from './WaveTransition';
import { EVENT_INFO, PROGRAM_FLOW } from '../data/reunionData';

interface ProgramSectionProps {
  active?: boolean;
}

interface BranchGeo {
  d: string;
  color: string;
  endX: number;
  endY: number;
  dotColor: string;
}

interface SvgGeo {
  width: number;
  height: number;
  spineD: string;
  branches: BranchGeo[];
}

const DOT_PALETTE = [
  {
    dotBg: '#2563eb',
    dotGlow: 'rgba(37, 99, 235, 0.45)',
    branch: 'rgba(37, 99, 235, 0.68)',
    time: '#1d4ed8',
  },
  {
    dotBg: '#4f46e5',
    dotGlow: 'rgba(79, 70, 229, 0.45)',
    branch: 'rgba(79, 70, 229, 0.65)',
    time: '#3730a3',
  },
  {
    dotBg: '#c98a23',
    dotGlow: 'rgba(201, 138, 35, 0.48)',
    branch: 'rgba(201, 138, 35, 0.72)',
    time: '#9a6412',
  },
  {
    dotBg: '#0284c7',
    dotGlow: 'rgba(2, 132, 199, 0.45)',
    branch: 'rgba(2, 132, 199, 0.65)',
    time: '#0369a1',
  },
];

export default function ProgramSection({ active = true }: ProgramSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const maskPathRef = useRef<SVGPathElement>(null);
  const [svgGeo, setSvgGeo] = useState<SvgGeo>({
    width: 0,
    height: 0,
    spineD: '',
    branches: [],
  });

  const measureCurves = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const wrapRect = wrap.getBoundingClientRect();
    if (wrapRect.width < 10 || wrapRect.height < 10) return;

    const isDesktop = window.innerWidth >= 768;
    const points: { x: number; y: number }[] = [];
    const branches: BranchGeo[] = [];

    for (let idx = 0; idx < PROGRAM_FLOW.length; idx++) {
      const dotNodes = wrap.querySelectorAll<HTMLElement>(`[data-timeline-dot="${idx}"]`);
      let dotEl: HTMLElement | null = null;
      dotNodes.forEach((node) => {
        const r = node.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          dotEl = node;
        }
      });

      const anchorEl = wrap.querySelector<HTMLElement>(`[data-timeline-anchor="${idx}"]`);
      if (!dotEl || !anchorEl) continue;

      const dotRect = (dotEl as HTMLElement).getBoundingClientRect();
      const anchorRect = anchorEl.getBoundingClientRect();

      const dotX = dotRect.left - wrapRect.left + dotRect.width / 2;
      const dotY = dotRect.top - wrapRect.top + dotRect.height / 2;
      points.push({ x: dotX, y: dotY });

      const isLeft = idx % 2 === 0;
      const accent = DOT_PALETTE[idx % DOT_PALETTE.length];
      const targetX = isDesktop
        ? isLeft
          ? anchorRect.right - wrapRect.left + 10
          : anchorRect.left - wrapRect.left - 10
        : anchorRect.left - wrapRect.left - 10;
      const targetY = anchorRect.top - wrapRect.top + anchorRect.height / 2;

      const midX = (dotX + targetX) / 2;
      const ctrlY = (dotY + targetY) / 2 - 9;

      branches.push({
        d: `M ${dotX.toFixed(1)},${dotY.toFixed(1)} Q ${midX.toFixed(1)},${ctrlY.toFixed(1)} ${targetX.toFixed(1)},${targetY.toFixed(1)}`,
        color: accent.branch,
        endX: Number(targetX.toFixed(1)),
        endY: Number(targetY.toFixed(1)),
        dotColor: accent.dotBg,
      });
    }

    if (points.length === 0) return;

    const first = points[0];
    const leadSway = isDesktop ? 14 : 6;
    let spineD = `M ${(first.x + leadSway).toFixed(1)},${(first.y - 34).toFixed(1)} Q ${(first.x + leadSway * 0.4).toFixed(1)},${(first.y - 16).toFixed(1)} ${first.x.toFixed(1)},${first.y.toFixed(1)}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dy = p2.y - p1.y;
      const sway = isDesktop ? (i % 2 === 0 ? -12 : 12) : i % 2 === 0 ? -5 : 5;
      spineD += ` C ${(p1.x + sway).toFixed(1)},${(p1.y + dy * 0.48).toFixed(1)} ${(p2.x - sway).toFixed(1)},${(p2.y - dy * 0.48).toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }

    const last = points[points.length - 1];
    const endSway = isDesktop ? (points.length % 2 === 0 ? 14 : -14) : 6;
    spineD += ` Q ${(last.x + endSway * 0.4).toFixed(1)},${(last.y + 18).toFixed(1)} ${(last.x + endSway).toFixed(1)},${(last.y + 34).toFixed(1)}`;

    setSvgGeo({
      width: Math.round(wrapRect.width),
      height: Math.round(wrapRect.height),
      spineD,
      branches,
    });
  }, []);

  useLayoutEffect(() => {
    measureCurves();
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver(() => {
      measureCurves();
    });
    ro.observe(wrap);

    const onResize = () => measureCurves();
    window.addEventListener('resize', onResize);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) {
        measureCurves();
        ScrollTrigger.refresh();
      }
    });

    const raf = window.requestAnimationFrame(() => measureCurves());

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [measureCurves, active]);

  // Animate the curved dashed S-curve progress mask on scroll
  useEffect(() => {
    const pathEl = maskPathRef.current;
    const wrapEl = wrapRef.current;
    if (!pathEl || !wrapEl || !svgGeo.spineD) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced) {
      gsap.set(pathEl, { strokeDasharray: 'none', strokeDashoffset: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const len = pathEl.getTotalLength();
      gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(pathEl, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapEl,
          start: 'top 76%',
          end: 'bottom 80%',
          scrub: 0.75,
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, [svgGeo.spineD]);

  // Entrance animations for header, connected timeline entries, dots, stickers, and corner parallax
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.program-header-reveal', {
        y: 28,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,filter',
        scrollTrigger: {
          trigger: '.program-header',
          start: 'top 80%',
          once: true,
        },
      });

      gsap.utils.toArray<HTMLElement>('.program-row').forEach((row, idx) => {
        const isLeft = idx % 2 === 0;
        const entries = row.querySelectorAll('.program-entry');
        const dots = row.querySelectorAll('.program-dot-visual');
        const sticker = row.querySelector('.program-sticker-desktop');

        if (dots.length > 0) {
          gsap.from(dots, {
            scale: 0.25,
            opacity: 0,
            duration: 0.55,
            ease: 'back.out(2)',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: row,
              start: 'top 86%',
              once: true,
            },
          });
        }

        if (entries.length > 0) {
          gsap.from(entries, {
            x: isLeft ? -26 : 26,
            y: 18,
            opacity: 0,
            filter: 'blur(5px)',
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'transform,filter',
            scrollTrigger: {
              trigger: row,
              start: 'top 86%',
              once: true,
            },
          });
        }

        if (sticker) {
          gsap.from(sticker, {
            scale: 0.85,
            opacity: 0,
            duration: 0.78,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: row,
              start: 'top 86%',
              once: true,
            },
          });
        }
      });

      gsap.utils.toArray<HTMLElement>('.program-parallax').forEach((el, idx) => {
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
    <section ref={sectionRef} id="program" className="bg-ice-cloud-paper relative overflow-x-clip pt-32 text-[#0e1f3d] sm:pt-32">
      {/* Subtle Top Feather matching DressCode bottom blend */}
      <WaveTransition edge="top" toColor="#eef2f9" blur={false} heightClass="h-16 sm:h-24" className="z-[5]" />

      {/* TOP-LEFT OVERLOADED COLLAGE */}
      <div className="program-parallax pointer-events-none absolute -left-14 top-4 z-10 h-52 w-56 select-none sm:-left-10 sm:top-6 sm:h-80 sm:w-80">
        <img src="/assets/stickers/disco-ball-checkered.png" alt="" className="absolute left-0 top-0 h-28 w-28 opacity-95 drop-shadow-2xl sm:h-52 sm:w-52" />
        <img src="/assets/stickers/bow-chrome.png" alt="" className="absolute left-14 top-14 h-12 w-auto -rotate-12 drop-shadow-xl sm:left-32 sm:top-32 sm:h-24" />
        <img src="/assets/stickers/star-denim-studded.png" alt="" className="absolute left-4 top-28 h-12 w-12 rotate-12 drop-shadow-xl sm:left-8 sm:top-48 sm:h-20 sm:w-20" />
        <img src="/assets/stickers/sparkle-chrome-left.png" alt="" className="hidden sm:block sm:absolute sm:left-40 sm:top-10 sm:h-20 sm:w-auto sm:opacity-90" />
      </div>

      {/* TOP-RIGHT OVERLOADED COLLAGE */}
      <div className="program-parallax pointer-events-none absolute -right-14 top-4 z-10 h-52 w-56 select-none sm:-right-8 sm:top-6 sm:h-80 sm:w-80">
        <img src="/assets/stickers/vinyl-disc-blue.png" alt="" className="disco-slow-spin absolute right-0 top-0 h-28 w-28 opacity-95 drop-shadow-2xl sm:h-48 sm:w-48" />
        <img src="/assets/stickers/star-glitter-silver.png" alt="" className="absolute right-14 top-12 h-12 w-12 rotate-12 sm:right-32 sm:top-28 sm:h-22 sm:w-22" />
        <img src="/assets/stickers/butterfly-blue.png" alt="" className="hidden sm:block sm:absolute sm:right-36 sm:top-4 sm:h-20 sm:w-auto sm:-rotate-12" />
        <img src="/assets/stickers/flower-blue.png" alt="" className="hidden sm:block sm:absolute sm:right-6 sm:top-40 sm:h-20 sm:w-auto sm:rotate-12" />
      </div>

      {/* BOTTOM-LEFT OVERLOADED COLLAGE (left-anchored cowboy hat) */}
      <div className="program-parallax pointer-events-none absolute bottom-10 -left-14 z-10 h-48 w-52 select-none sm:bottom-14 sm:-left-10 sm:h-72 sm:w-76">
        <img src="/assets/stickers/cowboy-hat-silver.png" alt="" className="absolute bottom-6 left-0 h-22 w-auto -rotate-12 drop-shadow-2xl sm:bottom-10 sm:h-36" />
        <img src="/assets/stickers/lips-blue-glossy.png" alt="" className="absolute bottom-2 left-16 h-12 w-auto rotate-6 drop-shadow-xl sm:bottom-4 sm:left-28 sm:h-20" />
        <img src="/assets/stickers/star-glitter-blue.png" alt="" className="absolute bottom-24 left-12 h-12 w-12 rotate-12 sm:bottom-36 sm:left-24 sm:h-16 sm:w-16" />
        <img src="/assets/stickers/heart-chrome-small.png" alt="" className="hidden sm:block sm:absolute sm:bottom-20 sm:left-40 sm:h-14 sm:w-auto sm:-rotate-12" />
      </div>

      {/* BOTTOM-RIGHT OVERLOADED COLLAGE */}
      <div className="program-parallax pointer-events-none absolute bottom-10 -right-14 z-10 h-48 w-52 select-none sm:bottom-14 sm:-right-8 sm:h-72 sm:w-76">
        <img src="/assets/stickers/disco-ball-stars.png" alt="" className="absolute bottom-0 right-0 h-28 w-auto drop-shadow-2xl sm:h-48" />
        <img src="/assets/stickers/bow-navy-satin.png" alt="" className="hidden sm:block sm:absolute sm:bottom-28 sm:right-6 sm:h-24 sm:w-auto sm:rotate-12" />
        <img src="/assets/stickers/martini-glass.png" alt="" className="hidden sm:block sm:absolute sm:bottom-10 sm:right-36 sm:h-24 sm:w-auto sm:-rotate-12 sm:drop-shadow-xl" />
        <img src="/assets/stickers/lips-silver-1.png" alt="" className="absolute bottom-2 right-20 h-10 w-auto -rotate-12 opacity-90 sm:bottom-4 sm:right-40 sm:h-14" />
      </div>

      <div className="px-4 pb-36 sm:px-8 sm:pb-44">
        <div className="program-header editorial-shadow-light relative z-20 mb-14 pt-2 text-center">
          <h2 className="program-header-reveal font-editorial text-4xl font-bold text-[#0e1f3d] sm:text-6xl">
            Program Timeline
          </h2>
          <p className="program-header-reveal font-script mt-1 text-3xl text-[#264b8a] sm:text-4xl">
            From Sunset to Sunrise
          </p>
        </div>

        {/* Connected Curved Dashed S-Curve Timeline with Colored Diamond Nodes */}
        <div ref={wrapRef} className="program-spine-wrap relative mx-auto max-w-4xl">
          {svgGeo.width > 0 && svgGeo.height > 0 && svgGeo.spineD && (
            <svg
              width={svgGeo.width}
              height={svgGeo.height}
              viewBox={`0 0 ${svgGeo.width} ${svgGeo.height}`}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[5] overflow-visible"
            >
              <defs>
                <linearGradient id="program-curve-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="28%" stopColor="#4f46e5" />
                  <stop offset="56%" stopColor="#c98a23" />
                  <stop offset="82%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <mask
                  id="program-curve-mask"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width={svgGeo.width}
                  height={svgGeo.height}
                >
                  <path
                    ref={maskPathRef}
                    d={svgGeo.spineD}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={14}
                    strokeLinecap="round"
                  />
                </mask>
              </defs>

              {/* Base subtle curved dashed track */}
              <path
                d={svgGeo.spineD}
                fill="none"
                stroke="rgba(22, 43, 79, 0.22)"
                strokeWidth={2.2}
                strokeDasharray="7 7"
                strokeLinecap="round"
              />

              {/* Scroll-revealed colored curved dashed spine */}
              <path
                d={svgGeo.spineD}
                fill="none"
                stroke="url(#program-curve-grad)"
                strokeWidth={3}
                strokeDasharray="7 7"
                strokeLinecap="round"
                mask="url(#program-curve-mask)"
              />

              {/* Curved dashed branches plugging directly into each BIG timestamp */}
              {svgGeo.branches.map((branch, idx) => (
                <g key={idx}>
                  <path
                    className="program-branch"
                    d={branch.d}
                    fill="none"
                    stroke={branch.color}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    strokeLinecap="round"
                  />
                  <circle cx={branch.endX} cy={branch.endY} r={2.8} fill={branch.dotColor} />
                </g>
              ))}
            </svg>
          )}

          <div className="space-y-10 sm:space-y-14">
            {PROGRAM_FLOW.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              const accent = DOT_PALETTE[idx % DOT_PALETTE.length];

              return (
                <div
                  key={item.id}
                  className="program-row relative grid grid-cols-1 md:grid-cols-[1fr_132px_1fr] md:items-start"
                >
                  {/* Mobile Colored Diamond Dot (swayed left/right on rail; outer box un-transformed for SVG measurement) */}
                  <span
                    data-timeline-dot={idx}
                    aria-hidden="true"
                    className={`absolute top-[11px] z-10 h-3.5 w-3.5 md:hidden ${
                      isLeft ? 'left-[10px]' : 'left-[22px]'
                    }`}
                  >
                    <span
                      className="program-dot-visual block h-full w-full rotate-45 ring-2 ring-[#eef2f9]"
                      style={{
                        backgroundColor: accent.dotBg,
                        boxShadow: `0 0 12px ${accent.dotGlow}`,
                      }}
                    />
                  </span>

                  {/* Desktop Center Colored Diamond Marker (alternating ±28px S-wave placement) */}
                  <div
                    aria-hidden="true"
                    className="hidden md:relative md:col-start-2 md:row-start-1 md:flex md:justify-center"
                  >
                    <span
                      data-timeline-dot={idx}
                      className={`relative z-10 mt-[14px] h-4 w-4 ${
                        isLeft ? '-translate-x-7' : 'translate-x-7'
                      }`}
                    >
                      <span
                        className="program-dot-visual block h-full w-full rotate-45 ring-[3px] ring-[#eef2f9]"
                        style={{
                          backgroundColor: accent.dotBg,
                          boxShadow: `0 0 14px ${accent.dotGlow}`,
                        }}
                      />
                    </span>
                  </div>

                  {/* Borderless Floating Text Entry Connected to Curved Branch */}
                  <article
                    className={`editorial-shadow-light relative z-20 pl-16 pr-14 md:row-start-1 md:pl-0 md:pr-0 ${
                      isLeft
                        ? 'md:col-start-1 md:pr-2 md:text-right'
                        : 'md:col-start-3 md:pl-2 md:text-left'
                    }`}
                  >
                    {/* Mobile Corner Sticker on Right Edge */}
                    <img
                      src={item.sticker}
                      alt=""
                      loading="lazy"
                      className="pointer-events-none absolute -right-1 top-0 h-12 w-auto select-none opacity-95 drop-shadow-[0_10px_18px_rgba(14,31,61,0.32)] md:hidden"
                    />

                    {/* Prominent BIG Time Text wrapped around fixed layout anchor */}
                    <p
                      className="font-editorial text-[22px] font-bold leading-tight tracking-tight tabular-nums sm:text-3xl"
                      style={{ color: accent.time }}
                    >
                      <span data-timeline-anchor={idx} className="inline-block">
                        <span className="program-entry inline-block">{item.time}</span>
                      </span>
                    </p>

                    <div className="program-entry">
                      <h3 className="font-editorial mt-1 text-xl font-bold leading-snug text-[#0e1f3d] sm:text-2xl">
                        {item.title}
                        {item.host ? (
                          <span className="ml-2 font-sans text-sm font-bold tracking-wide text-[#9a6412] sm:text-base">
                            — {item.host}
                          </span>
                        ) : null}
                      </h3>

                      {item.note && (
                        <p className="mt-1 text-xs leading-relaxed text-[#2b446c] sm:text-sm">
                          {item.note}
                        </p>
                      )}

                      {item.subItems && (
                        <ul className="mt-2.5 space-y-1 border-t border-dashed border-[#162b4f]/25 pt-2 text-xs text-[#162b4f] sm:text-sm">
                          {item.subItems.map((sub) => (
                            <li
                              key={sub.label}
                              className={`flex flex-wrap items-center gap-x-2 ${
                                isLeft ? 'md:justify-end' : 'md:justify-start'
                              }`}
                            >
                              <span className="font-medium text-[#162b4f]">{sub.label}</span>
                              {sub.host && (
                                <span className="font-bold text-[#8c6326]">— {sub.host}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>

                  {/* Opposite Pocket Sticker on Desktop */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none hidden select-none md:row-start-1 md:flex md:items-center ${
                      isLeft
                        ? 'md:col-start-3 md:justify-start md:pl-8'
                        : 'md:col-start-1 md:justify-end md:pr-8'
                    }`}
                  >
                    <img
                      src={item.sticker}
                      alt={item.stickerAlt}
                      loading="lazy"
                      className={`program-sticker-desktop h-24 w-auto object-contain opacity-95 drop-shadow-[0_14px_24px_rgba(14,31,61,0.32)] ${
                        isLeft ? 'rotate-6' : '-rotate-6'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="editorial-shadow-light relative z-20 mx-auto mt-10 max-w-md text-center text-xs italic tracking-wide text-[#2b446c] sm:text-sm">
          {EVENT_INFO.programFootnote}
        </p>
      </div>

      {/* Gradient Blur Blend into Midnight Attendance Form Finale */}
      <WaveTransition toColor="#081122" heightClass="h-32 sm:h-44" className="z-[15]" />
    </section>
  );
}
