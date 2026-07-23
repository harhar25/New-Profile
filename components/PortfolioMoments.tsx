import ScrollReveal from '@/components/ScrollReveal';

export default function PortfolioMoments() {
  return (
    <section id="story" className="bg-[#e9e6dc] px-5 py-20 text-[#0d1728] sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#256b83]">04 / Beyond the build</p>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl">The work is technical. The journey is personal.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">Moments that reflect the curiosity, collaboration, and consistent learning behind every system I build.</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:items-end">
          <ScrollReveal className="overflow-hidden rounded-[1.5rem] bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:p-4">
            <div className="overflow-hidden rounded-[1rem]">
              <img
                src="/uploads/haroldExhibit.jpg"
                alt="Harold Madjos at the ACLC College of Butuan Project Exhibit 2025"
                className="h-auto w-full object-cover"
              />
            </div>
            <figcaption className="flex flex-col gap-2 px-2 pb-2 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-sm font-bold text-[#0d1728]">Project Exhibit 2025</p><p className="mt-1 text-sm text-slate-500">ACLC College of Butuan · AI & automation</p></div>
              <span className="font-mono text-xs text-slate-400">01 — 01</span>
            </figcaption>
          </ScrollReveal>

          <ScrollReveal className="relative min-h-[510px] overflow-hidden rounded-[1.5rem] bg-[#122541] p-7 text-white sm:p-9">
            <div className="relative z-10 max-w-[14rem]">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#b8ed61]">Independent specialist</p>
              <h3 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.045em]">Building systems people can trust.</h3>
              <p className="mt-5 text-sm leading-6 text-slate-300">Thoughtful automation, clear communication, and a focus on results that last.</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent" />
            <img
              src="/uploads/MADJOS%2C%20HAROLD%20JEY%20N%20BSCS%20%2813%29%202%20rr%202.jpg"
              alt="Harold Madjos in formal attire"
              className="absolute inset-x-0 bottom-0 h-[72%] w-full object-cover object-top"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
