'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import styles from './PortfolioGate.module.css';

const VIDEO = 'https://cdn.21st.dev/assets/mirror/21/21a77eac28eacbb7e142016eefeaa0b4a766619e51113629a3bc6df6af066c0f.mp4';

export default function PortfolioGate({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const gate = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Direct section links and return visits within this tab go straight to the work.
    let seen = false;
    try { seen = sessionStorage.getItem('portfolio-entered') === 'true'; } catch {}
    if (window.location.hash || seen) {
      // Resolve the browser-only entry decision before paint so return visits
      // render the landing page immediately.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEntered(true);
    }
  }, []);

  useEffect(() => {
    if (entered) return;
    const element = gate.current;
    const media = video.current;
    if (!element || !media) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const body = document.body;
    const saved = { position: body.style.position, top: body.style.top, left: body.style.left,
      right: body.style.right, width: body.style.width, overscrollBehavior: body.style.overscrollBehavior };
    const scrollY = window.scrollY;
    Object.assign(body.style, { position: 'fixed', top: `-${scrollY}px`, left: '0', right: '0', width: '100%', overscrollBehavior: 'none' });
    let target = 0;
    let progress = 0;
    let touchY = 0;
    let frame = 0;
    let lastTime = -1;
    let finished = false;
    const enter = () => {
      if (finished) return;
      finished = true;
      setEntered(true);
    };
    const add = (delta: number) => {
      if (reduced) return;
      target = Math.min(1, Math.max(0, target + delta / 3200));
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      add(event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1));
    };
    const start = (event: TouchEvent) => { touchY = event.touches[0]?.clientY ?? 0; };
    const move = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const y = event.touches[0].clientY;
      event.preventDefault();
      add(touchY - y);
      touchY = y;
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') enter();
      if (event.target instanceof HTMLButtonElement) return;
      const delta = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? 400 : ['ArrowUp', 'PageUp'].includes(event.key) ? -400 : 0;
      if (delta) { event.preventDefault(); add(delta); }
    };
    const loaded = () => {
      setReady(true);
      if (reduced && Number.isFinite(media.duration)) media.currentTime = media.duration * 0.92;
    };
    const error = () => setFailed(true);
    const animate = () => {
      progress += (target - progress) * 0.18;
      element.style.setProperty('--progress', String(progress));
      element.style.setProperty('--title-opacity', String(1 - Math.min(progress / 0.35, 1)));
      element.style.setProperty('--title-blur', `${Math.min(progress / 0.35, 1) * 10}px`);
      element.style.setProperty('--tagline-opacity', String(Math.max(0, (progress - 0.82) / 0.18)));
      element.style.setProperty('--video-scale', String(1 + progress * 0.06));
      element.style.setProperty('--hint-opacity', target > 0.001 ? '0' : '1');
      if (Number.isFinite(media.duration) && media.duration > 0 && !media.seeking) {
        const time = Math.min(progress * media.duration, Math.max(0, media.duration - 0.05));
        if (Math.abs(time - lastTime) > 0.025) { media.currentTime = time; lastTime = time; }
      }
      if (target === 1 && progress > 0.998) { enter(); return; }
      frame = requestAnimationFrame(animate);
    };
    media.addEventListener('loadeddata', loaded);
    media.addEventListener('error', error);
    if (media.readyState >= 2) loaded();
    // Start buffering on mobile, then keep playback paused for scroll seeking.
    if (!reduced) {
      void media.play().then(() => media.pause()).catch(() => {});
      frame = requestAnimationFrame(animate);
    }
    element.addEventListener('wheel', wheel, { passive: false });
    element.addEventListener('touchstart', start, { passive: true });
    element.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('keydown', key);
    return () => {
      finished = true;
      cancelAnimationFrame(frame);
      media.pause();
      media.removeEventListener('loadeddata', loaded);
      media.removeEventListener('error', error);
      element.removeEventListener('wheel', wheel);
      element.removeEventListener('touchstart', start);
      element.removeEventListener('touchmove', move);
      window.removeEventListener('keydown', key);
      Object.assign(body.style, saved);
      window.scrollTo(0, scrollY);
    };
  }, [entered]);

  useEffect(() => {
    if (!entered) return;
    try { sessionStorage.setItem('portfolio-entered', 'true'); } catch {}
    if (!window.location.hash) content.current?.focus({ preventScroll: true });
  }, [entered]);

  return (
    <>
      {!entered && <div ref={gate} className={styles.gate} role="region" aria-label="Portfolio entrance">
        <video ref={video} src={VIDEO} muted playsInline preload="auto" className={`${styles.video} ${ready ? styles.ready : ''}`} aria-hidden="true" />
        <div className={styles.shade} />
        <div className={styles.identity}><span>HM</span><span>Harold Madjos / Portfolio</span></div>
        <h1 className={styles.title}>THE CITY OPENS</h1>
        <p className={styles.tagline}>Every door in the city is already open.</p>
        <div className={styles.controls}>
          <p className={styles.hint}>SCROLL TO OPEN <span aria-hidden="true">↓</span></p>
          <button type="button" onClick={() => setEntered(true)} className={styles.enter}>Enter portfolio <span aria-hidden="true">↗</span></button>
          {failed && <p className={styles.status} role="status">Video unavailable. Enter to explore my work.</p>}
        </div>
        <div className={styles.progress} aria-hidden="true"><div /></div>
      </div>}
      <div ref={content} tabIndex={-1} hidden={!entered} className={styles.content}>{children}</div>
      <noscript><style>{`.${styles.gate}{display:none!important}.${styles.content}[hidden]{display:block!important;visibility:visible!important}`}</style></noscript>
    </>
  );
}
