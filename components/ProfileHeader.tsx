'use client';

import { useState } from 'react';
import { ProfileData } from '@/lib/profileData';
import { ArrowUpRight, Mail, MapPin, Phone, Sparkles } from 'lucide-react';

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
    <header id="about" className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28">
      <div className="hero-grid absolute inset-0 pointer-events-none" />
      <div className="absolute -right-48 top-16 h-96 w-96 rounded-full bg-cyan-400/10 blur-[110px] pointer-events-none" />
      <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-lime-300/10 blur-[100px] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_350px] lg:gap-20">
          <div className="order-2 lg:order-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-white/5 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_12px_#bef264]" />
              Available for select projects
            </div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Automation · AI systems · Growth operations</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
              {personalInfo.fullName}
            </h1>
            <p className="mt-7 max-w-2xl text-xl font-medium leading-snug text-slate-200 sm:text-2xl">{personalInfo.title}</p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">{personalInfo.bio}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-lime-200">
                Let&apos;s work together <ArrowUpRight size={17} />
              </a>
              <a href="#work" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-200/40 hover:bg-white/[0.08]">
                Explore my work <Sparkles size={16} />
              </a>
            </div>
          </div>

          <div className="order-1 justify-self-start lg:order-2 lg:justify-self-end">
            <div className="relative w-56 sm:w-72">
              <div className="absolute -inset-4 rounded-[2rem] border border-cyan-200/10 bg-cyan-300/5 rotate-6" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-800 shadow-2xl shadow-cyan-950/50">
                  {avatarUrl && !avatarError ? (
                    <img
                      src={avatarUrl}
                      alt={personalInfo.fullName}
                      className="h-full w-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 to-indigo-600 text-6xl font-bold text-white">
                      {initials || 'ME'}
                    </div>
                  )}
                </div>
              <div className="relative -mt-8 ml-5 rounded-2xl border border-white/10 bg-slate-950/85 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Based in</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-white"><MapPin size={15} className="text-lime-300" /> {personalInfo.location}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          <a href={`mailto:${personalInfo.email}`} className="group flex items-center gap-3 bg-slate-950/80 px-5 py-4 transition hover:bg-white/[0.06]">
            <Mail size={18} className="text-cyan-300" />
            <span><span className="block text-xs text-slate-500">Email</span><span className="text-sm font-medium text-slate-200">{personalInfo.email}</span></span>
          </a>
          <a href={`tel:${personalInfo.phone.replace(/\s/g, '')}`} className="group flex items-center gap-3 bg-slate-950/80 px-5 py-4 transition hover:bg-white/[0.06]">
            <Phone size={18} className="text-cyan-300" />
            <span><span className="block text-xs text-slate-500">Call</span><span className="text-sm font-medium text-slate-200">{personalInfo.phone}</span></span>
          </a>
          <div className="flex items-center gap-3 bg-slate-950/80 px-5 py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Connect</span>
            <div className="flex gap-2">
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-200/50 hover:text-cyan-200"
                  >
                    LinkedIn
                  </a>
                )}
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-200/50 hover:text-cyan-200"
                  >
                    GitHub
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-200/50 hover:text-cyan-200"
                  >
                    Twitter
                  </a>
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

