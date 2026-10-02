'use client';

import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { RobotPlaceholder, SplineScene } from '@/components/ui/SplineScene';
import styles from './RobotShowcase.module.css';
import RobotChat from './RobotChat';

// Public robot demo from https://21st.dev/community/components/serafim/splite.
const ROBOT_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';
const motionQuery = '(prefers-reduced-motion: reduce)';

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}

export default function RobotShowcase({ scene = ROBOT_SCENE, suspended = false, onContact }: { scene?: string; suspended?: boolean; onContact: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);
  const [inView, setInView] = useState(false);
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const [thinking, setThinking] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => true);
  const pageVisible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === 'visible', () => false);
  const playing = motionOverride ?? !reducedMotion;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const preloadObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true);
        preloadObserver.disconnect();
      }
    }, { rootMargin: '240px' });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.05 });
    preloadObserver.observe(section);
    visibilityObserver.observe(section);

    return () => {
      preloadObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id="playground" aria-labelledby="robot-title" className={styles.section}>
      <div className={styles.card} data-thinking={thinking}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}><span /> A CONVERSATION WITH POSSIBILITY</p>
          <h2 id="robot-title" className={styles.title}>
            <span>A little help?</span>
            Meet Orbit.
          </h2>
          <p className={styles.description}>
            Your curious guide to Harold&apos;s work. Ask a question and let&apos;s find a starting point.
          </p>
          <RobotChat onContact={onContact} onThinkingChange={setThinking} />
        </div>

        <div className={styles.stage} aria-label="Interactive 3D robot">
          <div className={styles.halo} aria-hidden="true" />
          <div className={styles.orbit} aria-hidden="true" />
          <span className={styles.stageLabel}>{thinking ? 'THINKING IT THROUGH…' : 'YOUR CURIOUS CO-PILOT'}</span>
          {entered ? (
            <SplineScene scene={scene} active={playing && inView && pageVisible && !suspended} className={styles.scene} />
          ) : <RobotPlaceholder />}
        </div>

        <div className={styles.footer}>
          <p>{playing ? 'Move your cursor. Say hello.' : 'A quiet moment. Ready when you are.'}</p>
          <button
            type="button"
            className={styles.motionButton}
            onClick={() => setMotionOverride(!playing)}
            aria-label={playing ? 'Pause robot animation' : 'Play robot animation'}
            aria-pressed={!playing}
          >
            {playing ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
            {playing ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </section>
  );
}
