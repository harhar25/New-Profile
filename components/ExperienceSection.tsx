'use client';

import { Experience } from '@/lib/profileData';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Experience</h2>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative">
              {index !== experiences.length - 1 && (
                <div className="absolute left-4 top-12 w-1 h-16 bg-blue-400" />
              )}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {exp.title}
                      </h3>
                      <p className="text-lg text-blue-600">{exp.company}</p>
                    </div>
                    {exp.current && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {exp.startDate} -{' '}
                    {exp.current ? 'Present' : exp.endDate}
                  </p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
