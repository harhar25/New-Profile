'use client';

import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import InfiniteGallery, { type GalleryImage } from '@/components/ui/3d-gallery-photography';

const galleryImages: GalleryImage[] = [
  {
    src: '/uploads/haroldExhibit.jpg',
    alt: 'Harold Madjos at the ACLC College of Butuan Project Exhibit 2025',
  },
  {
    src: '/uploads/harold-graduation-portrait-1.jpg',
    alt: 'Graduation portrait of Harold Madjos',
  },
  {
    src: '/uploads/harold-portrait-cutout-v2.png',
    alt: 'Harold Madjos wearing formal Filipino attire',
  },
  {
    src: '/uploads/a%20man%20in%20a%20formal%20su.png',
    alt: 'Formal portrait of Harold Madjos',
  },
  {
    src: '/uploads/harold-graduation-portrait-2.jpg',
    alt: 'Studio portrait of Harold Madjos in formal Filipino attire',
  },
];

export default function PortfolioMoments() {
  const [paused, setPaused] = useState(false);

  return (
    <section id="story" className="gallery-chapter" aria-labelledby="gallery-title">
      <InfiniteGallery
        images={galleryImages}
        speed={1.2}
        zSpacing={3}
        visibleCount={10}
        falloff={{ near: 0.8, far: 14 }}
        paused={paused}
        describedBy="gallery-instructions"
        className="gallery-canvas"
      />

      <div className="gallery-vignette" aria-hidden="true" />
      <div className="gallery-heading pointer-events-none">
        <p className="eyebrow">06 &nbsp;/&nbsp; Beyond the systems</p>
        <h2 id="gallery-title">
          <span className="script-word">Selected</span>
          <span>Moments in motion</span>
        </h2>
        <p>Curiosity, craft, and the people behind every system.</p>
      </div>

      <div className="gallery-meta">
        <p id="gallery-instructions">
          Use the mouse wheel, arrow keys, or touch to navigate
          <span>Autoplay resumes after 3 seconds of inactivity</span>
        </p>
        <button type="button" className="gallery-pause" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>
          {paused ? <Play size={14} strokeWidth={1.5} /> : <Pause size={14} strokeWidth={1.5} />}
          {paused ? 'Play gallery' : 'Pause gallery'}
        </button>
      </div>
    </section>
  );
}
