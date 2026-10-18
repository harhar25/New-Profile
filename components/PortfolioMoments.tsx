'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import ImageStream, { type StreamImage } from '@/components/ui/ImageStream';
import styles from './PortfolioMoments.module.css';

const galleryImages: StreamImage[] = [
  {
    src: '/uploads/haroldExhibit.jpg',
    alt: 'Harold Madjos at the ACLC College of Butuan Project Exhibit 2025',
  },
  {
    src: '/uploads/harold-graduation-portrait-1.jpg',
    alt: 'Graduation portrait of Harold Madjos',
  },
  {
    src: '/uploads/harold-portrait-cutout-v2.png',
    alt: 'Harold Madjos wearing formal Filipino attire',
  },
  {
    src: '/uploads/a%20man%20in%20a%20formal%20su.png',
    alt: 'Formal portrait of Harold Madjos',
  },
  {
    src: '/uploads/harold-graduation-portrait-2.jpg',
    alt: 'Studio portrait of Harold Madjos in formal Filipino attire',
  },
];

export default function PortfolioMoments({ suspended = false }: { suspended?: boolean }) {
  const section = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    let inView = false;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(preference.matches);
      setActive(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    observer.observe(element);
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    update();
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return (
    <section id="story" ref={section} className={styles.section} aria-labelledby="gallery-title">
      <ImageStream images={galleryImages} running={active && !paused && !reducedMotion && !suspended} />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.heading}>
        <p className={styles.eyebrow}>06 &nbsp;/&nbsp; Beyond the systems</p>
        <h2 id="gallery-title">
          Moments that <em>shape the work.</em>
        </h2>
        <p className={styles.description}>Behind every workflow is a person who keeps learning.<br />A few frames from my journey.</p>
      </div>
      <div className={styles.footer}>
        <p className={styles.caption}>
          <span>Harold Madjos / Selected moments</span>
          From the project exhibit to graduation.<br />Curiosity, craft, and a little perspective.
        </p>
        <div className={styles.controls}>
          <Link href="/projects" className={styles.link}>See what I build <ArrowUpRight size={14} /></Link>
          <button type="button" className={styles.pause} onClick={() => setPaused((value) => !value)} aria-pressed={paused} disabled={reducedMotion}>
            {paused || reducedMotion ? <Play size={14} strokeWidth={1.5} /> : <Pause size={14} strokeWidth={1.5} />}
            {reducedMotion ? 'Still gallery' : paused ? 'Play gallery' : 'Pause gallery'}
          </button>
        </div>
      </div>
    </section>
  );
}
