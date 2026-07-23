'use client';

import { useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { ProfileData } from '@/lib/profileData';

interface ProfileHeaderProps {
  profile: ProfileData;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { personalInfo, socialLinks } = profile;
  const [avatarError, setAvatarError] = useState(false);
  const avatarUrl = personalInfo.avatar?.trim();
  const initials = personalInfo.fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header id="about" className="border-b border-white/10 px-5 pb-12 pt-28 sm:px-8 lg:px-12 lg:pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-[#d7ff4f]">Independent automation specialist / 2026</p>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.91] tracking-[-0.07em] text-[#f5f3ed] sm:text-7xl lg:text-[6.75rem]">
              {personalInfo.fullName}
              <span className="block text-[#d7ff4f]">Builds systems that make work flow.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">{personalInfo.bio}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 text-sm font-semibold text-[#f5f3ed]">
              <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-2 rounded-full bg-[#d7ff4f] px-5 py-3 text-[#0a0a0a] transition hover:bg-[#efffb8]">Start a project <ArrowUpRight size={17} /></a>
              <a href="#work" className="border-b border-white/30 pb-1 transition hover:border-[#d7ff4f] hover:text-[#d7ff4f]">See selected work</a>
            </div>
          </div>

          <div className="justify-self-start lg:justify-self-end">
            <div className="relative w-64 sm:w-80">
              <div className="absolute -left-3 -top-3 border border-[#d7ff4f] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.17em] text-[#d7ff4f]">Available for projects</div>
              <div className="aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
                {avatarUrl && !avatarError ? (
                  <img src={avatarUrl} alt={personalInfo.fullName} className="h-full w-full object-cover" onError={() => setAvatarError(true)} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#d7ff4f] text-6xl font-bold text-[#0a0a0a]">{initials || 'HM'}</div>
                )}
              </div>
              <div className="flex items-center justify-between border border-t-0 border-white/15 px-4 py-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-2"><MapPin size={14} className="text-[#d7ff4f]" /> {personalInfo.location}</span>
                <span>01 / 01</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid border-y border-white/10 sm:grid-cols-3">
          <div className="border-b border-white/10 py-5 sm:border-b-0 sm:border-r sm:pr-8"><p className="text-xs uppercase tracking-[0.16em] text-slate-500">Focus</p><p className="mt-2 text-base font-medium text-[#f5f3ed]">AI, CRM and workflow automation</p></div>
          <div className="border-b border-white/10 py-5 sm:border-b-0 sm:border-r sm:px-8"><p className="text-xs uppercase tracking-[0.16em] text-slate-500">Based in</p><p className="mt-2 text-base font-medium text-[#f5f3ed]">{personalInfo.location}</p></div>
          <div className="py-5 sm:pl-8"><p className="text-xs uppercase tracking-[0.16em] text-slate-500">Connect</p><div className="mt-2 flex gap-4 text-base font-medium text-[#f5f3ed]">{socialLinks.linkedin && <a className="underline-offset-4 hover:text-[#d7ff4f] hover:underline" href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}{socialLinks.github && <a className="underline-offset-4 hover:text-[#d7ff4f] hover:underline" href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a>}</div></div>
        </div>
      </div>
    </header>
  );
}
