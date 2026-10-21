'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { projectScreenshots as screenshots } from '@/lib/projectScreenshots';
import styles from './ProjectScreenshotGallery.module.css';

type Phase = 'scatter' | 'line' | 'circle' | 'arc';
const PAGE_SIZE = 12;
// Keep server and browser CSS serialization identical during hydration.
const coordinate = (value: number) => Math.round(value * 1000) / 1000;

export default function ProjectScreenshotGallery() {
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState<Phase>('arc');
  const [width, setWidth] = useState(900);
  const [replay, setReplay] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const interacted = useRef(false);
  const screenshot = screenshots[selected];
  const groupStart = Math.floor(selected / PAGE_SIZE) * PAGE_SIZE;
  const visibleScreenshots = screenshots.slice(groupStart, groupStart + PAGE_SIZE);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timers: number[] = [];
    const stop = () => { timers.forEach(window.clearTimeout); timers = []; };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (preference.matches || interacted.current) return;
      const phases: Phase[] = ['scatter', 'line', 'circle', 'arc'];
      timers = phases.map((next, index) => window.setTimeout(() => {
        if (!interacted.current) setPhase(next);
      }, [0, 350, 1200, 2400][index]));
    }, { threshold: 0.25 });
    const onPreference = () => { if (preference.matches) { stop(); setPhase('arc'); } };
    observer.observe(element);
    preference.addEventListener('change', onPreference);
    return () => { stop(); observer.disconnect(); preference.removeEventListener('change', onPreference); };
  }, [replay]);

  function choose(index: number) {
    interacted.current = true;
    setSelected((index + screenshots.length) % screenshots.length);
    setPhase('arc');
  }

  function arrange(next: Phase) { interacted.current = true; setPhase(next); }

  const cardWidth = width < 600 ? 62 : 100;

  return (
    <section id="project-gallery" className={styles.section} aria-labelledby="screenshots-title">
      <div className={styles.heading}>
        <div><p className={styles.eyebrow}>Visual archive / {screenshots.length} screenshots</p><h2 id="screenshots-title">A closer look<br />at the <em>work.</em></h2></div>
        <p>Workflows, websites, and connected tools.<br />Choose a frame to explore the details.</p>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.layouts} role="group" aria-label="Arrange screenshot cards">
          {(['line', 'circle', 'arc'] as const).map(layout => <button key={layout} type="button" aria-pressed={phase === layout} onClick={() => arrange(layout)}>{layout}</button>)}
          <button type="button" onClick={() => { interacted.current = false; setReplay(value => value + 1); }} aria-label="Replay card animation"><RotateCcw size={14} /></button>
        </div>
        <span>Choose a card or use the arrows</span>
      </div>
      <div ref={stage} className={styles.stage} data-phase={phase}>
        <div className={styles.preview} inert={phase !== 'arc'} aria-hidden={phase !== 'arc'}>
          <a key={selected} className={styles.previewFrame} href={screenshot.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image: ${screenshot.title}`}>
            <Image src={screenshot.src} alt={screenshot.title} fill sizes="(max-width: 700px) 90vw, 850px" loading="eager" className={styles.previewImage} />
            <span className={styles.expand}>View full size <ArrowUpRight size={14} /></span>
          </a>
        </div>
        <p className={styles.circleLabel} aria-hidden="true">Connected tools.<br /><em>Considered systems.</em></p>
        {visibleScreenshots.map((item, index) => {
          const frameIndex = groupStart + index;
          const fraction = index / Math.max(1, visibleScreenshots.length - 1);
          const circleAngle = index / visibleScreenshots.length * Math.PI * 2 - Math.PI / 2;
          const radius = Math.min(width * 0.33, 205);
          let x = 0, y = 0, rotation = 0;
          if (phase === 'scatter') {
            x = Math.sin(index * 7.3) * width * 0.38;
            y = Math.cos(index * 3.7) * 170;
            rotation = Math.sin(index * 2.1) * 65;
          } else if (phase === 'circle') {
            x = Math.cos(circleAngle) * radius;
            y = Math.sin(circleAngle) * radius;
            rotation = index / visibleScreenshots.length * 360;
          } else if (phase === 'line') {
            x = (fraction - 0.5) * (width - cardWidth - 20);
          } else {
            const arcAngle = (fraction - 0.5) * 1.7;
            x = Math.sin(arcAngle) * (width - cardWidth - 24) / 1.5;
            y = 190 + (1 - Math.cos(arcAngle)) * 80;
            rotation = arcAngle * 22;
          }
          return (
            <button key={item.src} type="button" className={styles.card} onClick={() => choose(frameIndex)} aria-label={`View screenshot ${frameIndex + 1}: ${item.title}`} aria-pressed={frameIndex === selected} style={{ width: cardWidth, transform: `translate(-50%, -50%) translate(${coordinate(x)}px, ${coordinate(y)}px) rotate(${coordinate(rotation)}deg)`, zIndex: frameIndex === selected ? 3 : 1 }}>
              <span className={styles.flip}>
                <span className={styles.front}><Image src={item.src} alt="" fill sizes="110px" /><span>{String(frameIndex + 1).padStart(2, '0')}</span></span>
                <span className={styles.back} aria-hidden="true">View<br />{String(frameIndex + 1).padStart(2, '0')}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className={styles.setNavigation}>
        <button type="button" disabled={groupStart === 0} onClick={() => choose(Math.max(0, groupStart - PAGE_SIZE))}><ArrowLeft size={13} /> Previous set</button>
        <span>Frames {groupStart + 1}–{groupStart + visibleScreenshots.length} of {screenshots.length}</span>
        <button type="button" disabled={groupStart + PAGE_SIZE >= screenshots.length} onClick={() => choose(groupStart + PAGE_SIZE)}>Next set <ArrowRight size={13} /></button>
      </div>
      <div className={styles.details}>
        <div aria-live="polite" aria-atomic="true"><p className={styles.eyebrow}>{String(selected + 1).padStart(2, '0')} / {screenshots.length} &nbsp; — &nbsp; {screenshot.category}</p><h3>{screenshot.title}</h3><p>{screenshot.description}</p></div>
        <div className={styles.navigation} role="group" aria-label="Change screenshot">
          <button type="button" aria-label="Previous screenshot" onClick={() => choose(selected - 1)}><ArrowLeft size={19} /></button>
          <button type="button" aria-label="Next screenshot" onClick={() => choose(selected + 1)}><ArrowRight size={19} /></button>
        </div>
      </div>
      <details className={styles.index}>
        <summary>Browse all {screenshots.length} screenshots</summary>
        <ol>{screenshots.map((item, index) => <li key={item.src}><button type="button" aria-pressed={selected === index} onClick={() => choose(index)}>{String(index + 1).padStart(2, '0')} &nbsp; {item.title}</button><a href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`Open original image: ${item.title}`}><ArrowUpRight size={15} /></a></li>)}</ol>
      </details>
    </section>
  );
}
