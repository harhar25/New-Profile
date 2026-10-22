'use client';

import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Pause, Play, Workflow } from 'lucide-react';
import { useRef, useState } from 'react';
import useHeroBackground from './useHeroBackground';
import styles from './ShaderHero.module.css';

export default function ShaderHero({ fullName, location, suspended = false }: { fullName: string; location: string; suspended?: boolean }) {
  const hero = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const { canvasRef, status, reducedMotion, running } = useHeroBackground(hero, paused, suspended);
  const words = fullName.trim().split(/\s+/);
  const firstName = words[0];
  const lastName = words.length > 1 ? words.at(-1) : '';
  const still = reducedMotion || status !== 'ready';

  return (
    <header id="about" ref={hero} className={styles.hero} data-running={running} data-background={status} aria-labelledby="landing-title">
      <div className={styles.background} aria-hidden="true">
        <div className={styles.fallback} />
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.shade} />
      </div>
      <div className={styles.content}>
        <p className={styles.badge}><Workflow size={15} strokeWidth={1.5} aria-hidden="true" /><span>Automation &amp; AI systems specialist</span></p>
        <h1 id="landing-title" className={styles.title} aria-label={fullName}>
          <span aria-hidden="true">{firstName}</span>
          {lastName && <span aria-hidden="true">{lastName}<span className={styles.period}>.</span></span>}
        </h1>
        <p className={styles.description}>Connecting people, tools, and ideas.<br />Making complex work feel simple.</p>
        <div className={styles.actions}>
          <Link href="/projects" className={styles.primary}>Discover my work <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" /></Link>
          <Link href="/skills" className={styles.secondary}>Explore my skills <ArrowRight size={17} strokeWidth={1.5} aria-hidden="true" /></Link>
        </div>
        <p className={styles.toolkit}>GoHighLevel <span>/</span> n8n <span>/</span> Make <span>/</span> AI workflows</p>
      </div>
      <div className={styles.bottom}>
        <a href="#chapter-one" className={styles.scroll}><ArrowDown size={14} aria-hidden="true" /> Scroll to explore</a>
        <span className={styles.location}>{location}</span>
        <button type="button" className={styles.motionButton} onClick={() => setPaused((value) => !value)} aria-pressed={paused} disabled={still} aria-label={still ? 'Still background' : paused ? 'Play background animation' : 'Pause background animation'}>
          {still || paused ? <Play size={11} aria-hidden="true" /> : <Pause size={11} aria-hidden="true" />}{still ? 'Still background' : paused ? 'Play background' : 'Pause background'}
        </button>
      </div>
    </header>
  );
}
