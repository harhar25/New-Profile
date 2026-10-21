'use client';

import Link from 'next/link';
import { ArrowUpRight, Play, Workflow } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './FeatureBlocks.module.css';

export default function AutomationCallout({ title, description }: { title: string; description: string }) {
  const callout = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = callout.current;
    if (!element) return;
    let inView = false;
    const update = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); }, { threshold: 0.2 });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);

  return (
    <aside ref={callout} className={styles.callout} data-active={active} aria-label="Try the automation playground">
      <div className={styles.calloutCopy}>
        <span className={styles.calloutBadge}><Workflow size={14} aria-hidden="true" /> Interactive playground</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.calloutAction}>
        <Link href="/automation" className={styles.calloutButton}><span className={styles.calloutPlay} aria-hidden="true"><Play size={15} fill="currentColor" /></span>Open the playground <ArrowUpRight size={18} aria-hidden="true" /></Link>
        <span className={styles.calloutHint}>No sign-up · Runs in your browser</span>
      </div>
    </aside>
  );
}
