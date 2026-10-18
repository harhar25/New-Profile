import Link from 'next/link';
import { ArrowUpRight, Layers3, Workflow } from 'lucide-react';
import styles from './PortfolioLinksSection.module.css';

export default function PortfolioLinksSection() {
  return (
    <section id="explore" className={styles.section} aria-labelledby="explore-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div><p className={styles.eyebrow}>Explore the portfolio</p><h2 id="explore-title">The work.<br />The know-how.</h2></div>
          <p>Take a closer look at the systems I build<br />and the skills that bring them together.</p>
        </div>
        <div className={styles.grid}>
          <Link href="/projects" className={`${styles.card} ${styles.projects}`}>
            <div className={styles.cardTop}><span>01 / Selected systems</span><ArrowUpRight size={21} strokeWidth={1.4} /></div>
            <div className={styles.visual} aria-hidden="true"><Workflow size={92} strokeWidth={.65} /><span className={styles.visualWord}>BUILD</span></div>
            <div className={styles.cardBottom}><h3>Projects</h3><p>Automation, integrations, and AI in practice.</p><span className={styles.action}>View projects <ArrowUpRight size={15} /></span></div>
          </Link>
          <Link href="/skills" className={`${styles.card} ${styles.skills}`}>
            <div className={styles.cardTop}><span>02 / Tools &amp; disciplines</span><ArrowUpRight size={21} strokeWidth={1.4} /></div>
            <div className={styles.visual} aria-hidden="true"><Layers3 size={92} strokeWidth={.65} /><span className={styles.visualWord}>CRAFT</span></div>
            <div className={styles.cardBottom}><h3>Skills</h3><p>A connected toolkit, from CRM to reporting.</p><span className={styles.action}>Explore skills <ArrowUpRight size={15} /></span></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
