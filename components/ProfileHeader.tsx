'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react';
import type { ProfileData } from '@/lib/profileData';

interface ProfileHeaderProps {
  profile: ProfileData;
}

const conversationUrl = 'https://form.jotform.com/haroldjeymadjos/start-a-conversation';

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { personalInfo } = profile;
  const [avatarError, setAvatarError] = useState(false);
  const avatarUrl = personalInfo.avatar?.trim();
  const categoryCount = new Set(profile.skills.map((skill) => skill.category)).size;
  const roleLines = personalInfo.title
    .split('|')
    .map((role) => role.trim())
    .filter(Boolean);

  return (
    <>
      <header id="about" className="relative min-h-[100svh] overflow-hidden bg-[#050505] text-[#f1f0eb]">
        <div className="editorial-grid pointer-events-none absolute inset-0 opacity-35" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[62%]">
          {avatarUrl && !avatarError ? (
            <Image
              src={avatarUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 62vw, 100vw"
              preload
              unoptimized
              className="h-full w-full object-cover object-top grayscale contrast-125"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <Image
              src="/uploads/harold-portrait-cutout-v2.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 62vw, 100vw"
              preload
              className="h-full w-full object-contain object-bottom grayscale"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.92)_20%,rgba(5,5,5,0.26)_70%,rgba(5,5,5,0.5)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#050505_0%,transparent_38%,rgba(5,5,5,0.16)_100%)]" />
        </div>

        <div className="page-shell relative z-10 flex min-h-[100svh] flex-col px-5 pb-7 pt-28 sm:px-8 sm:pb-9 lg:px-12 lg:pt-32">
          <div className="grid flex-1 items-center gap-10 lg:grid-cols-[0.22fr_1fr_0.34fr]">
            <div className="hidden self-end pb-28 lg:block">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/40 text-xs font-medium">HM</span>
                <p className="max-w-24 text-[10px] font-semibold uppercase leading-4 tracking-[0.14em] text-white/65">{personalInfo.fullName}</p>
              </div>
            </div>

            <div className="self-center lg:pt-10">
              <p className="chapter-label mb-6 text-white/55">Opening / Independent specialist</p>
              <h1 className="hero-title max-w-[9ch] font-light uppercase text-white">
                <span className="block">Can</span>
                <span className="block">systems</span>
                <span className="hidden sm:block">make work</span>
                <span className="block sm:hidden">make</span>
                <span className="block sm:hidden">work</span>
                <span className="block">flow?</span>
              </h1>
            </div>

            <div className="self-end pb-24 lg:self-center lg:pb-0">
              <div className="border-l border-white/30 pl-4 text-[11px] font-medium uppercase leading-[1.08] tracking-[-0.02em] text-white/80">
                {roleLines.map((role) => <p key={role}>{role}</p>)}
                {roleLines.length < 2 && <p>AI Systems Specialist</p>}
              </div>
              <a
                href={conversationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/30 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:border-white hover:bg-white hover:text-black"
              >
                Start a conversation
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div className="grid gap-5 border-t border-white/20 pt-5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/60 sm:grid-cols-3 sm:items-end">
            <a href="#chapter-one" className="inline-flex w-fit items-center gap-3 transition hover:text-white">
              <ArrowDown size={14} />
              Scroll to begin
            </a>
            <p className="inline-flex min-w-0 items-center gap-2 sm:justify-self-center"><MapPin size={13} className="shrink-0" /> <span>{personalInfo.location}</span></p>
            <p className="min-w-0 sm:justify-self-end">Automation / AI / Systems</p>
          </div>
        </div>
      </header>

      <section id="chapter-one" className="bg-[#eceae4] px-5 py-24 text-[#0a0a0a] sm:px-8 lg:px-12 lg:py-36">
        <div className="page-shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-2">
              <p className="chapter-label text-black/50">Chapter I / Profile</p>
            </div>
            <div className="lg:col-span-6">
              <h2 className="editorial-heading max-w-[8ch] font-light uppercase">
                Systems,
                <span className="block">logic &</span>
                <span className="block">momentum.</span>
              </h2>
            </div>
            <div className="flex flex-col justify-end lg:col-span-4 lg:pl-8">
              <p className="text-lg leading-8 text-black/70">{personalInfo.bio}</p>
              <div className="mt-9 flex flex-wrap gap-2">
                {['GoHighLevel', 'AI workflows', 'Integrations', 'Reporting'].map((focus) => (
                  <span key={focus} className="rounded-full border border-black/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em]">{focus}</span>
                ))}
              </div>
            </div>
          </div>

          <dl className="mt-20 grid border-y border-black/20 sm:grid-cols-3 lg:mt-32">
            <div className="border-b border-black/20 py-6 sm:border-b-0 sm:border-r sm:pr-8">
              <dd className="text-5xl font-light tracking-[-0.06em]">{String(profile.skills.length).padStart(2, '0')}</dd>
              <dt className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">Capabilities in practice</dt>
            </div>
            <div className="border-b border-black/20 py-6 sm:border-b-0 sm:border-r sm:px-8">
              <dd className="text-5xl font-light tracking-[-0.06em]">{String(categoryCount).padStart(2, '0')}</dd>
              <dt className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">Connected disciplines</dt>
            </div>
            <div className="py-6 sm:pl-8">
              <dd className="text-5xl font-light tracking-[-0.06em]">24/7</dd>
              <dt className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">Systems built to keep moving</dt>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
