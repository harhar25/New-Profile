'use client';

import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Workflow } from 'lucide-react';
import GlyphPortal from '@/components/ui/GlyphPortal';
import type { Experience } from '@/lib/profileData';
import styles from './ExperienceSection.module.css';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const chapters = [...experiences].sort((a, b) => {
    const aYear = Number.parseInt(a.startDate, 10);
    const bYear = Number.parseInt(b.startDate, 10);
    return Number.isFinite(aYear) && Number.isFinite(bYear) ? aYear - bYear : 0;
  });

  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-title">
      <GlyphPortal
        word="BUILD"
        focusChar="B"
        scrollLength={2}
        contentId="experience-details"
        enterLabel="Skip to my experience"
        className={styles.portal}
        style={{ '--gp-paper': '#e8e2d8', '--gp-ink': '#34291f', '--gp-field': '#201b16', '--gp-foreground': '#f6eee2' }}
        front={<div className={styles.opening}>
          <div className={styles.openingTop}>
            <div><p className={styles.eyebrow}>Chapter V / Experience</p><p className={styles.openingTitle}>A technical foundation.<br />A builder&apos;s mindset.</p></div>
            <p className={styles.openingNote}>Every chapter connects what I&apos;ve learned<br />to the systems I build today.</p>
          </div>
          <div className={styles.openingBottom}><span>01 / The foundation</span><ArrowDownRight size={20} strokeWidth={1.2} aria-hidden="true" /><span>02 / Into practice</span></div>
        </div>}
        background={<div className={styles.field}>
          <div className={styles.fieldGrid} />
          <svg className={styles.connections} viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M-80 730H190Q290 730 290 630V460Q290 360 390 360H620Q720 360 720 260V-50" />
              <path d="M480 1060V760Q480 660 580 660H930Q1030 660 1030 560V210Q1030 110 1130 110H1500" />
              <path d="M-80 180H170Q270 180 270 280V460Q270 560 370 560H680Q780 560 780 660V1060" />
            </g>
            <g fill="currentColor"><circle cx="290" cy="460" r="6" /><circle cx="620" cy="360" r="6" /><circle cx="480" cy="760" r="6" /><circle cx="1030" cy="210" r="6" /><circle cx="780" cy="660" r="6" /></g>
          </svg>
          <span className={styles.fieldWord}>LEARN / CONNECT / BUILD</span>
        </div>}
      >
        <div className={styles.details}>
          <div className={styles.detailsHeading}>
            <div><p className={styles.eyebrow}>The chapters behind the work</p><h2 id="experience-title">Learn. Build.<br /><span>Keep evolving.</span></h2></div>
            <p>Every role sharpens how operational needs become practical, maintainable digital systems.</p>
          </div>
          <div className={styles.timeline}>
            {chapters.map((experience, index) => <article key={experience.id} className={styles.chapter} data-experience-id={experience.id}>
              <div className={styles.date}><span className={styles.marker} aria-hidden="true" /><p>{experience.startDate}</p><span>to {experience.current ? 'Present' : experience.endDate}</span></div>
              <div className={styles.chapterBody}>
                <div className={styles.chapterTop}><span>{experience.company}</span><span>{experience.current ? 'Current chapter' : `Chapter ${String(index + 1).padStart(2, '0')}`}</span></div>
                <h3>{experience.title}</h3>
                <p>{experience.description}</p>
              </div>
            </article>)}
          </div>
          <div className={styles.closing}><p><Workflow size={18} strokeWidth={1.4} aria-hidden="true" />Built to learn. Ready for what comes next.</p><Link href="/projects">See it in practice <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        </div>
      </GlyphPortal>
    </section>
  );
}
