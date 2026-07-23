'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Award, BriefcaseBusiness, Code, LogIn, Mail } from 'lucide-react';
import { defaultProfileData, ProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import ExperienceSection from '@/components/ExperienceSection';
import ProfileHeader from '@/components/ProfileHeader';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    setProfile(profileStorage.getProfile());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === 'h') setShowAdmin((visible) => !visible);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) return <main className="grid min-h-screen place-items-center bg-[#080d18] text-sm text-slate-400">Loading profile…</main>;

  const { personalInfo, socialLinks, certifications } = profile;

  return (
    <main className="min-h-screen overflow-hidden bg-[#080d18] text-slate-100">
      <nav className="fixed inset-x-0 top-0 z-50 px-5 pt-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#080d18]/75 px-4 py-3 backdrop-blur-xl">
          <a href="#about" className="flex items-center gap-2 text-sm font-bold tracking-tight text-white"><span className="grid h-7 w-7 place-items-center rounded-full bg-lime-300 text-xs text-slate-950">HM</span> Harold Madjos</a>
          <div className="hidden items-center gap-6 text-xs font-semibold text-slate-400 md:flex">
            <a href="#work" className="nav-link">Work</a><a href="#expertise" className="nav-link">Expertise</a><a href="#experience" className="nav-link">Experience</a>
          </div>
          <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-200 transition hover:text-lime-300">Contact <ArrowUpRight size={14} /></a>
        </div>
      </nav>

      <ProfileHeader profile={profile} />
      <ProjectsSection projects={profile.projects} />
      <SkillsSection skills={profile.skills} />
      <ExperienceSection experiences={profile.experiences} />

      {certifications.length > 0 && <section id="credentials" className="border-y border-white/[0.08] bg-white/[0.018] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto max-w-7xl"><div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><p className="section-label">04 / Credentials</p><div><h2 className="section-title">Learning built into the practice.</h2><p className="section-copy">Formal education and hands-on development that support thoughtful delivery.</p></div></div><div className="grid gap-4 md:grid-cols-2">{certifications.map((certification) => <article key={`${certification.name}-${certification.date}`} className="rounded-2xl border border-white/10 bg-[#0b1120] p-6"><Award size={22} className="text-lime-300" /><h3 className="mt-8 text-xl font-semibold tracking-[-0.025em] text-white">{certification.name}</h3><p className="mt-2 text-sm text-cyan-200">{certification.issuer}</p><p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-slate-500">{certification.date}</p></article>)}</div></div></section>}

      <footer id="contact" className="px-5 pb-8 pt-20 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><div className="rounded-[2rem] border border-cyan-200/15 bg-gradient-to-br from-cyan-300/[0.12] to-lime-300/[0.06] p-8 sm:p-12"><p className="section-label text-cyan-200">Start a conversation</p><div className="mt-5 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><h2 className="max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">Ready to build a smoother system?</h2><a href={`mailto:${personalInfo.email}`} className="inline-flex w-fit items-center gap-2 rounded-full bg-lime-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-lime-200">Send an email <ArrowUpRight size={17} /></a></div></div><div className="flex flex-col gap-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} {personalInfo.fullName}</p><div className="flex gap-4">{socialLinks.linkedin && <a className="footer-link" href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={16} /> LinkedIn</a>}{socialLinks.github && <a className="footer-link" href={socialLinks.github} target="_blank" rel="noopener noreferrer"><Code size={16} /> GitHub</a>}<a className="footer-link" href={`mailto:${personalInfo.email}`}><Mail size={16} /> Email</a></div></div></div></footer>

      {showAdmin && <Link href="/admin" className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xl transition hover:border-cyan-200/50"><LogIn size={15} /> Edit profile</Link>}
    </main>
  );
}
