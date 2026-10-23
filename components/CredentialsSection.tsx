'use client';

import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, BookOpen } from 'lucide-react';
import GlyphPortal from '@/components/ui/GlyphPortal';
import type { ProfileData } from '@/lib/profileData';
import styles from './CredentialsSection.module.css';

export default function CredentialsSection({ certifications }: { certifications: ProfileData['certifications'] }) {
  if (!certifications.length) return null;

  return (
    <section id="credentials" className={styles.section} aria-labelledby="credentials-title">
      <GlyphPortal
        word="LEARN"
        focusChar="R"
        scrollLength={2}
        contentId="credentials-details"
        enterLabel="Skip to my credentials"
        className={styles.portal}
        style={{ '--gp-paper': '#ebe9e2', '--gp-ink': '#29362f', '--gp-field': '#18221e', '--gp-foreground': '#f4f0e6' }}
        front={
          <div className={styles.opening}>
            <div className={styles.openingTop}>
              <div>
                <p className={styles.eyebrow}>Credentials / Continuous learning</p>
                <p className={styles.openingTitle}>A foundation.<br />A habit of learning.</p>
              </div>
              <p className={styles.openingNote}>What I learn shapes what I build.<br />The work keeps the learning going.</p>
            </div>
            <div className={styles.openingBottom}>
              <span>01 / The foundations</span><ArrowDownRight size={20} strokeWidth={1.2} aria-hidden="true" /><span>02 / Into practice</span>
            </div>
          </div>
        }
        background={
          <div className={styles.field}>
            <svg className={styles.pages} viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="1030" cy="320" r="470" /><circle cx="1030" cy="320" r="350" /><circle cx="1030" cy="320" r="230" />
                <path d="M-80 760H210Q330 760 330 640V240Q525 220 720 330Q915 220 1110 240V640Q915 620 720 730Q525 620 330 640M720 330V730" />
                <path d="M360 270Q540 265 690 355M360 300Q540 295 690 385M750 355Q900 265 1080 270M750 385Q900 295 1080 300M720 730V1080" />
              </g>
              <g fill="currentColor"><circle cx="330" cy="640" r="5" /><circle cx="720" cy="330" r="5" /><circle cx="1110" cy="640" r="5" /></g>
            </svg>
            <span className={styles.fieldWord}>CURIOSITY / PRACTICE / PROGRESS</span>
          </div>
        }
      >
        <div className={styles.details}>
          <div className={styles.detailsHeading}>
            <div>
              <p className={styles.eyebrow}>Foundations &amp; continued practice</p>
              <h2 id="credentials-title">Learning that supports<br /><span>real delivery.</span></h2>
            </div>
            <p>Formal foundations and hands-on practice, applied where systems meet real operational needs.</p>
          </div>
          <div className={styles.credentials}>
            {certifications.map((certification, index) => (
              <article key={`${certification.name}-${certification.date}-${index}`} className={styles.credential} data-credential-index={index}>
                <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div className={styles.credentialBody}>
                  <h3>{certification.name}</h3>
                  <p>{certification.issuer}</p>
                </div>
                <p className={styles.date}>{certification.date}</p>
              </article>
            ))}
          </div>
          <div className={styles.closing}>
            <p><BookOpen size={18} strokeWidth={1.4} aria-hidden="true" />Always learning. Always applying.</p>
            <Link href="/skills">Explore my skills <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </GlyphPortal>
    </section>
  );
}
