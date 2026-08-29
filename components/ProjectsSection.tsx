'use client';

import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import type { Project } from '@/lib/profileData';

interface ProjectsSectionProps {
  projects: Project[];
}

const visualDetails = [
  { word: 'FLOW', label: 'Capture / Route / Follow up', metric: '24/7', tone: 'from-[#1b2018] via-[#0d0f0c] to-[#050505]' },
  { word: 'RANK', label: 'Search / Reviews / Visibility', metric: '+SEO', tone: 'from-[#191919] via-[#101010] to-[#050505]' },
  { word: 'SYNC', label: 'Dashboards / Data / Decisions', metric: 'LIVE', tone: 'from-[#17191d] via-[#0d0e11] to-[#050505]' },
  { word: 'THINK', label: 'Brief / Approve / Learn', metric: 'AI', tone: 'from-[#1c1b18] via-[#0e0d0b] to-[#050505]' },
];

const cardLayouts = [
  'lg:col-span-7',
  'lg:col-span-5 lg:mt-40',
  'lg:col-span-5',
  'lg:col-span-7 lg:-mt-28',
];

function ProjectVisual({ index }: { index: number }) {
  const visual = visualDetails[index % visualDetails.length];

  return (
    <div className={`project-surface relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${visual.tone} sm:aspect-[16/11] lg:aspect-[4/3]`}>
      <div className="project-grid absolute inset-0 opacity-60" />
      <div className="absolute inset-5 border border-white/15 sm:inset-8">
        <div className="flex items-center justify-between border-b border-white/15 px-4 py-3 text-[9px] font-medium uppercase tracking-[0.16em] text-white/45">
          <span>{visual.label}</span>
          <span>{visual.metric}</span>
        </div>

        <div className="grid h-[calc(100%-39px)] grid-cols-[0.65fr_1.35fr]">
          <div className="flex flex-col justify-between border-r border-white/15 p-4">
            <span className="h-2 w-2 rounded-full bg-[#d7ff4f] shadow-[0_0_20px_rgba(215,255,79,0.65)]" />
            <div className="space-y-2">
              {[72, 46, 88, 58].map((width, itemIndex) => (
                <span key={itemIndex} className="block h-px bg-white/20" style={{ width: `${width}%` }} />
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden p-4">
            <div className="absolute left-[18%] top-[20%] h-2.5 w-2.5 rounded-full border border-white/50" />
            <div className="absolute right-[20%] top-[33%] h-3 w-3 rounded-full bg-white/70" />
            <div className="absolute bottom-[23%] left-[38%] h-2 w-2 rounded-full bg-[#d7ff4f]" />
            <div className="absolute left-[21%] top-[23%] h-px w-[55%] origin-left rotate-[12deg] bg-white/20" />
            <div className="absolute bottom-[27%] left-[39%] h-px w-[42%] origin-left -rotate-[43deg] bg-white/20" />
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
              {[38, 67, 91].map((height) => (
                <span key={height} className="self-end border border-white/15 bg-white/[0.04]" style={{ height: `${height}px` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="pointer-events-none absolute -bottom-[0.13em] -left-[0.04em] text-[clamp(6rem,19vw,18rem)] font-extralight leading-none tracking-[-0.1em] text-white/[0.055]">{visual.word}</p>
    </div>
  );
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const orderedProjects = [
    ...projects.filter((project) => project.featured),
    ...projects.filter((project) => !project.featured),
  ];

  return (
    <section id="work" className="bg-[#050505] px-5 py-24 text-[#f1f0eb] sm:px-8 lg:px-12 lg:py-36">
      <div className="page-shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-2">
            <p className="chapter-label text-white/40">Chapter II / Works</p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="editorial-heading max-w-[10ch] font-light uppercase">
              Where complexity
              <span className="block">becomes</span>
              <span className="block">momentum.</span>
            </h2>
          </div>
          <div className="lg:col-span-3 lg:pb-3">
            <p className="max-w-xs text-sm leading-6 text-white/50">Selected automation, visibility, and AI systems designed to make operations clearer and faster.</p>
            <p className="mt-8 text-6xl font-extralight tracking-[-0.07em]">{String(orderedProjects.length).padStart(2, '0')}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Selected systems</p>
          </div>
        </div>

        <div className="mt-20 grid gap-x-7 gap-y-20 lg:mt-32 lg:grid-cols-12 lg:gap-y-32">
          {orderedProjects.map((project, index) => (
            <ScrollReveal key={project.id} className={cardLayouts[index % cardLayouts.length]}>
              <article className="group">
                <ProjectVisual index={index} />
                <div className="mt-6 grid gap-5 border-t border-white/20 pt-5 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d7ff4f]">System {String(index + 1).padStart(2, '0')}</p>
                    <h3 className="mt-3 text-2xl font-light uppercase tracking-[-0.04em] sm:text-3xl">{project.title}</h3>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-white/50">{project.description}</p>
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[9px] font-bold uppercase tracking-[0.12em] text-white/35">
                      {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                    </div>
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title}`}
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/25 transition group-hover:border-white group-hover:bg-white group-hover:text-black"
                    >
                      <ArrowUpRight size={17} />
                    </a>
                  )}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
