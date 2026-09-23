'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import type { ProfileData } from '@/lib/profileData';

interface ProfileHeaderProps {
  profile: ProfileData;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { personalInfo } = profile;
  const categoryCount = new Set(profile.skills.map((skill) => skill.category)).size;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY, window.innerHeight);
        heroRef.current?.style.setProperty('--hero-offset', `${Math.round(offset * 0.22)}px`);
        heroRef.current?.style.setProperty('--hero-text-offset', `${Math.round(offset * 0.05)}px`);
        heroRef.current?.style.setProperty('--hero-fade', `${Math.max(0, 1 - offset / (window.innerHeight * 0.85))}`);
        frame = 0;
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <header id="about" ref={heroRef} className="privy-hero">
        <div className="privy-hero-glow" aria-hidden="true" />
        <div className="privy-hero-portrait" aria-hidden="true">
          <Image src="/uploads/harold-portrait-cutout-v2.png" alt="" fill preload sizes="(min-width: 900px) 58vw, 100vw" className="object-contain object-bottom" />
        </div>
        <div className="privy-hero-shade" aria-hidden="true" />
        <div className="privy-hero-content">
          <p className="eyebrow privy-hero-kicker">Harold Madjos&nbsp; / &nbsp;Automation & AI systems</p>
          <h1><span className="script-word">The art of</span><span className="privy-hero-title">MAKING<br />WORK FLOW</span></h1>
          <p className="privy-hero-copy">Thoughtfully designed systems for work that feels effortless.</p>
        </div>
        <div className="privy-hero-bottom">
          <a href="#chapter-one" className="hero-scroll-link"><span className="circle-arrow"><ArrowDown size={17} strokeWidth={1.2} /></span><span>Scroll to explore</span></a>
          <span className="hero-index">01 / 07 &nbsp;·&nbsp; Butuan City, Philippines</span>
        </div>
        <a href="#work" className="hero-feature-card" aria-label="Explore selected work">
          <Image src="/uploads/haroldExhibit.jpg" alt="" fill sizes="220px" className="object-cover object-center" />
          <span className="hero-feature-scrim" />
          <span className="hero-feature-top">Featured work</span>
          <span className="hero-feature-bottom">Explore the work <ArrowUpRight size={16} strokeWidth={1.2} /></span>
        </a>
      </header>

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
              <a href="#work" className="text-link">Discover selected work <ArrowUpRight size={16} strokeWidth={1.3} /></a>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
