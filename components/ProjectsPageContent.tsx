'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '@/components/PortfolioShell';
import ProjectsSection from '@/components/ProjectsSection';
import styles from '@/components/PortfolioPages.module.css';

export default function ProjectsPageContent() {
  const { profile } = usePortfolio();

  return (
    <div className={`${styles.route} ${styles.dark}`}>
      <header className={styles.intro}>
        <div className={styles.container}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <ol>
              <li><Link href="/#chapter-one">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><span aria-current="page">Projects</span></li>
            </ol>
          </nav>

          <div className={styles.introGrid}>
            <div>
              <p className={styles.eyebrow}>Selected work / Automation &amp; AI</p>
              <h1 className={styles.title}>Projects</h1>
            </div>
            <div className={styles.summary}>
              <p>Systems that connect the moving parts. Explore the work, the thinking behind it, and a workflow you can make your own.</p>
              <Link href="/skills" className={styles.nextPage}>
                Explore my skills <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className={styles.introFooter}>
            <Link href="/#chapter-one" className={styles.homeLink}>
              <ArrowLeft size={14} aria-hidden="true" /> Back to the introduction
            </Link>
            <a href="#work" className={styles.sectionLink}>Discover the work <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </header>

      <ProjectsSection projects={profile.projects} />
    </div>
  );
}
