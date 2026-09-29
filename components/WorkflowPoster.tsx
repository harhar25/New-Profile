'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface WorkflowPosterProps {
  fullName: string;
  location: string;
  title: string;
}

const posterTitle = 'SYSTEMS';

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export default function WorkflowPoster({ fullName, location, title }: WorkflowPosterProps) {
  const trackRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const updateProgress = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const scrollable = track.offsetHeight - window.innerHeight;
        const nextProgress =
          scrollable > 0
            ? clamp01(-track.getBoundingClientRect().top / scrollable)
            : 1;
        setProgress(nextProgress);
        frame = 0;
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  const visibleProgress = reducedMotion ? 1 : progress;
  const titleProgress = clamp01(visibleProgress / 0.4);
  const copyProgress = clamp01((visibleProgress - 0.78) / 0.22);
  const copyOffset = `${(1 - copyProgress) * 100}%`;

  return (
    <section
      id="approach"
      ref={trackRef}
      className={`workflow-poster-track${reducedMotion ? ' is-static' : ''}`}
      aria-labelledby="workflow-poster-title"
      style={{ height: reducedMotion ? 'auto' : '230svh' }}
    >
      <div className="workflow-poster-pin">
        <article className="workflow-poster-card">
          <div className="workflow-poster-visual">
            <div className="workflow-poster-grid" aria-hidden="true" />
            <Image
              src="/uploads/harold-portrait-cutout-v2.png"
              alt={`${fullName} wearing formal Filipino attire`}
              fill
              sizes="(min-width: 900px) 58vw, 92vw"
              className="workflow-poster-portrait"
              draggable={false}
            />
            <div className="workflow-poster-shade" aria-hidden="true" />

            <p className="workflow-poster-kicker">02 / THE APPROACH</p>
            <h2 id="workflow-poster-title" className="workflow-poster-title" aria-label={posterTitle}>
              {Array.from(posterTitle).map((character, index) => {
                const midpoint = (posterTitle.length - 1) / 2;
                const distance = Math.abs(index - midpoint) / midpoint;
                const start = distance * 0.55;
                const reveal = clamp01((titleProgress - start) / 0.38);
                const side = index < posterTitle.length / 2 ? 1 : -1;
                const offsetX = (1 - reveal) * distance * 16 * side;
                const offsetY = (1 - reveal) * (18 + distance * 24);

                return (
                  <span
                    key={`${index}-${character}`}
                    aria-hidden="true"
                    style={{
                      opacity: reveal,
                      transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
                    }}
                  >
                    {character}
                  </span>
                );
              })}
            </h2>
            <p className="workflow-poster-location">{location}</p>
          </div>

          <div
            className="workflow-poster-copy-viewport"
            style={{ transform: `translate3d(0, ${copyOffset}, 0)` }}
          >
            <div className="workflow-poster-copy">
              <div className="workflow-poster-keywords" aria-label="Areas of focus">
                <span>Automate</span>
                <span>Connect</span>
                <span>Improve</span>
              </div>
              <h3>Less friction. More room to move.</h3>
              <p>
                I connect CRM, automation, AI, and reporting into dependable systems that
                help teams move with clarity.
              </p>
              <p className="workflow-poster-subheadline">
                Built around the way people actually work.
              </p>
              <div className="workflow-poster-footer">
                <span>{fullName}</span>
                <span>{title}</span>
                <span>{location}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
