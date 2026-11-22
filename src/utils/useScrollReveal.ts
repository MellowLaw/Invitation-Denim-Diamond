import { useEffect, type RefObject } from 'react';

/**
 * Reveals `.reveal-item` descendants as soon as they appear in or near the viewport.
 * Avoids scroll-position cache drift when layouts shift on mobile phones.
 */
export function useScrollReveal(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>('.reveal-item'));
    if (items.length === 0) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const revealVisibleInView = (obs: IntersectionObserver) => {
      const thresholdY = window.innerHeight + 40;
      items.forEach((el) => {
        if (el.classList.contains('is-visible')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < thresholdY) {
          el.classList.add('is-visible');
          obs.unobserve(el);
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight + 40) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px 40px 0px',
      }
    );

    items.forEach((el) => {
      if (!el.classList.contains('is-visible')) {
        observer.observe(el);
      }
    });

    const raf = window.requestAnimationFrame(() => revealVisibleInView(observer));

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [containerRef]);
}
