'use client';

import { Fragment, useEffect, useRef } from 'react';
import { ArrowDown, Layers3 } from 'lucide-react';
import AutomationCallout from './AutomationCallout';
import type { Skill } from '@/lib/profileData';
import SystemIllustration from './SystemIllustration';
import styles from './FeatureBlocks.module.css';
import showcase from './SkillsShowcase.module.css';
const categoryDescriptions: Record<string, string> = {
  'GHL Automation': 'CRM journeys, pipelines, calendars, and messaging built to convert.',
  Automation: 'Routing, scoring, alerts, and logic that keep teams moving.',
  'Web Setup': 'Conversion-focused pages and web experiences across GHL and WordPress.',
  SEO: 'Repeatable local visibility workflows, reviews, content, and rank reporting.',
  Integrations: 'APIs, webhooks, and data flows connecting the tools teams rely on.',
  'AI & Apps': 'AI-assisted workflows and operational apps with useful, governed outputs.',
  'QA & Ops': 'Testing, monitoring, and access checks that keep systems dependable.',
  Reporting: 'Decision-ready dashboards that turn operational data into clear signals.',
  Support: 'Practical troubleshooting across automations, apps, and user access.',
  Operations: 'Clear SOPs, updates, and reporting that make delivery repeatable.',
  'Core Strengths': 'Engineering judgment, systems thinking, and a bias toward learning.',
};

const chapterDefinitions = [
  { id: 'automation', title: 'Automation & CRM', categories: ['GHL Automation', 'Automation'] },
  { id: 'connections', title: 'Web & Connections', categories: ['Web Setup', 'SEO', 'Integrations'] },
  { id: 'intelligence', title: 'AI & Reporting', categories: ['AI & Apps', 'QA & Ops', 'Reporting'] },
  { id: 'delivery', title: 'Support & Delivery', categories: ['Support', 'Operations', 'Core Strengths'] },
];

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const stack = useRef<HTMLDivElement>(null);
  const groups = Object.entries(skills.reduce((result, skill) => {
    (result[skill.category] ??= []).push(skill);
    return result;
  }, {} as Record<string, Skill[]>));
  const assigned = new Set(chapterDefinitions.flatMap(chapter => chapter.categories));
  const additional = groups.filter(([category]) => !assigned.has(category));
  const definitions = [...chapterDefinitions];
  for (let index = 0; index < additional.length; index += 3) {
    definitions.push({ id: `more-${index / 3 + 1}`, title: 'More Capabilities', categories: additional.slice(index, index + 3).map(([category]) => category) });
  }
  const chapters = definitions.map(chapter => ({ ...chapter, groups: chapter.categories.flatMap(category => {
    const group = groups.find(([name]) => name === category);
    return group ? [group] : [];
  }) })).filter(chapter => chapter.groups.length > 0);

  useEffect(() => {
    const element = stack.current;
    if (!element) return;
    const panels = [...element.querySelectorAll<HTMLElement>('[data-skill-chapter]')];
    const measure = () => {
      const navigationHeight = document.querySelector('.site-nav')?.getBoundingClientRect().height ?? 100;
      element.style.setProperty('--skills-nav-offset', `${navigationHeight}px`);
      for (const panel of panels) {
        // A tall chapter scrolls all the way through before its bottom pins.
        // This keeps long skill lists readable at small sizes and browser zoom.
        const top = Math.min(navigationHeight + 16, window.innerHeight - panel.offsetHeight - 20);
        panel.style.setProperty('--chapter-top', `${top}px`);
      }
    };
    const observer = new ResizeObserver(measure);
    panels.forEach(panel => observer.observe(panel));
    const navigation = document.querySelector('.site-nav');
    if (navigation) observer.observe(navigation);
    measure();
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [skills]);

  return (
    <section id="expertise" className={`${styles.section} ${styles.light} ${showcase.showcase}`}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div><p className={styles.eyebrow}>The toolkit / {groups.length} disciplines</p><h2>Different tools.<br />One connected approach.</h2></div>
          <p>{skills.length} capabilities across automation, web experiences, integrations, and reliable operations.</p>
        </div>
        <div className={showcase.guide}>
          <p><Layers3 size={15} aria-hidden="true" /> {chapters.length} chapters. Scroll to uncover the next.</p>
          <nav className={showcase.chapterLinks} aria-label="Skills chapters">
            {chapters.map((chapter, index) => <a key={chapter.id} href={`#skills-${chapter.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{chapter.title}<ArrowDown size={13} aria-hidden="true" /></a>)}
          </nav>
        </div>
        <div ref={stack} className={showcase.stack}>
          {chapters.map((chapter, chapterIndex) => <Fragment key={chapter.id}>
            <div id={`skills-${chapter.id}`} className={showcase.chapterAnchor} />
            <section className={showcase.chapter} data-skill-chapter={chapter.id} aria-labelledby={`skills-${chapter.id}-title`} style={{ zIndex: chapterIndex + 1 }}>
              <header className={showcase.chapterHeader}>
                <p className={showcase.chapterNumber}>{String(chapterIndex + 1).padStart(2, '0')} <span>/ {String(chapters.length).padStart(2, '0')}</span></p>
                <h3 id={`skills-${chapter.id}-title`}>{chapter.title}</h3>
                <p className={showcase.chapterCount}>{chapter.groups.reduce((total, [, items]) => total + items.length, 0)} capabilities</p>
              </header>
              <div className={`${showcase.cards} ${chapter.groups.length === 2 ? showcase.twoColumns : ''}`}>
                {chapter.groups.map(([category, categorySkills]) => {
                  const index = groups.findIndex(([name]) => name === category);
                  return <article key={category} className={`${styles.card} ${showcase.skillCard}`} data-skill-category={category}>
                    <div className={`${styles.visual} ${showcase.visual}`}><SystemIllustration index={index + 1} /></div>
                    <div className={`${styles.content} ${showcase.content}`}>
                      <span className={styles.number}>{String(index + 1).padStart(2, '0')} / {categorySkills.length} capabilities</span>
                      <h4>{category}</h4>
                      <p className={styles.description}>{categoryDescriptions[category] ?? 'Tools and practices for dependable digital delivery.'}</p>
                      <ul className={`${styles.skillList} ${showcase.skillList}`}>{categorySkills.map(skill => <li key={skill.id} data-skill-id={skill.id}><span>{skill.name}</span><small>{skill.proficiency}</small></li>)}</ul>
                    </div>
                  </article>;
                })}
              </div>
              <p className={showcase.nextChapter}><span>{chapterIndex < chapters.length - 1 ? `Up next / ${chapters[chapterIndex + 1].title}` : 'The toolkit, ready to put to work.'}</span><ArrowDown size={15} aria-hidden="true" /></p>
            </section>
          </Fragment>)}
        </div>
        <div className={showcase.afterShowcase}>
          <AutomationCallout title="Put the toolkit in motion." description="Connect a few nodes and run your first sample workflow." />
        </div>
      </div>
    </section>
  );
}
