'use client';

import ScrollReveal from '@/components/ScrollReveal';
import type { Experience } from '@/lib/profileData';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="bg-[#050505] px-5 py-24 text-[#f1f0eb] sm:px-8 lg:px-12 lg:py-36">
      <div className="page-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-2">
            <p className="chapter-label text-white/40">Chapter IV / Experience</p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="editorial-heading max-w-[10ch] font-light uppercase">
              Technical
              <span className="block">foundation.</span>
              <span className="block">Systems</span>
              <span className="block">mindset.</span>
            </h2>
          </div>
          <div className="flex items-end lg:col-span-3 lg:pb-3">
            <p className="max-w-xs text-sm leading-6 text-white/50">Every role sharpens how operational needs become practical, maintainable digital systems.</p>
          </div>
        </div>

        <div className="mt-20 border-t border-white/20 lg:mt-32">
          {experiences.map((experience, index) => (
            <ScrollReveal key={experience.id}>
              <article className="grid gap-7 border-b border-white/20 py-9 transition hover:bg-white/[0.025] sm:grid-cols-[0.32fr_1fr_auto] sm:px-2 lg:py-12">
                <div>
                  <p className="text-4xl font-extralight tracking-[-0.06em] text-white/80 sm:text-5xl">{experience.startDate}</p>
                  <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#d7ff4f]">to {experience.current ? 'Present' : experience.endDate}</p>
                </div>
                <div className="max-w-3xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">{experience.company}</p>
                  <h3 className="mt-3 text-3xl font-light uppercase leading-none tracking-[-0.045em] sm:text-4xl">{experience.title}</h3>
                  <p className="mt-5 max-w-2xl text-sm leading-6 text-white/50">{experience.description}</p>
                </div>
                <span className="font-mono text-[10px] text-white/25">{String(index + 1).padStart(2, '0')}</span>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-24 grid gap-8 border-y border-white/20 py-10 sm:grid-cols-[auto_1fr] sm:items-center lg:mt-36">
          <span className="h-3 w-3 rounded-full bg-[#d7ff4f] shadow-[0_0_20px_rgba(215,255,79,0.65)]" />
          <p className="max-w-5xl text-[clamp(2rem,5vw,5.5rem)] font-extralight uppercase leading-[0.95] tracking-[-0.06em] text-white/85">Built to learn. Trusted to deliver. Ready to improve what comes next.</p>
        </div>
      </div>
    </section>
  );
}
