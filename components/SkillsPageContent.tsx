'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '@/components/PortfolioShell';
import SkillsSection from '@/components/SkillsSection';
import styles from '@/components/PortfolioPages.module.css';

export default function SkillsPageContent() {
  const { profile } = usePortfolio();

  return (
    <div className={`${styles.route} ${styles.light}`}>
      <header className={styles.intro}>
        <div className={styles.container}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <ol>
              <li><Link href="/#chapter-one">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><span aria-current="page">Skills</span></li>
            </ol>
          </nav>

          <div className={styles.introGrid}>
            <div>
              <p className={styles.eyebrow}>Capabilities / A connected toolkit</p>
              <h1 className={styles.title}>Skills</h1>
            </div>
            <div className={styles.summary}>
              <p>From the first trigger to the final report. Explore the tools and practices I use to build clear, dependable digital operations.</p>
              <Link href="/projects" className={styles.nextPage}>
                See the projects <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className={styles.introFooter}>
            <Link href="/#chapter-one" className={styles.homeLink}>
              <ArrowLeft size={14} aria-hidden="true" /> Back to the introduction
            </Link>
            <a href="#expertise" className={styles.sectionLink}>Explore the toolkit <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </header>

      <SkillsSection skills={profile.skills} />
    </div>
  );
}
