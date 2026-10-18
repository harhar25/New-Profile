'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import ImageStream, { type StreamImage } from '@/components/ui/ImageStream';
import styles from './PortfolioMoments.module.css';

const galleryImages: StreamImage[] = [
  {
    src: '/uploads/Screenshot%202026-10-02%20000110.png',
    alt: 'Lead intake workflow connecting a webhook, validation, email, and CRM records',
  },
  {
    src: '/uploads/Screenshot%202026-08-06%20030620.png',
    alt: 'Wellness practice website landing page',
  },
  {
    src: '/uploads/Screenshot%202026-08-06%20022606.png',
    alt: 'Make automation scenario for a blog creation workflow',
  },
  {
    src: '/uploads/Screenshot%202026-08-06%20030907.png',
    alt: 'Landscaping business website landing page',
  },
  {
    src: '/uploads/Screenshot%202026-08-06%20022827.png',
    alt: 'Make automation connecting spreadsheets, AI, and Slack',
  },
  {
    src: '/uploads/Screenshot%202026-08-06%20031103.png',
    alt: 'Sports merchandise storefront',
  },
  {
    src: '/uploads/blog-workflow-overview.png',
    alt: 'Overview of a branching blog automation scenario',
  },
  {
    src: '/uploads/Screenshot%202026-09-22%20221231.png',
    alt: 'Eyewear website with conversational shopping assistance',
  },
  {
    src: '/uploads/Screenshot%202026-08-06%20023050.png',
    alt: 'Blog publishing workflow with API requests and spreadsheet updates',
  },
  {
    src: '/uploads/Screenshot%202026-08-06%20030644.png',
    alt: 'About page for a wellness practice website',
  },
  {
    src: '/uploads/Screenshot%202026-10-02%20000126.png',
    alt: 'Lead validation and deduplication automation',
  },
  {
    src: '/uploads/Screenshot%202026-08-06%20031232.png',
    alt: 'Sports event registration page',
  },
  {
    src: '/uploads/blog-workflow-editor.png',
    alt: 'Blog automation scenario in the Make editor',
  },
  {
    src: '/uploads/Screenshot%202026-08-06%20015716.png',
    alt: 'CRM workflow configuration and action steps',
  },
  {
    src: '/uploads/Screenshot%202026-08-06%20022651.png',
    alt: 'Blog analytics automation connecting publishing tools and a spreadsheet',
  },
  {
    src: '/uploads/Screenshot%202026-08-06%20221350.png',
    alt: 'Approval routing automation with webhook and email steps',
  },
  {
    src: '/uploads/Screenshot%202026-08-06%20031447.png',
    alt: 'CRM private integration configuration',
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
        <p className={styles.eyebrow}>06 &nbsp;/&nbsp; Behind the builds</p>
        <h2 id="gallery-title">
          Systems that <em>shape the work.</em>
        </h2>
        <p className={styles.description}>A closer look at the workflows, integrations,<br />and websites I build.</p>
      </div>
      <div className={styles.footer}>
        <p className={styles.caption}>
          <span>Harold Madjos / Work in practice</span>
          Automation flows, connected tools,<br />and web experiences.
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
