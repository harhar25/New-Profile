'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, Code, LogIn, Mail } from 'lucide-react';
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

  useEffect(() => {
    const profileTimer = window.setTimeout(() => setProfile(profileStorage.getProfile()), 0);
    return () => window.clearTimeout(profileTimer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === 'h') setShowAdmin((visible) => !visible);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { personalInfo, socialLinks, certifications } = profile;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-[#f1f0eb]">
      <nav className="fixed inset-x-0 top-0 z-50 overflow-hidden border-b border-white/10 bg-[#050505]/75 backdrop-blur-xl">
        <div className="site-nav-inner flex h-[72px] min-w-0 items-center">
          <a href="#about" className="flex items-center gap-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/40 text-[10px] font-bold">HM</span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.13em] text-white/70 sm:block">Harold Madjos</span>
          </a>

          <div className="hidden items-center gap-7 text-[9px] font-bold uppercase tracking-[0.13em] text-white/45 md:flex">
            <a href="#chapter-one" className="nav-link">Profile</a>
            <a href="#work" className="nav-link">Works</a>
            <a href="#expertise" className="nav-link">Capabilities</a>
            <a href="#experience" className="nav-link">Experience</a>
          </div>

          <a
            href={conversationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-contact ml-auto inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/25 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.12em] transition hover:border-white hover:bg-white hover:text-black"
          >
            <span className="hidden sm:inline">Get in touch</span>
            <span className="sm:hidden">Contact</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </nav>

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
