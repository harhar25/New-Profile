'use client';

import { Experience } from '@/lib/profileData';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-2">CAREER PATH</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Professional Experience</h2>
          <p className="text-slate-300 text-lg max-w-2xl">
            A timeline of my professional journey and key roles that shaped my expertise.
          </p>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative group">
              {/* Timeline connector */}
              {index !== experiences.length - 1 && (
                <div className="absolute left-8 top-20 w-1 h-16 bg-gradient-to-b from-red-500 to-red-500/20" />
              )}
              
              <div className="flex gap-6">
                {/* Timeline dot */}
                <div className="flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg" />
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 border-2 border-red-500 text-red-400 font-bold text-lg group-hover:bg-red-500/10 transition-colors">
                    {index + 1}
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-red-500/50 hover:bg-slate-800/80 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition">
                        {exp.title}
                      </h3>
                      <p className="text-red-400 font-semibold mt-1">{exp.company}</p>
                    </div>
                    {exp.current && (
                      <span className="inline-block bg-red-500/10 text-red-300 border border-red-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                        Currently
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-3 font-medium">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </p>
                  <p className="text-slate-300 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
