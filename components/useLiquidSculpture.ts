'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { hexToRgb, LiquidEngine, type EngineOptions, type Rect } from '@/components/ui/liquid-particles-engine';

export type HeroTheme = 'light' | 'dark';
type Status = 'loading' | 'ready' | 'fallback';

/** Portfolio integration of Sculpture Hero by guglielmogiannattasio.it. */
export default function useLiquidSculpture(theme: HeroTheme, paused: boolean, suspended: boolean) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const settings = useRef({ theme, paused, suspended });
  const syncRef = useRef<(() => void) | null>(null);
  const imageSyncRef = useRef<((failed?: boolean) => void) | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [reducedMotion, setReducedMotion] = useState(true);
  const [running, setRunning] = useState(false);
  const imageLoaded = useCallback(() => imageSyncRef.current?.(), []);
  const imageFailed = useCallback(() => imageSyncRef.current?.(true), []);

  useEffect(() => {
    settings.current = { theme, paused, suspended };
    syncRef.current?.();
  }, [theme, paused, suspended]);

  useEffect(() => {
    const stage = stageRef.current;
    const image = imageRef.current;
    if (!stage || !image) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let engine: LiquidEngine | null = null;
    let inView = false;
    let failed = false;
    let disposed = false;
    let loadedSource = '';
    let presentedSource = '';
    let imageError = false;
    let previousTheme = settings.current.theme;
    let canvas: HTMLCanvasElement;

    const options = (): EngineOptions => ({
      interactive: true, strength: .85, radius: 190, density: .85, dotSize: .95,
      spread: .85, turbulence: .8, returnSpeed: 1.15, streaks: true,
      restStyle: 'image', ambient: true, ambientIntensity: .35, speed: .8,
      intro: false, reducedMotion: preference.matches,
      bg: hexToRgb(settings.current.theme === 'dark' ? '#111110' : '#ebe9e5', [0, 0, 0]),
      imgBg: null, liquid: .65,
    });
    const isVisible = () => inView && !document.hidden && getComputedStyle(stage).visibility !== 'hidden';
    const updateRunning = () => setRunning(Boolean(engine && !failed && !imageError && presentedSource && isVisible() && !preference.matches && !settings.current.paused && !settings.current.suspended));
    const fail = () => {
      if (disposed) return;
      failed = true;
      stage.dataset.gl = 'fallback';
      setStatus('fallback');
      setRunning(false);
    };
    const resize = () => {
      if (!engine || failed || !stage.clientWidth || !stage.clientHeight) return;
      const w = stage.clientWidth, h = stage.clientHeight;
      const aspect = image.naturalWidth / image.naturalHeight || 2.5;
      const width = Math.min(w, h * aspect), height = width / aspect;
      const rect: Rect = { x: (w - width) / 2, y: (h - height) / 2, w: width, h: height };
      try { engine.resize(w, h, rect); } catch { fail(); }
    };
    const loadImage = (hasError = false) => {
      if (disposed) return;
      if (hasError) {
        imageError = true;
        stage.dataset.image = 'error';
        engine?.setVisible(false);
        presentedSource = '';
        stage.dataset.gl = 'fallback';
        setStatus('fallback');
        setRunning(false);
        return;
      }
      if (!image.complete || !image.naturalWidth) return;
      imageError = false;
      stage.dataset.image = 'loaded';
      const source = image.currentSrc || image.src;
      if (!engine || failed) return;
      // Returning to the cached mode must also restore its presented state,
      // even when the intervening image never finished loading.
      if (source === loadedSource) {
        if (!presentedSource) {
          presentedSource = source;
          stage.dataset.gl = 'ready';
          setStatus('ready');
          updateRunning();
        }
        return;
      }
      loadedSource = source;
      presentedSource = '';
      stage.dataset.gl = 'loading';
      setStatus('loading');
      engine.onFirstFrame = () => {
        if (disposed || source !== loadedSource) return;
        presentedSource = source;
        stage.dataset.gl = 'ready';
        setStatus('ready');
        updateRunning();
      };
      try {
        engine.setOptions(options());
        // Set the CSS-pixel rect before sampling/uploading the new image.
        resize();
        engine.setImage(image);
        resize();
      } catch { fail(); }
    };
    const makeCanvas = () => {
      const element = document.createElement('canvas');
      element.dataset.liquidCanvas = '';
      element.addEventListener('webglcontextrestored', recover);
      stage.appendChild(element);
      return element;
    };
    const sync = () => {
      if (disposed) return;
      const visible = isVisible() && !imageError;
      setReducedMotion(preference.matches);
      if (previousTheme !== settings.current.theme) {
        previousTheme = settings.current.theme;
        presentedSource = '';
        stage.dataset.gl = failed ? 'fallback' : 'loading';
        setStatus(failed ? 'fallback' : 'loading');
      }
      if (!engine && !failed && visible && !settings.current.suspended) {
        try { engine = new LiquidEngine(canvas, options(), fail); } catch { fail(); }
      }
      if (engine && !failed) {
        try {
          engine.setVisible(visible);
          engine.setOptions(options());
          engine.setSuspended(settings.current.paused || settings.current.suspended);
          loadImage();
        } catch { fail(); }
      }
      updateRunning();
    };
    function recover() {
      if (disposed) return;
      canvas.removeEventListener('webglcontextrestored', recover);
      engine?.destroy();
      engine = null;
      canvas.remove();
      failed = false;
      loadedSource = presentedSource = '';
      canvas = makeCanvas();
      sync();
    }
    canvas = makeCanvas();
    syncRef.current = sync;
    imageSyncRef.current = (imageError) => { loadImage(imageError); sync(); };
    const resizeObserver = new ResizeObserver(() => { resize(); sync(); });
    resizeObserver.observe(stage);
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    intersection.observe(stage);
    // The entrance preserves layout while keeping the portfolio visually hidden.
    const gate = stage.closest('[hidden]');
    const gateObserver = new MutationObserver(sync);
    if (gate) gateObserver.observe(gate, { attributes: true, attributeFilter: ['hidden'] });
    const pointer = (event: PointerEvent, kind: 'move' | 'down' | 'up' | 'leave') => {
      if (!engine || failed || preference.matches || settings.current.paused || settings.current.suspended || !isVisible()) return;
      if (event.pointerType === 'touch' && kind === 'move' && !event.buttons && !event.pressure) return;
      const bounds = stage.getBoundingClientRect();
      engine.pointer(kind, event.clientX - bounds.left, event.clientY - bounds.top, event.pointerType === 'touch');
      if (kind === 'down' || kind === 'move') stage.dataset.touched = 'true';
    };
    const move = (e: PointerEvent) => pointer(e, 'move');
    const down = (e: PointerEvent) => pointer(e, 'down');
    const up = (e: PointerEvent) => pointer(e, 'up');
    const leave = (e: PointerEvent) => pointer(e, 'leave');
    stage.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerdown', down, { passive: true });
    stage.addEventListener('pointerup', up, { passive: true });
    stage.addEventListener('pointercancel', leave, { passive: true });
    stage.addEventListener('pointerleave', leave, { passive: true });
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      disposed = true;
      syncRef.current = imageSyncRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      gateObserver.disconnect();
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerdown', down);
      stage.removeEventListener('pointerup', up);
      stage.removeEventListener('pointercancel', leave);
      stage.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('webglcontextrestored', recover);
      engine?.destroy();
      canvas.remove();
    };
  }, []);

  return { stageRef, imageRef, imageLoaded, imageFailed, status, reducedMotion, running };
}
