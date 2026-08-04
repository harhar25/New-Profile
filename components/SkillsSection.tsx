import {
  Bot,
  ChartNoAxesCombined,
  ChevronDown,
  ClipboardCheck,
  GitBranch,
  LayoutTemplate,
  LifeBuoy,
  Plug,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import type { Skill } from '@/lib/profileData';

interface SkillsSectionProps {
  skills: Skill[];
}

interface CategoryDetails {
  description: string;
  icon: LucideIcon;
}

const categoryDetails: Record<string, CategoryDetails> = {
  'GHL Automation': {
    description: 'CRM journeys, pipelines, calendars, and messaging built to convert.',
    icon: Workflow,
  },
  Automation: {
    description: 'Routing, scoring, alerts, and logic that keep teams moving.',
    icon: GitBranch,
  },
  'Web Setup': {
    description: 'Conversion-focused pages and web experiences across GHL and WordPress.',
    icon: LayoutTemplate,
  },
  SEO: {
    description: 'Repeatable local visibility workflows, reviews, content, and rank reporting.',
    icon: Search,
  },
  Integrations: {
    description: 'APIs, webhooks, and data flows connecting the tools teams rely on.',
    icon: Plug,
  },
  'AI & Apps': {
    description: 'AI-assisted workflows and operational apps with useful, governed outputs.',
    icon: Bot,
  },
  'QA & Ops': {
    description: 'Testing, monitoring, and access checks that keep systems dependable.',
    icon: ShieldCheck,
  },
  Reporting: {
    description: 'Decision-ready dashboards that turn operational data into clear signals.',
    icon: ChartNoAxesCombined,
  },
  Support: {
    description: 'Practical troubleshooting across automations, apps, and user access.',
    icon: LifeBuoy,
  },
  Operations: {
    description: 'Clear SOPs, updates, and reporting that make delivery repeatable.',
    icon: ClipboardCheck,
  },
  'Core Strengths': {
    description: 'Engineering judgment, systems thinking, and a bias toward learning.',
    icon: Sparkles,
  },
};

const fallbackCategoryDetails: CategoryDetails = {
  description: 'A focused set of tools and practices for reliable digital delivery.',
  icon: Sparkles,
};

const proficiencyDotStyles: Record<Skill['proficiency'], string> = {
  Beginner: 'bg-slate-700',
  Intermediate: 'bg-slate-500',
  Advanced: 'bg-slate-200',
  Expert: 'bg-[#d7ff4f] shadow-[0_0_12px_rgba(215,255,79,0.5)]',
};

const proficiencyLevels: Skill['proficiency'][] = ['Expert', 'Advanced', 'Intermediate', 'Beginner'];

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const groupedSkills = skills.reduce((groups, skill) => {
    (groups[skill.category] ??= []).push(skill);
    return groups;
  }, {} as Record<string, Skill[]>);
  const skillGroups = Object.entries(groupedSkills);
  const expertSkillCount = skills.filter((skill) => skill.proficiency === 'Expert').length;
  const stats = [
    { value: skillGroups.length, label: 'Disciplines' },
    { value: skills.length, label: 'Capabilities' },
    { value: expertSkillCount, label: 'Expert level' },
  ];

  return (
    <section id="expertise" className="relative isolate overflow-hidden border-y border-white/[0.08] bg-white/[0.018] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_78%_0%,rgba(215,255,79,0.09),transparent_45%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16 xl:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="section-label">02 / Capabilities</p>
            <h2 className="section-title mt-5">The toolkit behind reliable growth systems.</h2>
            <p className="section-copy">Strategy is only useful when the system can carry it. Explore the disciplines I use to build, connect, and improve dependable operations.</p>

            <dl className="mt-10 grid grid-cols-3 border-y border-white/10">
              {stats.map((stat, index) => (
                <div key={stat.label} className={`py-5 ${index > 0 ? 'border-l border-white/10 pl-4 sm:pl-6' : 'pr-4 sm:pr-6'}`}>
                  <dd className="font-mono text-2xl font-medium tracking-[-0.04em] text-[#f5f3ed] sm:text-3xl">{String(stat.value).padStart(2, '0')}</dd>
                  <dt className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{stat.label}</dt>
                </div>
              ))}
            </dl>

            <div className="mt-8 border border-[#d7ff4f]/20 bg-[#d7ff4f]/[0.035] p-5">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.17em] text-[#d7ff4f]">
                <span className="h-2 w-2 rounded-full bg-[#d7ff4f] shadow-[0_0_14px_rgba(215,255,79,0.65)]" />
                Core focus
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">Connected systems that move cleanly from lead capture and automation to visibility and reporting.</p>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
              {proficiencyLevels.map((level) => (
                <div key={level} className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${proficiencyDotStyles[level]}`} />
                  {level}
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-5 flex items-end justify-between gap-6 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f5f3ed]">Capability directory</p>
                <p className="mt-1 text-sm text-slate-500">Select a discipline to explore the details.</p>
              </div>
              <p className="hidden font-mono text-xs uppercase tracking-[0.12em] text-slate-600 sm:block">{String(skillGroups.length).padStart(2, '0')} groups</p>
            </div>

            <div className="space-y-3">
              {skillGroups.map(([category, categorySkills], index) => {
                const details = categoryDetails[category] ?? fallbackCategoryDetails;
                const CategoryIcon = details.icon;

                return (
                  <ScrollReveal key={category}>
                    <details open={index === 0} className="group border border-white/10 bg-[#101010] transition-colors duration-300 open:border-white/20 open:bg-[#131313] hover:border-white/20">
                      <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7ff4f] sm:gap-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                        <span className="grid h-11 w-11 place-items-center border border-white/10 bg-white/[0.025] text-slate-400 transition-colors duration-300 group-open:border-[#d7ff4f] group-open:bg-[#d7ff4f] group-open:text-[#0a0a0a]">
                          <CategoryIcon size={19} strokeWidth={1.8} />
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] text-[#d7ff4f]">{String(index + 1).padStart(2, '0')}</span>
                            <h3 className="truncate text-lg font-semibold tracking-[-0.025em] text-[#f5f3ed] sm:text-xl">{category}</h3>
                          </div>
                          <p className="mt-1 hidden max-w-xl text-sm leading-6 text-slate-500 sm:block">{details.description}</p>
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 sm:hidden">{categorySkills.length} capabilities</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:block">{categorySkills.length} skills</span>
                          <span className="grid h-8 w-8 place-items-center border border-white/10 text-slate-500 transition-colors group-hover:text-white group-open:text-[#d7ff4f]">
                            <ChevronDown size={16} className="transition-transform duration-300 group-open:rotate-180" />
                          </span>
                        </div>
                      </summary>

                      <div className="border-t border-white/[0.08] px-5 pb-2 pt-1 sm:px-6">
                        <ul className="grid gap-x-8 sm:grid-cols-2">
                          {categorySkills.map((skill) => (
                            <li key={skill.id} className="flex min-h-14 items-start gap-3 border-b border-white/[0.07] py-3.5 last:border-b-0" title={skill.proficiency}>
                              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${proficiencyDotStyles[skill.proficiency]}`} />
                              <span className="min-w-0 flex-1 text-sm leading-5 text-slate-300">{skill.name}</span>
                              <span className="hidden text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-600 xl:block">{skill.proficiency}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
