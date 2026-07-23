'use client';

import { Experience } from '@/lib/profileData';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="section-label">03 / Experience</p>
          <h2 className="section-title mt-5">A technical foundation with a systems mindset.</h2>
          <p className="section-copy">Every role has sharpened how I translate operational needs into practical, maintainable digital solutions.</p>
        </div>
        <div className="border-t border-white/10">
          {experiences.map((experience, index) => (
            <article key={experience.id} className="grid gap-5 border-b border-white/10 py-8 transition sm:grid-cols-[150px_1fr_auto] sm:items-start hover:bg-white/[0.025] hover:px-4">
              <p className="font-mono text-xs uppercase tracking-[0.13em] text-[#d7ff4f]">{experience.startDate} - {experience.current ? 'Now' : experience.endDate}</p>
              <div><h3 className="text-2xl font-semibold tracking-[-0.035em] text-white">{experience.title}</h3><p className="mt-1 text-sm font-medium text-[#d7ff4f]">{experience.company}</p><p className="mt-4 max-w-2xl leading-7 text-slate-400">{experience.description}</p></div>
              <span className="hidden font-mono text-sm text-slate-600 sm:block">0{index + 1}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
