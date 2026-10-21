import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Skill } from '@/lib/profileData';
import SystemIllustration from './SystemIllustration';
import styles from './FeatureBlocks.module.css';
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

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const groups = Object.entries(skills.reduce((result, skill) => {
    (result[skill.category] ??= []).push(skill);
    return result;
  }, {} as Record<string, Skill[]>));
  return (
    <section id="expertise" className={`${styles.section} ${styles.light}`}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div><p className={styles.eyebrow}>The toolkit / {groups.length} disciplines</p><h2>Different tools.<br />One connected approach.</h2></div>
          <p>{skills.length} capabilities across automation, web experiences, integrations, and reliable operations.</p>
        </div>
        <div className={styles.grid}>
          {groups.map(([category, categorySkills], index) => (
            <article key={category} className={styles.card}>
              <div className={styles.visual}><SystemIllustration index={index + 1} /></div>
              <div className={styles.content}>
                <span className={styles.number}>{String(index + 1).padStart(2, '0')} / {categorySkills.length} capabilities</span>
                <h3>{category}</h3>
                <p className={styles.description}>{categoryDescriptions[category] ?? 'Tools and practices for dependable digital delivery.'}</p>
                <ul className={styles.skillList}>{categorySkills.map(skill => <li key={skill.id}><span>{skill.name}</span><small>{skill.proficiency}</small></li>)}</ul>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.callout}><div><strong>Explore the thinking behind the toolkit.</strong><p>Connect a few nodes and run your first sample workflow.</p></div><Link href="/automation">Try an automation <ArrowUpRight size={16} /></Link></div>
      </div>
    </section>
  );
}