'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { createHeroRenderer, type HeroRenderer } from '@/lib/heroShader';

export default function useHeroBackground(sectionRef: RefObject<HTMLElement | null>, paused: boolean, suspended: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settings = useRef({ paused, suspended });
  const syncRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const [reducedMotion, setReducedMotion] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    settings.current = { paused, suspended };
    syncRef.current?.();
  }, [paused, suspended]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    let renderer: HeroRenderer | null = null;
    let inView = false;
    let lost = false;
    let frame = 0;
    let lastDraw = 0;
    let elapsed = 12;
    const pointer: [number, number] = [0, 0];
    const target: [number, number] = [0, 0];
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');

    const draw = (now: number) => {
      if (now - lastDraw >= 1000 / 30) {
        elapsed += lastDraw ? Math.min(now - lastDraw, 80) * 0.0005 : 0;
        lastDraw = now;
        pointer[0] += (target[0] - pointer[0]) * 0.06;
        pointer[1] += (target[1] - pointer[1]) * 0.06;
        renderer?.render(elapsed, pointer);
      }
      frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      lastDraw = 0;
      const visible = getComputedStyle(section).visibility !== 'hidden';
      const shouldRun = Boolean(renderer && !lost && inView && visible && !document.hidden && !preference.matches && !settings.current.paused && !settings.current.suspended);
      setRunning(shouldRun);
      setReducedMotion(preference.matches);
      if (shouldRun) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      if (!renderer || lost) return;
      const width = Math.max(1, section.clientWidth);
      const height = Math.max(1, section.clientHeight);
      // Soft light needs fewer pixels than text. Bound GPU work on large screens.
      const density = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(800_000 / (width * height)));
      renderer.resize(width, height, density);
      renderer.render(elapsed, pointer);
    };
    const initialize = () => {
      renderer?.dispose();
      renderer = createHeroRenderer(canvas);
      setStatus(renderer ? 'ready' : 'fallback');
      resize();
      sync();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      setStatus('fallback');
      sync();
    };
    const contextRestored = () => { lost = false; initialize(); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = section.getBoundingClientRect();
      target[0] = (event.clientX - rect.left) / rect.width - 0.5;
      target[1] = 0.5 - (event.clientY - rect.top) / rect.height;
    };
    const leave = () => { target[0] = 0; target[1] = 0; };

    syncRef.current = sync;
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    const size = new ResizeObserver(resize);
    // The video gate keeps its contents mounted but visually hidden before entry.
    const gate = section.closest('[hidden]');
    const gateVisibility = new MutationObserver(sync);
    if (gate) gateVisibility.observe(gate, { attributes: true, attributeFilter: ['hidden'] });
    intersection.observe(section);
    size.observe(section);
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    section.addEventListener('pointermove', move, { passive: true });
    section.addEventListener('pointerleave', leave);
    canvas.addEventListener('webglcontextlost', contextLost);
    canvas.addEventListener('webglcontextrestored', contextRestored);
    initialize();

    return () => {
      syncRef.current = null;
      cancelAnimationFrame(frame);
      intersection.disconnect();
      size.disconnect();
      gateVisibility.disconnect();
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('webglcontextlost', contextLost);
      canvas.removeEventListener('webglcontextrestored', contextRestored);
      renderer?.dispose();
    };
  }, [sectionRef]);

  return { canvasRef, status, reducedMotion, running };
}
