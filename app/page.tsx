'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Award, BriefcaseBusiness, Code, LogIn, Mail } from 'lucide-react';
import { defaultProfileData, ProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import ExperienceSection from '@/components/ExperienceSection';
import PortfolioMoments from '@/components/PortfolioMoments';
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

  if (isLoading) return <main className="grid min-h-screen place-items-center bg-[#0a0a0a] text-sm text-slate-400">Loading profile...</main>;

  const { personalInfo, socialLinks, certifications } = profile;

  return (
    <main className="min-h-screen overflow-hidden bg-[#0a0a0a] text-slate-100">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-4">
          <a href="#about" className="flex items-center gap-2 text-sm font-bold tracking-tight text-[#f5f3ed]"><span className="text-lg text-[#d7ff4f]">*</span> Harold Madjos</a>
          <div className="hidden items-center gap-6 text-xs font-semibold text-slate-400 md:flex"><a href="#work" className="nav-link">Work</a><a href="#expertise" className="nav-link">Capabilities</a><a href="#experience" className="nav-link">Experience</a></div>
          <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d7ff4f] transition hover:text-[#f5f3ed]">Contact <ArrowUpRight size={14} /></a>
        </div>
      </nav>

      <ProfileHeader profile={profile} />
      <ProjectsSection projects={profile.projects} />
      <SkillsSection skills={profile.skills} />
      <ExperienceSection experiences={profile.experiences} />
      <PortfolioMoments />

      {certifications.length > 0 && (
        <section id="credentials" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-3xl"><p className="section-label">05 / Credentials</p><h2 className="section-title mt-5">Learning that supports practical delivery.</h2></div>
            <div className="grid border border-white/15 md:grid-cols-2">
              {certifications.map((certification) => (
                <article key={`${certification.name}-${certification.date}`} className="border-b border-white/15 bg-[#111111] p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                  <Award size={22} className="text-[#d7ff4f]" />
                  <h3 className="mt-10 text-2xl font-semibold tracking-[-0.035em] text-[#f5f3ed]">{certification.name}</h3>
                  <p className="mt-2 text-sm text-[#d7ff4f]">{certification.issuer}</p>
                  <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-slate-500">{certification.date}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer id="contact" className="border-t border-white/10 bg-[#d7ff4f] px-5 pt-16 text-[#0a0a0a] sm:px-8 lg:px-12 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em]">Make work move</p>
          <div className="mt-7 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-4xl text-5xl font-semibold leading-[0.91] tracking-[-0.065em] sm:text-7xl">Ready to automate what is holding your team back?</h2>
            <a href={`mailto:${personalInfo.email}`} className="inline-flex w-fit items-center gap-2 border border-[#0a0a0a] px-5 py-3 text-sm font-bold transition hover:bg-[#0a0a0a] hover:text-[#d7ff4f]">Start a conversation <ArrowUpRight size={17} /></a>
          </div>
          <div className="mt-20 flex flex-col gap-4 border-t border-black/20 py-7 text-sm sm:flex-row sm:items-center sm:justify-between"><p>Copyright {new Date().getFullYear()} {personalInfo.fullName}</p><div className="flex gap-4">{socialLinks.linkedin && <a className="footer-link" href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={16} /> LinkedIn</a>}{socialLinks.github && <a className="footer-link" href={socialLinks.github} target="_blank" rel="noopener noreferrer"><Code size={16} /> GitHub</a>}<a className="footer-link" href={`mailto:${personalInfo.email}`}><Mail size={16} /> Email</a></div></div>
        </div>
      </footer>

      {showAdmin && <Link href="/admin" className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 border border-white/15 bg-[#111111] px-4 py-2.5 text-xs font-bold text-white shadow-xl transition hover:border-[#d7ff4f]"><LogIn size={15} /> Edit profile</Link>}
    </main>
  );
}
