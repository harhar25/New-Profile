'use client';

import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Application } from '@splinetool/runtime';
import styles from '@/components/RobotShowcase.module.css';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
  active?: boolean;
}

export function RobotPlaceholder({ message = 'A little hello from the future.' }: { message?: string }) {
  return (
    <div className={styles.placeholder} role="status">
      <svg viewBox="0 0 240 260" fill="none" aria-hidden="true" className={styles.robotDrawing}>
        <ellipse cx="120" cy="238" rx="66" ry="10" fill="currentColor" opacity=".08" />
        <path d="M120 26v24" stroke="currentColor" strokeWidth="2" />
        <circle cx="120" cy="20" r="7" fill="currentColor" />
        <rect x="55" y="50" width="130" height="94" rx="35" stroke="currentColor" strokeWidth="2" />
        <rect x="66" y="61" width="108" height="66" rx="25" fill="currentColor" fillOpacity=".07" />
        <path d="M83 88v12m74-12v12" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        <path d="M105 112q15 12 30 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M51 83h-8v29h8m138-29h8v29h-8M94 153h52q14 0 14 14v31q0 17-17 17H97q-17 0-17-17v-31q0-14 14-14Z" stroke="currentColor" strokeWidth="2" />
        <path d="M70 164q-22 3-28 26m126-26q24-2 28-26M101 216v15m38-15v15" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <circle cx="120" cy="183" r="12" stroke="currentColor" strokeWidth="2" />
        <circle cx="120" cy="183" r="4" fill="currentColor" />
        <path d="m193 121 1 9m13-4-7 6m11 8h-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function ScenePlayer({ scene, className, active = true }: SplineSceneProps) {
  const appRef = useRef<Application | null>(null);
  const activeRef = useRef(active);
  const frameRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    activeRef.current = active;
    if (active) appRef.current?.play();
    else appRef.current?.stop();
  }, [active]);

  useEffect(() => () => {
    cancelAnimationFrame(frameRef.current);
    appRef.current = null;
  }, []);

  useEffect(() => {
    if (ready) return;
    const timeout = window.setTimeout(() => setTimedOut(true), 20_000);
    return () => window.clearTimeout(timeout);
  }, [ready]);

  const onLoad = useCallback((app: Application) => {
    appRef.current = app;
    // Keep the scene's pointer interactions inside its own canvas.
    app.setGlobalEvents(false);
    // Let the first frame paint before freezing a reduced-motion preview.
    frameRef.current = requestAnimationFrame(() => {
      if (!activeRef.current) app.stop();
      setReady(true);
    });
  }, []);

  if (timedOut) throw new Error('The robot scene did not load in time.');

  return (
    <div className={className} data-ready={ready} data-active={active}>
      {!ready && <RobotPlaceholder message="Waking up your little co-pilot…" />}
      <Suspense fallback={null}>
        <Spline
          scene={scene}
          onLoad={onLoad}
          renderOnDemand
          className={styles.canvas}
          style={{ width: '100%', height: '100%', pointerEvents: active ? 'auto' : 'none' }}
        />
      </Suspense>
    </div>
  );
}

/** A lazy Spline embed with rendering and scene events paused together. */
export function SplineScene(props: SplineSceneProps) {
  const [attempt, setAttempt] = useState(0);

  return (
    <SceneBoundary
      key={`${props.scene}-${attempt}`}
      fallback={
        <div className={props.className}>
          <RobotPlaceholder message="The robot is taking a little break." />
          <button type="button" className={styles.retry} onClick={() => setAttempt((value) => value + 1)}>
            Try again
          </button>
        </div>
      }
    >
      <ScenePlayer {...props} />
    </SceneBoundary>
  );
}
