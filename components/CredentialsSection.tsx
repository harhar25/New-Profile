import type { ProfileData } from '@/lib/profileData';

export default function CredentialsSection({ certifications }: { certifications: ProfileData['certifications'] }) {
  if (!certifications.length) return null;
  return (
    <section id="credentials" className="bg-[#050505] px-5 py-24 text-[#f1f0eb] sm:px-8 lg:px-12 lg:py-36">
      <div className="page-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-2">
            <p className="chapter-label text-white/40">Credentials / Continuous learning</p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="editorial-heading max-w-[9ch] font-light uppercase">
              Learning that
              <span className="block">supports</span>
              <span className="block">real delivery.</span>
            </h2>
          </div>
          <div className="flex items-end lg:col-span-3 lg:pb-3">
            <p className="max-w-xs text-sm leading-6 text-white/50">Formal foundations and hands-on practice, applied where systems meet real operational needs.</p>
          </div>
        </div>

        <div className="mt-20 border-t border-white/20 lg:mt-32">
          {certifications.map((certification, index) => (
            <article key={`${certification.name}-${certification.date}`} className="grid gap-6 border-b border-white/20 py-9 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-10 lg:py-11">
              <span className="font-mono text-[10px] text-[#d7ff4f]">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-3xl font-light uppercase leading-none tracking-[-0.045em] sm:text-4xl">{certification.name}</h3>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.13em] text-white/35">{certification.issuer}</p>
              </div>
              <p className="text-sm font-light uppercase text-white/55">{certification.date}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

