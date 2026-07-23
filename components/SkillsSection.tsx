'use client';

import { Skill } from '@/lib/profileData';

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const groupedSkills = skills.reduce((groups, skill) => {
    (groups[skill.category] ??= []).push(skill);
    return groups;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="expertise" className="border-y border-white/[0.08] bg-white/[0.018] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="section-label">02 / Capabilities</p>
          <h2 className="section-title mt-5">The toolkit behind reliable growth systems.</h2>
          <p className="section-copy">Strategy is only useful when the system can carry it. These are the capabilities I bring from setup through optimization.</p>
        </div>
        <div className="grid gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <article key={category} className="bg-[#111111] p-6 transition hover:bg-[#171717]">
              <p className="text-lg font-semibold tracking-[-0.025em] text-white">{category}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {categorySkills.map((skill) => <span key={skill.id} className="skill-pill" title={skill.proficiency}>{skill.name}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
