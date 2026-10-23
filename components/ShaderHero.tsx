'use client';

import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Moon, Pause, Play, Sun, Workflow } from 'lucide-react';
import { useEffect, useState } from 'react';
import useLiquidSculpture from './useLiquidSculpture';
import useHeroTheme from './useHeroTheme';
import styles from './ShaderHero.module.css';

export default function ShaderHero({ fullName, location, suspended = false }: { fullName: string; location: string; suspended?: boolean }) {
  const { theme, selectTheme } = useHeroTheme();
  const [paused, setPaused] = useState(false);
  const { stageRef, imageRef, imageLoaded, imageFailed, status, reducedMotion, running } = useLiquidSculpture(theme, paused, suspended);
  const words = fullName.trim().split(/\s+/);
  const firstName = words[0];
  const lastName = words.length > 1 ? words.at(-1) : '';
  const still = reducedMotion || status !== 'ready';

  useEffect(() => {
    document.documentElement.dataset.heroTheme = theme;
    return () => { delete document.documentElement.dataset.heroTheme; };
  }, [theme]);

  return (
    <header id="about" className={styles.hero} data-hero-theme={theme} data-running={running} data-background={status} aria-labelledby="landing-title">
      <div className={styles.toolbar}>
        <p className={styles.badge}><Workflow size={14} strokeWidth={1.4} aria-hidden="true" /><span>Automation &amp; AI systems specialist</span></p>
        <div className={styles.themeSwitch} role="group" aria-label="Hero color mode">
          <button type="button" aria-label="Use light hero theme" aria-pressed={theme === 'light'} onClick={() => selectTheme('light')}><Sun size={14} aria-hidden="true" /><span>Light</span></button>
          <button type="button" aria-label="Use dark hero theme" aria-pressed={theme === 'dark'} onClick={() => selectTheme('dark')}><Moon size={14} aria-hidden="true" /><span>Dark</span></button>
        </div>
      </div>
      <div ref={stageRef} className={styles.scene} aria-hidden="true">
        <span className={styles.backdrop}>CONNECTED</span>
        <div className={styles.emptySculpture}><Workflow strokeWidth={.6} /></div>
        <picture>
          <source media="(max-width: 639px)" srcSet={`/images/hero/sculpture-mobile-${theme}.webp`} />
          {/* The same local pixels feed the GPU and remain the no-WebGL fallback. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imageRef} className={styles.sculpture} src={`/images/hero/sculpture-${theme}.webp`} alt="" width={1983} height={793} loading="eager" fetchPriority="high" decoding="async" draggable={false} onLoad={imageLoaded} onError={imageFailed} />
        </picture>
        <span className={styles.interactionHint}>Move across the sculpture <ArrowUpRight size={12} /></span>
      </div>
      <div className={styles.content}>
        <div className={styles.introduction}>
          <p className={styles.eyebrow}>Independent thinking. Connected systems.</p>
          <h1 id="landing-title" className={styles.title} aria-label={fullName}><span aria-hidden="true">{firstName}</span>{lastName && <span className={styles.accent} aria-hidden="true">{lastName}<span className={styles.period}>.</span></span>}</h1>
        </div>
        <div className={styles.aside}>
          <p className={styles.description}>Connecting people, tools, and ideas.<br />Making complex work feel simple.</p>
          <div className={styles.actions}>
            <Link href="/projects" className={styles.primary}>Discover my work <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" /></Link>
            <Link href="/skills" className={styles.secondary}>Explore my skills <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></Link>
          </div>
          <p className={styles.toolkit}>GoHighLevel <span>/</span> n8n <span>/</span> Make <span>/</span> AI workflows</p>
        </div>
      </div>
      <div className={styles.bottom}>
        <a href="#chapter-one" className={styles.scroll}><ArrowDown size={13} aria-hidden="true" /> Scroll to explore</a>
        <span className={styles.location}>{location}</span>
        <button type="button" className={styles.motionButton} onClick={() => setPaused(value => !value)} aria-pressed={paused} disabled={still} aria-label={still ? 'Still sculpture' : paused ? 'Play sculpture animation' : 'Pause sculpture animation'}>
          {still || paused ? <Play size={11} aria-hidden="true" /> : <Pause size={11} aria-hidden="true" />}{still ? 'Still sculpture' : paused ? 'Play sculpture' : 'Pause sculpture'}
        </button>
      </div>
    </header>
  );
}
