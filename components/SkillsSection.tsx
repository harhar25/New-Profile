'use client';

import { Skill } from '@/lib/profileData';

interface SkillsSectionProps {
  skills: Skill[];
}

const proficiencyColors = {
  Beginner: 'bg-blue-100 text-blue-800',
  Intermediate: 'bg-green-100 text-green-800',
  Advanced: 'bg-yellow-100 text-yellow-800',
  Expert: 'bg-purple-100 text-purple-800',
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
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Skills</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
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
