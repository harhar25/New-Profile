'use client';

import { Project } from '@/lib/profileData';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link.mjs';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-2">PORTFOLIO</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-slate-300 text-lg max-w-2xl">
            Showcase of successful projects that demonstrate my expertise in building digital solutions.
          </p>
        </div>

        {/* Featured Projects */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 hover:border-red-500/50 transition-all duration-300"
            >
              {/* Project image background */}
              {project.image && (
                <div className="overflow-hidden h-48 relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition mb-2">
                  {project.title}
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-red-500/10 text-red-300 border border-red-500/30 px-2.5 py-1 rounded text-xs font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Link */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold text-sm transition"
                  >
                    View Project <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <>
            <div className="mb-8 pb-8 border-b border-slate-700">
              <h3 className="text-2xl font-bold text-white">Other Projects</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {otherProjects.map((project) => (
                <div
                  key={project.id}
                  className="group p-6 border border-slate-700 bg-slate-800/30 rounded-lg hover:border-red-500/50 hover:bg-slate-800/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold text-white group-hover:text-red-400 transition flex-1">
                      {project.title}
                    </h4>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 transition ml-2"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-slate-700/50 text-slate-200 px-2.5 py-1 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
