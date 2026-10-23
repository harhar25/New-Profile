'use client';

import { useEffect, useRef, useState } from 'react';

/** Native scroll and pointer motion adapted from the supplied CinematicFooter. */
export default function useFooterMotion(paused: boolean, suspended: boolean) {
  const wrapperRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const settings = useRef({ paused, suspended });
  const syncRef = useRef<(() => void) | null>(null);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    settings.current = { paused, suspended };
    syncRef.current?.();
  }, [paused, suspended]);

  useEffect(() => {
    const wrapper = wrapperRef.current, panel = panelRef.current;
    if (!wrapper || !panel) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let inView = false, frame = 0;
    let magnetic: HTMLElement | null = null;

    const resetMagnet = () => {
      magnetic?.style.removeProperty('--magnet-x');
      magnetic?.style.removeProperty('--magnet-y');
      magnetic = null;
    };
    const moving = () => inView && !document.hidden && !preference.matches && !settings.current.paused && !settings.current.suspended && getComputedStyle(wrapper).visibility !== 'hidden';
    const paint = () => {
      frame = 0;
      if (!moving()) return;
      const progress = Math.max(0, Math.min(1, (window.innerHeight - wrapper.getBoundingClientRect().top) / window.innerHeight));
      wrapper.style.setProperty('--footer-parallax', `${(1 - progress) * 64}px`);
      wrapper.style.setProperty('--footer-scale', String(.9 + progress * .1));
    };
    const schedule = () => { if (!frame && moving()) frame = requestAnimationFrame(paint); };
    const sync = () => {
      setReducedMotion(preference.matches);
      wrapper.dataset.running = String(moving());
      if (!moving()) {
        cancelAnimationFrame(frame);
        frame = 0;
        resetMagnet();
      }
      if (preference.matches || settings.current.paused) {
        wrapper.style.setProperty('--footer-parallax', '0px');
        wrapper.style.setProperty('--footer-scale', '1');
      }
      schedule();
    };
    const measure = () => {
      // A fixed panel is safe only when its complete natural content fits.
      // Narrow screens, browser zoom, and long profile fields retain document flow.
      const height = Math.ceil(panel.getBoundingClientRect().height);
      // Decorative type deliberately bleeds past the bottom, so scrollHeight
      // includes clipped artwork. The auto-sized flex panel measures real content.
      const fits = window.innerWidth >= 1000 && window.innerHeight >= 760 && !preference.matches && height <= window.innerHeight + 1;
      wrapper.style.setProperty('--footer-height', `${height}px`);
      wrapper.dataset.curtain = String(fits);
      sync();
    };
    const focus = () => {
      // Fixed controls have viewport rects even while their curtain is clipped.
      // Reveal the whole wrapper before a keyboard user interacts with them.
      if (wrapper.dataset.curtain !== 'true') return;
      const rect = wrapper.getBoundingClientRect();
      if (rect.top > 1 || rect.bottom < window.innerHeight - 1) wrapper.scrollIntoView({ block: 'end', behavior: 'instant' });
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !finePointer.matches || !moving()) return;
      const target = (event.target as Element).closest<HTMLElement>('[data-footer-magnetic]');
      if (!target || !wrapper.contains(target)) { resetMagnet(); return; }
      if (magnetic !== target) { resetMagnet(); magnetic = target; }
      const rect = target.getBoundingClientRect();
      const x = Math.max(-6, Math.min(6, (event.clientX - rect.left - rect.width / 2) * .12));
      const y = Math.max(-4, Math.min(4, (event.clientY - rect.top - rect.height / 2) * .12));
      target.style.setProperty('--magnet-x', `${x}px`);
      target.style.setProperty('--magnet-y', `${y}px`);
    };
    const out = (event: PointerEvent) => {
      if (magnetic && !magnetic.contains(event.relatedTarget as Node | null)) resetMagnet();
    };
    syncRef.current = sync;
    const size = new ResizeObserver(measure);
    size.observe(panel);
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    intersection.observe(wrapper);
    const gate = wrapper.closest('[hidden]');
    const gateObserver = new MutationObserver(sync);
    if (gate) gateObserver.observe(gate, { attributes: true, attributeFilter: ['hidden'] });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', measure);
    finePointer.addEventListener('change', resetMagnet);
    wrapper.addEventListener('focusin', focus);
    wrapper.addEventListener('focusout', resetMagnet);
    wrapper.addEventListener('pointermove', move, { passive: true });
    wrapper.addEventListener('pointerout', out, { passive: true });
    wrapper.addEventListener('pointerleave', resetMagnet);
    wrapper.addEventListener('pointercancel', resetMagnet);
    measure();
    return () => {
      syncRef.current = null;
      cancelAnimationFrame(frame);
      resetMagnet();
      size.disconnect();
      intersection.disconnect();
      gateObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', sync);
      preference.removeEventListener('change', measure);
      finePointer.removeEventListener('change', resetMagnet);
      wrapper.removeEventListener('focusin', focus);
      wrapper.removeEventListener('focusout', resetMagnet);
      wrapper.removeEventListener('pointermove', move);
      wrapper.removeEventListener('pointerout', out);
      wrapper.removeEventListener('pointerleave', resetMagnet);
      wrapper.removeEventListener('pointercancel', resetMagnet);
    };
  }, []);

  return { wrapperRef, panelRef, reducedMotion };
}
