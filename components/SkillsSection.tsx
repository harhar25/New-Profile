'use client';

import { Skill } from '@/lib/profileData';

interface SkillsSectionProps {
  skills: Skill[];
}

const proficiencyColors = {
  Beginner: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  Intermediate: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  Advanced: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  Expert: 'bg-red-500/10 text-red-300 border-red-500/30',
};

const proficiencyBorders = {
  Beginner: 'border-blue-500/30',
  Intermediate: 'border-emerald-500/30',
  Advanced: 'border-amber-500/30',
  Expert: 'border-red-500/30',
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
  // Group skills by category
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-2">EXPERTISE</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Technical Skills & Expertise</h2>
          <p className="text-slate-300 text-lg max-w-2xl">
            A comprehensive collection of tools and technologies I've mastered to deliver exceptional results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div
              key={category}
              className="group p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-red-500/50 hover:bg-slate-800/80 transition-all duration-300"
            >
              <div className="mb-4 pb-4 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition">
                  {category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      proficiencyColors[skill.proficiency]
                    }`}
                    title={skill.proficiency}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

