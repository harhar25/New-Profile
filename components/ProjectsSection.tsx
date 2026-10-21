'use client';

import { ArrowUpRight, Download } from 'lucide-react';
import AutomationCallout from './AutomationCallout';
import SystemIllustration from './SystemIllustration';
import styles from './FeatureBlocks.module.css';
import type { Project } from '@/lib/profileData';
import { editorialPipelineProject as n8nWorkflowProject } from '@/lib/portfolioHighlights';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const otherProjects = projects.filter((project) => project.id !== n8nWorkflowProject.id);
  const orderedProjects = [
    n8nWorkflowProject,
    ...otherProjects.filter((project) => project.featured),
    ...otherProjects.filter((project) => !project.featured),
  ];

  return (
    <section id="work" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div><p className={styles.eyebrow}>Selected systems / Built with purpose</p><h2>Good systems make<br />room for better work.</h2></div>
          <p>From lead capture to editorial review, each project connects a practical problem with a considered workflow.</p>
        </div>
        <div className={styles.grid}>
          {orderedProjects.map((project, index) => (
            <article key={project.id} className={styles.card}>
              <div className={styles.visual}><SystemIllustration index={index} /></div>
              <div className={styles.content}>
                <span className={styles.number}>SYSTEM / {String(index + 1).padStart(2, '0')}</span>
                <h3>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>
                <div className={styles.tags}>{project.technologies.map(technology => <span key={technology}>{technology}</span>)}</div>
                {project.link && <a href={project.link} {...(project.id === n8nWorkflowProject.id ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })} className={styles.action}>{project.id === n8nWorkflowProject.id ? <>Download workflow <Download size={14} /></> : <>View project <ArrowUpRight size={14} /></>}</a>}
              </div>
            </article>
          ))}
        </div>
        <AutomationCallout title="From a diagram to something you can try." description="Build a sample automation, connect the steps, and watch the data move." />
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
