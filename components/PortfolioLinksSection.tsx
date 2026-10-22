'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { usePortfolio } from './PortfolioShell';
import PortfolioFolder, { type FolderPreview } from './ui/PortfolioFolder';
import styles from './PortfolioLinksSection.module.css';

const projectFiles: FolderPreview[] = [
  { title: 'AI editorial pipeline', meta: 'n8n / Human review', href: '/projects#work', image: '/uploads/blog-workflow-editor.png' },
  { title: 'Connected automations', meta: 'Make / AI / Integrations', href: '/projects#project-gallery', image: '/uploads/Screenshot%202026-08-06%20022827.png' },
  { title: 'Websites & experiences', meta: 'A closer look at the work', href: '/projects#project-gallery', image: '/uploads/Screenshot%202026-08-06%20030907.png' },
];

const skillChapters = [
  { title: 'Automation & CRM', id: 'automation', categories: ['GHL Automation', 'Automation'] },
  { title: 'Web & connections', id: 'connections', categories: ['Web Setup', 'SEO', 'Integrations'] },
  { title: 'AI & reporting', id: 'intelligence', categories: ['AI & Apps', 'QA & Ops', 'Reporting'] },
];

export default function PortfolioLinksSection() {
  const { profile } = usePortfolio();
  const skillFiles: FolderPreview[] = skillChapters.map((chapter) => {
    const skills = profile.skills.filter((skill) => chapter.categories.includes(skill.category));
    return {
      title: chapter.title,
      href: `/skills#skills-${chapter.id}`,
      meta: `${skills.length} capabilities`,
      items: skills.slice(0, 3).map((skill) => skill.name),
    };
  });

  return (
    <section id="explore" className={styles.section} aria-labelledby="explore-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div><p className={styles.eyebrow}>Explore the portfolio</p><h2 id="explore-title">The work.<br />The know-how.</h2></div>
          <p>Take a closer look at the systems I build<br />and the skills that bring them together.</p>
        </div>
        <div className={styles.grid}>
          <article className={styles.card} aria-labelledby="projects-folder-title">
            <div className={styles.cardTop}><span>01 / Selected systems</span><span>Built with purpose</span></div>
            <PortfolioFolder label="Projects" meta="Workflows, websites & connected systems" tone="projects" files={projectFiles} />
            <div className={styles.cardBottom}>
              <Link href="/projects" className={styles.destination}><h3 id="projects-folder-title">Projects</h3><span className={styles.routeArrow}><ArrowUpRight size={24} strokeWidth={1.3} aria-hidden="true" /></span></Link>
              <p>Automation, integrations, and AI in practice.</p>
              <Link href="/projects" className={styles.action}>View all projects <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </div>
          </article>
          <article className={styles.card} aria-labelledby="skills-folder-title">
            <div className={styles.cardTop}><span>02 / Tools &amp; disciplines</span><span>Always connecting</span></div>
            <PortfolioFolder label="Skills" meta={`${profile.skills.length} capabilities / One connected toolkit`} tone="skills" files={skillFiles} />
            <div className={styles.cardBottom}>
              <Link href="/skills" className={styles.destination}><h3 id="skills-folder-title">Skills</h3><span className={styles.routeArrow}><ArrowUpRight size={24} strokeWidth={1.3} aria-hidden="true" /></span></Link>
              <p>A connected toolkit, from CRM to reporting.</p>
              <Link href="/skills" className={styles.action}>Explore all skills <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
