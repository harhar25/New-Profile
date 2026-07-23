'use client';

import { Project } from '@/lib/profileData';
import ScrollReveal from '@/components/ScrollReveal';
import { ArrowUpRight } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <section id="work" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="section-label">01 / Selected work</p>
          <h2 className="section-title mt-5">Systems that turn complexity into momentum.</h2>
          <p className="section-copy">A selection of automation, visibility, and AI-enabled operations projects built to keep teams moving.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <ScrollReveal key={project.id} className={`project-card group flex min-h-[285px] flex-col ${index === 0 ? 'md:col-span-2 md:min-h-[320px]' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-xs text-[#d7ff4f]">0{index + 1}</span>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title}`} className="icon-link">
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>
              <div className="mt-auto pt-12">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.17em] text-[#d7ff4f]">Featured system</p>
                <h3 className="max-w-2xl text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">{project.title}</h3>
                <p className="mt-4 max-w-2xl leading-7 text-slate-400">{project.description}</p>
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                {project.technologies.map((technology) => <span key={technology} className="tech-pill">{technology}</span>)}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {otherProjects.length > 0 && (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {otherProjects.map((project) => (
              <ScrollReveal key={project.id} className={`project-card group flex min-h-[260px] flex-col ${otherProjects.length === 1 ? 'md:col-span-2' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.17em] text-slate-500">Additional system</span>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title}`} className="icon-link">
                      <ArrowUpRight size={18} />
                    </a>
                  )}
                </div>
                <div className="mt-auto pt-12">
                  <h3 className="text-2xl font-semibold tracking-[-0.035em] text-white">{project.title}</h3>
                  <p className="mt-4 max-w-2xl leading-7 text-slate-400">{project.description}</p>
                </div>
                <div className="mt-7 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => <span key={technology} className="tech-pill">{technology}</span>)}
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
