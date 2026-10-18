'use client';

import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './BackgroundPathsHero.module.css';

// Curves adapted from the BackgroundPaths component supplied by the owner.
function FloatingPaths({ position }: { position: number }) {
  return (
    <svg className={styles.paths} viewBox="0 0 696 316" fill="none" aria-hidden="true">
      {Array.from({ length: 18 }, (_, line) => {
        const index = line * 2;
        return (
        <path
          key={index}
          d={`M-${380 - index * 5 * position} -${189 + index * 6}C-${380 - index * 5 * position} -${189 + index * 6} -${312 - index * 5 * position} ${216 - index * 6} ${152 - index * 5 * position} ${343 - index * 6}C${616 - index * 5 * position} ${470 - index * 6} ${684 - index * 5 * position} ${875 - index * 6} ${684 - index * 5 * position} ${875 - index * 6}`}
          stroke="currentColor"
          strokeWidth={0.65 + line * 0.025}
          strokeOpacity={0.12 + line * 0.008}
          className={styles.path}
        />
        );
      })}
    </svg>
  );
}

export default function BackgroundPathsHero({ fullName, location, suspended = false }: { fullName: string; location: string; suspended?: boolean }) {
  const hero = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const words = fullName.trim().split(/\s+/);
  const displayName = words.length > 2 ? `${words[0]} ${words.at(-1)}` : fullName;

  useEffect(() => {
    const section = hero.current;
    if (!section) return;
    let inView = false;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(preference.matches);
      setActive(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    observer.observe(section);
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    update();
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  const running = active && !paused && !reducedMotion && !suspended;

  return (
    <header id="about" ref={hero} className={styles.hero} data-running={running}>
      <div className={styles.background}><FloatingPaths position={1} /><FloatingPaths position={-1} /></div>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Automation &amp; AI systems specialist</p>
        <h1 className={styles.title} aria-label={fullName}>
          {displayName.split(' ').map((word, wordIndex) => (
            <span key={`${word}-${wordIndex}`} className={styles.word} aria-hidden="true">
              {Array.from(word).map((letter, index) => (
                <span key={index} className={styles.letter} style={{ '--letter-delay': `${0.15 + wordIndex * 0.1 + index * 0.03}s` } as CSSProperties}>{letter}</span>
              ))}
            </span>
          ))}
        </h1>
        <p className={styles.description}>Connecting people, tools, and ideas.<br />Making complex work feel simple.</p>
        <div className={styles.actions}>
          <div className={styles.buttonFrame}><Link href="/projects" className={styles.primary}>Discover my work <ArrowUpRight size={19} strokeWidth={1.5} /></Link></div>
          <Link href="/skills" className={styles.secondary}>Explore my skills <span aria-hidden="true">→</span></Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <a href="#chapter-one" className={styles.scroll}><ArrowDown size={15} /> Scroll to explore</a>
        <span className={styles.location}>{location}</span>
        <button type="button" className={styles.motionButton} onClick={() => setPaused((value) => !value)} aria-pressed={paused} disabled={reducedMotion} aria-label={paused ? 'Play background animation' : 'Pause background animation'}>
          {paused || reducedMotion ? <Play size={12} /> : <Pause size={12} />} {reducedMotion ? 'Still background' : paused ? 'Play background' : 'Pause background'}
        </button>
      </div>
    </header>
  );
}
