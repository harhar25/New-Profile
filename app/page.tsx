'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, Code, LogIn, Mail, Menu, X } from 'lucide-react';
import { defaultProfileData, type ProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import ExperienceSection from '@/components/ExperienceSection';
import PortfolioMoments from '@/components/PortfolioMoments';
import ProfileHeader from '@/components/ProfileHeader';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';

const conversationUrl = 'https://form.jotform.com/haroldjeymadjos/start-a-conversation';

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
  const [showAdmin, setShowAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const profileTimer = window.setTimeout(() => setProfile(profileStorage.getProfile()), 0);
    return () => window.clearTimeout(profileTimer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === 'h') setShowAdmin((visible) => !visible);
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { personalInfo, socialLinks, certifications } = profile;

  return (
    <main className="luxury-site min-h-screen overflow-hidden">
      <nav className={`site-nav fixed inset-x-0 top-0 z-50 text-white ${navScrolled || menuOpen ? 'is-scrolled' : ''}`} aria-label="Main navigation">
        <div className="site-nav-inner relative flex h-[86px] items-center justify-between sm:h-[100px]">
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="site-menu" className="nav-menu-button flex items-center gap-3 text-[11px] font-medium">
            {menuOpen ? <X size={21} strokeWidth={1.4} /> : <Menu size={21} strokeWidth={1.4} />}
            <span>{menuOpen ? 'Close' : 'Menu'}</span>
          </button>
          <a href="#about" onClick={() => setMenuOpen(false)} aria-label="Harold Madjos, back to top" className="brand-mark absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">HM</a>
          <a href="#contact" onClick={() => setMenuOpen(false)} className="nav-contact inline-flex items-center gap-2 text-[11px] font-medium"><span className="hidden sm:inline">Get in touch</span><span className="sm:hidden">Contact</span><ArrowUpRight size={14} strokeWidth={1.4} /></a>
        </div>
      </nav>
      <div id="site-menu" className={`site-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="site-menu-inner">
          <p className="eyebrow text-white/40">Explore / Harold Madjos</p>
          {[
            ['01', 'The introduction', '#chapter-one'],
            ['02', 'Selected work', '#work'],
            ['03', 'Expertise', '#expertise'],
            ['04', 'Experience', '#experience'],
            ['05', 'Get in touch', '#contact'],
          ].map(([number, label, href]) => (
            <a key={href} href={href} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)} className="site-menu-link"><span>{number}</span>{label}<ArrowUpRight size={23} strokeWidth={1} /></a>
          ))}
          <p className="mt-10 text-xs text-white/40">Independent automation & AI systems specialist · Butuan City, Philippines</p>
        </div>
      </div>

      <ProfileHeader profile={profile} />
      <ProjectsSection projects={profile.projects} />
      <SkillsSection skills={profile.skills} />
      <ExperienceSection experiences={profile.experiences} />
      <PortfolioMoments />

      {certifications.length > 0 && (
        <section id="credentials" className="bg-[#050505] px-5 py-24 text-[#f1f0eb] sm:px-8 lg:px-12 lg:py-36">
          <div className="page-shell">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-2">
                <p className="chapter-label text-white/40">Chapter VI / Credentials</p>
              </div>
              <div className="lg:col-span-7">
                <h2 className="editorial-heading max-w-[9ch] font-light uppercase">
                  Learning that
                  <span className="block">supports</span>
                  <span className="block">real delivery.</span>
                </h2>
              </div>
              <div className="flex items-end lg:col-span-3 lg:pb-3">
                <p className="max-w-xs text-sm leading-6 text-white/50">Formal foundations and hands-on practice, applied where systems meet real operational needs.</p>
              </div>
            </div>

            <div className="mt-20 border-t border-white/20 lg:mt-32">
              {certifications.map((certification, index) => (
                <article key={`${certification.name}-${certification.date}`} className="grid gap-6 border-b border-white/20 py-9 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-10 lg:py-11">
                  <span className="font-mono text-[10px] text-[#d7ff4f]">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-3xl font-light uppercase leading-none tracking-[-0.045em] sm:text-4xl">{certification.name}</h3>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.13em] text-white/35">{certification.issuer}</p>
                  </div>
                  <p className="text-sm font-light uppercase text-white/55">{certification.date}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer id="contact" className="bg-[#eceae4] px-5 pb-8 pt-24 text-[#0a0a0a] sm:px-8 lg:px-12 lg:pt-36">
        <div className="page-shell">
          <p className="chapter-label text-black/45">Chapter VII / Contact</p>
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-end">
            <h2 className="editorial-heading max-w-[11ch] font-light uppercase lg:col-span-9">
              Better systems
              <span className="block">start with a</span>
              <span className="block">conversation.</span>
            </h2>
            <div className="lg:col-span-3 lg:pb-3">
              <p className="text-sm leading-6 text-black/50">Have a workflow that feels harder than it should? Let&apos;s shape a clearer way forward.</p>
              <a
                href={conversationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#d7ff4f] hover:text-black"
              >
                Start a conversation
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div className="mt-24 grid gap-8 border-y border-black/20 py-7 text-sm sm:grid-cols-2 lg:mt-36 lg:grid-cols-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-black/35">Based in</p>
              <p className="mt-2">{personalInfo.location}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-black/35">Email</p>
              <a href={`mailto:${personalInfo.email}`} className="mt-2 block transition hover:opacity-50">{personalInfo.email}</a>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-black/35">Phone</p>
              <p className="mt-2">{personalInfo.phone || 'Available on request'}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-black/35">Socials</p>
              <div className="mt-2 flex flex-wrap gap-4">
                {socialLinks.linkedin && <a className="footer-link" href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={14} /> LinkedIn</a>}
                {socialLinks.github && <a className="footer-link" href={socialLinks.github} target="_blank" rel="noopener noreferrer"><Code size={14} /> GitHub</a>}
                <a className="footer-link" href={`mailto:${personalInfo.email}`}><Mail size={14} /> Email</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-7 text-[9px] font-bold uppercase tracking-[0.12em] text-black/35 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.</p>
            <a href="#about" className="transition hover:text-black">Back to start ↑</a>
          </div>
        </div>
      </footer>

      {showAdmin && (
        <Link href="/admin" className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-xl transition hover:border-white">
          <LogIn size={14} /> Edit profile
        </Link>
      )}
    </main>
  );
}
