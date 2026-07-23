'use client';

import { Project } from '@/lib/profileData';
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
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <p className="section-label">01 / Selected work</p>
          <div>
            <h2 className="section-title">Systems that turn complexity into momentum.</h2>
            <p className="section-copy">A selection of automation, visibility, and AI-enabled operations projects built to keep teams moving.</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <article key={project.id} className={`project-card group ${index === 0 ? 'lg:col-span-2' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-xs text-cyan-300">0{index + 1}</span>
                {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title}`} className="icon-link"><ArrowUpRight size={18} /></a>}
              </div>
              <div className="mt-20">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.17em] text-lime-300">Featured system</p>
                <h3 className="max-w-xl text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">{project.title}</h3>
                <p className="mt-4 max-w-xl leading-7 text-slate-400">{project.description}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.technologies.map((technology) => <span key={technology} className="tech-pill">{technology}</span>)}
              </div>
            </article>
          ))}
        </div>

        {otherProjects.length > 0 && (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {otherProjects.map((project) => (
              <article key={project.id} className="project-card group">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.17em] text-slate-500">In progress</span>
                  {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title}`} className="icon-link"><ArrowUpRight size={18} /></a>}
                </div>
                <h3 className="mt-14 text-2xl font-semibold tracking-[-0.035em] text-white">{project.title}</h3>
                <p className="mt-4 leading-7 text-slate-400">{project.description}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => <span key={technology} className="tech-pill">{technology}</span>)}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
