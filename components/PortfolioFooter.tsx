'use client';

import Link from 'next/link';
import { ArrowUp, ArrowUpRight, BriefcaseBusiness, Code, Heart, Pause, Play, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { defaultProfileData } from '@/lib/profileData';
import { usePortfolio } from './PortfolioShell';
import EmailReveal from './EmailReveal';
import useFooterMotion from './useFooterMotion';
import styles from './PortfolioFooter.module.css';

const disciplines = ['Connected systems', 'Automation', 'AI workflows', 'CRM journeys', 'Ideas into action'];
const pages = [['Home', '/#about'], ['Projects', '/projects'], ['Skills', '/skills'], ['Playground', '/automation']] as const;

/** Portfolio adaptation of the owner-supplied CinematicFooter design. */
export default function PortfolioFooter() {
  const { profile, openContact, contactOpen, menuOpen } = usePortfolio();
  const { personalInfo, socialLinks } = profile;
  const [paused, setPaused] = useState(false);
  const { wrapperRef, panelRef, reducedMotion } = useFooterMotion(paused, contactOpen || menuOpen);
  const linkedin = socialLinks.linkedin?.trim() || defaultProfileData.socialLinks.linkedin;
  const github = socialLinks.github?.trim() || defaultProfileData.socialLinks.github;
  const name = personalInfo.fullName.trim().split(/\s+/);
  const firstName = name[0];
  const wordmark = name.at(-1) || 'MADJOS';

  return (
    <footer id="contact" ref={wrapperRef} className={styles.wrapper} role="contentinfo" data-footer-theme="dark" data-paused={paused} aria-labelledby="footer-title">
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.atmosphere} aria-hidden="true"><div className={styles.aurora} /><div className={styles.grid} /><div className={styles.horizon} /></div>
        <div className={styles.wordmark} aria-hidden="true">{wordmark}</div>
        <div className={styles.marquee} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            {[0, 1].map(copy => <div key={copy} className={styles.marqueeGroup}>{disciplines.map(item => <span key={item}>{item}<span className={styles.star}>✦</span></span>)}</div>)}
          </div>
        </div>
        <div className={styles.main}>
          <p className={styles.eyebrow}><Sparkles size={13} strokeWidth={1.4} aria-hidden="true" />Let&apos;s connect / Contact</p>
          <h2 id="footer-title" className={styles.title}>Ready for a<br /><span>clearer workflow?</span></h2>
          <p className={styles.description}>Have a workflow that feels harder than it should?<br /> Let&apos;s shape a clearer way forward.</p>
          <div className={styles.actions}>
            <button type="button" onClick={openContact} aria-haspopup="dialog" className={styles.primary} data-footer-magnetic>Start a conversation <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" /></button>
            <Link href="/projects" className={styles.projectLink} data-footer-magnetic>Explore my work <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" /></Link>
          </div>
          <nav className={styles.socials} aria-label="Social links">
            <a className={styles.socialLink} href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" data-footer-magnetic><BriefcaseBusiness size={15} aria-hidden="true" /> LinkedIn</a>
            <a className={styles.socialLink} href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" data-footer-magnetic><Code size={15} aria-hidden="true" /> GitHub</a>
            <EmailReveal email={personalInfo.email} />
          </nav>
        </div>
        <div className={styles.details}>
          <div><p className={styles.label}>Based in</p><p>{personalInfo.location}</p></div>
          <div><p className={styles.label}>Email</p><p className={styles.emailText}>{personalInfo.email}</p></div>
          <div><p className={styles.label}>Phone</p><p>{personalInfo.phone || 'Available on request'}</p></div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.copyright}><p>© {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.</p><nav aria-label="Footer navigation">{pages.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav></div>
          <p className={styles.signature}>Built with <Heart size={12} fill="currentColor" aria-hidden="true" /><span>by {firstName}</span></p>
          <div className={styles.controls}>
            <button type="button" onClick={() => setPaused(value => !value)} className={styles.motionButton} aria-pressed={paused} disabled={reducedMotion} aria-label={reducedMotion ? 'Footer motion disabled by reduced-motion preference' : paused ? 'Play footer animation' : 'Pause footer animation'}>{reducedMotion || paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}<span>{reducedMotion ? 'Still' : paused ? 'Play' : 'Pause'}</span></button>
            <button type="button" className={styles.toTop} aria-label="Back to top" data-footer-magnetic onClick={() => { document.querySelector<HTMLElement>('[data-nav-key="home"]')?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' }); }}><ArrowUp size={19} strokeWidth={1.5} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </footer>
  );
}
