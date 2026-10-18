import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import type { ProfileData } from '@/lib/profileData';

export default function IntroductionSection({ profile }: { profile: ProfileData }) {
  const { personalInfo } = profile;
  const categoryCount = new Set(profile.skills.map((skill) => skill.category)).size;
  return (
    <section id="chapter-one" className="intro-section">
      <div className="page-shell intro-shell">
        <ScrollReveal className="intro-heading-wrap">
          <p className="eyebrow">01 &nbsp;/&nbsp; The introduction</p>
          <h2 className="intro-heading">A practice shaped<br />by <em>precision.</em></h2>
        </ScrollReveal>
        <div className="intro-grid">
          <ScrollReveal className="intro-photo-wrap">
            <div className="intro-photo">
              <Image src="/uploads/harold-portrait-cutout-v2.png" alt="Portrait of Harold Madjos" fill sizes="(min-width: 900px) 42vw, 100vw" className="object-contain object-bottom" />
              <span className="intro-photo-label">HM / 2026</span>
            </div>
          </ScrollReveal>
          <ScrollReveal className="intro-text-wrap">
            <span className="script-word intro-script">Behind the work</span>
            <p className="intro-lead">Complex work deserves<br />a clearer way forward.</p>
            <p className="intro-bio">{personalInfo.bio}</p>
            <div className="intro-rule" />
            <dl className="intro-stats">
              <div><dd>{String(profile.skills.length).padStart(2, '0')}</dd><dt>Capabilities</dt></div>
              <div><dd>{String(categoryCount).padStart(2, '0')}</dd><dt>Disciplines</dt></div>
              <div><dd>24/7</dd><dt>Systems in motion</dt></div>
            </dl>
            <Link href="/projects" className="text-link">Discover selected work <ArrowUpRight size={16} strokeWidth={1.3} /></Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

