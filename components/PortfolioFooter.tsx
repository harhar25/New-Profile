'use client';

import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, Code, Mail } from 'lucide-react';
import { usePortfolio } from './PortfolioShell';

export default function PortfolioFooter() {
  const { profile, openContact } = usePortfolio();
  const { personalInfo, socialLinks } = profile;
  return (
    <footer id="contact" className="bg-[#eceae4] px-5 pb-8 pt-24 text-[#0a0a0a] sm:px-8 lg:px-12 lg:pt-36">
      <div className="page-shell">
        <p className="chapter-label text-black/45">Let’s connect / Contact</p>
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-end">
          <h2 className="editorial-heading max-w-[11ch] font-light uppercase lg:col-span-9">
            Better systems
            <span className="block">start with a</span>
            <span className="block">conversation.</span>
          </h2>
          <div className="lg:col-span-3 lg:pb-3">
            <p className="text-sm leading-6 text-black/50">Have a workflow that feels harder than it should? Let&apos;s shape a clearer way forward.</p>
            <button
              type="button"
              onClick={openContact}
              aria-haspopup="dialog"
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#d7ff4f] hover:text-black"
            >
              Start a conversation
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        <div className="mt-24 grid gap-8 border-y border-black/20 py-7 text-sm sm:grid-cols-2 lg:mt-36 lg:grid-cols-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-black/35">Based in</p>
            <p className="mt-2">{personalInfo.location}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-black/35">Email</p>
            <a href={`mailto:${personalInfo.email}`} className="mt-2 block transition hover:opacity-50">{personalInfo.email}</a>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-black/35">Phone</p>
            <p className="mt-2">{personalInfo.phone || 'Available on request'}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-black/35">Socials</p>
            <div className="mt-2 flex flex-wrap gap-4">
              {socialLinks.linkedin && <a className="footer-link" href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><BriefcaseBusiness size={14} /> LinkedIn</a>}
              {socialLinks.github && <a className="footer-link" href={socialLinks.github} target="_blank" rel="noopener noreferrer"><Code size={14} /> GitHub</a>}
              <a className="footer-link" href={`mailto:${personalInfo.email}`}><Mail size={14} /> Email</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-[9px] font-bold uppercase tracking-[0.12em] text-black/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.</p>
          <Link href="/#about" className="transition hover:text-black">Back to start ↑</Link>
        </div>
      </div>
    </footer>
  );
}

