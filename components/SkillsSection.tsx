import { ChevronDown } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import type { Skill } from '@/lib/profileData';

interface SkillsSectionProps {
  skills: Skill[];
}

const categoryDescriptions: Record<string, string> = {
  'GHL Automation': 'CRM journeys, pipelines, calendars, and messaging built to convert.',
  Automation: 'Routing, scoring, alerts, and logic that keep teams moving.',
  'Web Setup': 'Conversion-focused pages and web experiences across GHL and WordPress.',
  SEO: 'Repeatable local visibility workflows, reviews, content, and rank reporting.',
  Integrations: 'APIs, webhooks, and data flows connecting the tools teams rely on.',
  'AI & Apps': 'AI-assisted workflows and operational apps with useful, governed outputs.',
  'QA & Ops': 'Testing, monitoring, and access checks that keep systems dependable.',
  Reporting: 'Decision-ready dashboards that turn operational data into clear signals.',
  Support: 'Practical troubleshooting across automations, apps, and user access.',
  Operations: 'Clear SOPs, updates, and reporting that make delivery repeatable.',
  'Core Strengths': 'Engineering judgment, systems thinking, and a bias toward learning.',
};

const proficiencyStyles: Record<Skill['proficiency'], string> = {
  Beginner: 'bg-black/25',
  Intermediate: 'bg-black/45',
  Advanced: 'bg-black/70',
  Expert: 'bg-[#0a0a0a] shadow-[0_0_0_3px_rgba(215,255,79,0.65)]',
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const groupedSkills = skills.reduce((groups, skill) => {
    (groups[skill.category] ??= []).push(skill);
    return groups;
  }, {} as Record<string, Skill[]>);
  const skillGroups = Object.entries(groupedSkills);
  const expertSkillCount = skills.filter((skill) => skill.proficiency === 'Expert').length;

  return (
    <section id="expertise" className="overflow-hidden bg-[#eceae4] px-5 py-24 text-[#0a0a0a] sm:px-8 lg:px-12 lg:py-36">
      <div className="page-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-2">
            <p className="chapter-label text-black/45">Chapter III / Capabilities</p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="editorial-heading max-w-[9ch] font-light uppercase">
              Precise when
              <span className="block">it matters.</span>
              <span className="block">Flexible when</span>
              <span className="block">it counts.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end lg:col-span-3 lg:pb-3">
            <p className="text-sm leading-6 text-black/55">A connected toolkit for building, testing, and improving digital operations from first trigger to final report.</p>
            <dl className="mt-9 grid grid-cols-3 border-y border-black/20">
              <div className="py-4">
                <dd className="text-3xl font-light tracking-[-0.06em]">{skillGroups.length}</dd>
                <dt className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-black/40">Disciplines</dt>
              </div>
              <div className="border-x border-black/20 px-4 py-4">
                <dd className="text-3xl font-light tracking-[-0.06em]">{skills.length}</dd>
                <dt className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-black/40">Skills</dt>
              </div>
              <div className="pl-4 pt-4">
                <dd className="text-3xl font-light tracking-[-0.06em]">{expertSkillCount}</dd>
                <dt className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-black/40">Expert</dt>
              </div>
            </dl>
          </div>
        </div>

        <div className="my-20 overflow-hidden border-y border-black/20 py-5 lg:my-28">
          <div className="marquee-track flex w-max gap-12 whitespace-nowrap text-[clamp(2.5rem,7vw,7rem)] font-extralight uppercase leading-none tracking-[-0.07em] text-black/10">
            <span>Automate</span><span>Connect</span><span>Measure</span><span>Improve</span>
            <span aria-hidden="true">Automate</span><span aria-hidden="true">Connect</span><span aria-hidden="true">Measure</span><span aria-hidden="true">Improve</span>
          </div>
        </div>

        <div className="border-t border-black/25">
          {skillGroups.map(([category, categorySkills], index) => (
            <ScrollReveal key={category}>
              <details open={index === 0} className="group border-b border-black/25">
                <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black sm:gap-8 sm:py-8 [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-[10px] text-black/40">{String(index + 1).padStart(2, '0')}</span>
                  <div className="grid gap-2 sm:grid-cols-[0.75fr_1.25fr] sm:items-center sm:gap-8">
                    <h3 className="text-2xl font-light uppercase tracking-[-0.04em] sm:text-3xl">{category}</h3>
                    <p className="hidden max-w-lg text-sm leading-6 text-black/45 sm:block">{categoryDescriptions[category] ?? 'Tools and practices for dependable digital delivery.'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden text-[9px] font-bold uppercase tracking-[0.12em] text-black/35 sm:block">{categorySkills.length} skills</span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-black/25 transition group-open:bg-black group-open:text-white">
                      <ChevronDown size={15} className="transition-transform duration-300 group-open:rotate-180" />
                    </span>
                  </div>
                </summary>

                <div className="grid gap-8 border-t border-black/10 pb-9 pt-7 sm:grid-cols-[0.75fr_1.25fr] sm:pl-10">
                  <p className="max-w-sm text-sm leading-6 text-black/50 sm:hidden">{categoryDescriptions[category] ?? 'Tools and practices for dependable digital delivery.'}</p>
                  <div className="hidden sm:block" />
                  <ul className="grid gap-x-8 sm:grid-cols-2">
                    {categorySkills.map((skill) => (
                      <li key={skill.id} className="flex min-h-12 items-start gap-3 border-b border-black/10 py-3 text-sm leading-5 text-black/70">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${proficiencyStyles[skill.proficiency]}`} />
                        <span className="min-w-0 flex-1">{skill.name}</span>
                        <span className="hidden text-[8px] font-bold uppercase tracking-[0.1em] text-black/30 xl:block">{skill.proficiency}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
