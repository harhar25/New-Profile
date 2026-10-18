'use client';

import Image from 'next/image';
import { useId, useMemo } from 'react';
import styles from './ImageStream.module.css';

export type StreamImage = { src: string; alt: string; position?: string };

// Corridor geometry adapted from the code supplied by the portfolio owner.
// Geometric apparent sizes keep consecutive cards overlapping at every depth.
function corridorFrames(direction: 1 | -1, name: string) {
  const steps = Array.from({ length: 25 }, (_, index) => {
    const progress = index / 24;
    const scale = (2.6 / 20) * Math.pow(46 / 2.6, progress);
    const depth = 30 * (1 - 1 / scale);
    const rail = 44 - 55 * Math.pow(1 - progress, 3.3);
    const turn = 6 + 22 * progress;
    return `${(progress * 100).toFixed(2)}%{transform:translate3d(${(direction * rail).toFixed(2)}cqw,0,${depth.toFixed(2)}cqw) rotateY(${(-direction * turn).toFixed(2)}deg)}`;
  });
  return `@keyframes ${name}{${steps.join('')}}`;
}

export default function ImageStream({ images, running }: { images: StreamImage[]; running: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const right = `corridorRight${id}`;
  const left = `corridorLeft${id}`;
  const frames = useMemo(() => corridorFrames(1, right) + corridorFrames(-1, left), [right, left]);
  const cardCount = Math.max(10, images.length);
  if (!images.length) return null;

  return (
    <div className={styles.stream} aria-hidden="true" data-running={running}>
      <style>{frames}</style>
      <div className={styles.perspective}>
        <div className={styles.rails}>
          {[right, left].map((name) => Array.from({ length: cardCount }, (_, index) => {
            const image = images[index % images.length];
            return (
              <div key={`${name}-${index}`} className={styles.card} style={{ animationName: name, animationDelay: `${-(index * 24) / cardCount}s` }}>
                <Image src={image.src} alt="" fill sizes="(max-width: 640px) 65vw, 40vw" className={styles.image} style={{ objectPosition: image.position ?? 'center' }} draggable={false} />
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
