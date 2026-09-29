'use client';

import { ArrowUpRight, Download } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import type { Project } from '@/lib/profileData';

interface ProjectsSectionProps {
  projects: Project[];
}

const n8nWorkflowProject: Project = {
  id: 'n8n-ai-editorial-pipeline',
  title: 'AI Editorial Draft Pipeline',
  description:
    'An importable n8n workflow that validates a content brief, generates an article draft with OpenAI, and saves it to WordPress for editorial review. It never publishes automatically.',
  technologies: ['n8n', 'OpenAI', 'WordPress', 'Webhooks', 'Human Review'],
  link: '/downloads/n8n-ai-editorial-pipeline.json',
  featured: true,
};

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
  const otherProjects = projects.filter((project) => project.id !== n8nWorkflowProject.id);
  const orderedProjects = [
    n8nWorkflowProject,
    ...otherProjects.filter((project) => project.featured),
    ...otherProjects.filter((project) => !project.featured),
  ];

  return (
    <section id="work" className="bg-[#050505] px-5 py-24 text-[#f1f0eb] sm:px-8 lg:px-12 lg:py-36">
      <div className="page-shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-2">
            <p className="chapter-label text-white/40">Chapter III / Works</p>
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
                      {...(project.id === n8nWorkflowProject.id
                        ? { download: true, 'aria-label': 'Download the n8n workflow JSON' }
                        : {
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            'aria-label': `View ${project.title}`,
                          })}
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/25 transition group-hover:border-white group-hover:bg-white group-hover:text-black"
                    >
                      {project.id === n8nWorkflowProject.id ? <Download size={17} /> : <ArrowUpRight size={17} />}
                    </a>
                  )}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <section id="n8n-research" aria-labelledby="n8n-research-title" className="mt-28 border-t border-white/20 pt-10 lg:mt-40 lg:pt-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-2">
              <p className="chapter-label text-white/40">Research / n8n</p>
            </div>
            <div className="lg:col-span-5">
              <h3 id="n8n-research-title" className="max-w-[12ch] text-4xl font-light uppercase leading-[.98] tracking-[-.06em] sm:text-5xl">
                Automation, with a human in the loop.
              </h3>
              <p className="mt-6 max-w-lg text-sm leading-6 text-white/55">
                n8n connects triggers and task nodes into workflows. Its visual flow is useful for integrating services and APIs, while code nodes can handle custom validation or data shaping. AI can be added where language work helps, without handing it unchecked authority over the publishing step. n8n offers both managed Cloud and self-hosted deployment; Cloud reduces infrastructure work, while self-hosting gives operators more control and responsibility.
              </p>
              <a
                href="/downloads/n8n-ai-editorial-pipeline.json"
                download
                className="mt-7 inline-flex items-center gap-3 border-b border-white/30 pb-2 text-[10px] font-bold uppercase tracking-[.14em] transition hover:border-[#d7ff4f] hover:text-[#d7ff4f]"
              >
                Download the importable workflow
                <Download size={14} />
              </a>
            </div>
            <div className="lg:col-span-5">
              <ol className="border-t border-white/15">
                {[
                  ['01', 'Receive a brief', 'A header-authenticated webhook accepts a title, topic, audience, and optional tone. Required fields and input lengths are checked before AI processing.'],
                  ['02', 'Generate a draft', 'A Basic LLM Chain and OpenAI Chat Model turn the brief into article copy. The workflow follows a fixed path rather than letting an agent choose publishing actions.'],
                  ['03', 'Save for review', 'The WordPress node creates a draft, not a published post. An editor verifies claims, tone, links, and formatting, then decides whether to publish in WordPress.'],
                  ['04', 'Configure safely', 'The exported JSON contains no API keys. Add OpenAI and WordPress credentials in n8n, choose a strong webhook header credential, test with sample data, then publish the workflow.'],
                ].map(([number, title, description]) => (
                  <li key={number} className="grid gap-3 border-b border-white/15 py-5 sm:grid-cols-[2.5rem_1fr]">
                    <span className="font-mono text-[10px] text-[#d7ff4f]">{number}</span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-[.12em]">{title}</h4>
                      <p className="mt-2 text-xs leading-5 text-white/50">{description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-12 grid gap-6 border-t border-white/15 pt-8 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-white/45">Example webhook body</p>
              <p className="mt-3 max-w-xs text-xs leading-5 text-white/45">Send this JSON to the workflow&apos;s production webhook after configuring its credentials.</p>
            </div>
            <pre className="overflow-x-auto rounded border border-white/10 bg-white/[.03] p-5 text-xs leading-6 text-[#d7ff4f] lg:col-span-9"><code>{`{
  "title": "A practical guide to workflow automation",
  "topic": "How small teams can reduce repetitive admin work",
  "audience": "Small business operators",
  "tone": "Clear and practical"
}`}</code></pre>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-[10px] uppercase tracking-[.1em] text-white/45">
            <span>Research sources</span>
            <a className="underline decoration-white/25 underline-offset-4 hover:text-white" href="https://docs.n8n.io/build/understand-workflows/create-and-run-workflows/" target="_blank" rel="noopener noreferrer">Workflow basics</a>
            <a className="underline decoration-white/25 underline-offset-4 hover:text-white" href="https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainllm/" target="_blank" rel="noopener noreferrer">Basic LLM Chain</a>
            <a className="underline decoration-white/25 underline-offset-4 hover:text-white" href="https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.wordpress/" target="_blank" rel="noopener noreferrer">WordPress node</a>
            <a className="underline decoration-white/25 underline-offset-4 hover:text-white" href="https://docs.n8n.io/build/integrate-ai/ai-examples/human-in-the-loop-for-tools/" target="_blank" rel="noopener noreferrer">Human review</a>
            <a className="underline decoration-white/25 underline-offset-4 hover:text-white" href="https://docs.n8n.io/build/understand-workflows/create-and-edit-credentials/" target="_blank" rel="noopener noreferrer">Credentials</a>
            <a className="underline decoration-white/25 underline-offset-4 hover:text-white" href="https://docs.n8n.io/build/manage-workflows/export-and-import/" target="_blank" rel="noopener noreferrer">Import / export</a>
            <a className="underline decoration-white/25 underline-offset-4 hover:text-white" href="https://docs.n8n.io/choose-how-to-use-n8n/" target="_blank" rel="noopener noreferrer">Cloud vs self-hosted</a>
          </div>
          <p className="mt-5 max-w-3xl text-[10px] leading-5 text-white/35">
            This is a portfolio demo, not a deployed integration. AI output can be inaccurate; review it before publication. Configure credentials and secure the webhook in your own n8n instance. Research checked September 2026.
          </p>
        </section>
      </div>
    </section>
  );
}
