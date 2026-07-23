export default function PortfolioMoments() {
  return (
    <section id="story" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <p className="section-label">04 / Beyond the build</p>
          <div>
            <h2 className="section-title">Technology is most meaningful when it shows up in the real world.</h2>
            <p className="section-copy">A glimpse of the curiosity, collaboration, and hands-on learning behind the systems I build.</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1120]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="/uploads/haroldExhibit.jpg"
                alt="Harold Madjos at the ACLC College of Butuan Project Exhibit 2025"
                className="image-reveal h-full w-full object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/35 to-transparent p-6 pt-24 sm:p-8 sm:pt-28">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Project Exhibit 2025</p>
                <p className="mt-2 max-w-lg text-lg font-semibold tracking-[-0.025em] text-white">Exploring AI, automation, and applied technology with the ACLC College of Butuan community.</p>
              </div>
            </div>
          </article>

          <article className="relative min-h-[450px] overflow-hidden rounded-2xl border border-cyan-200/15 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.24),transparent_38%),linear-gradient(145deg,#111d36,#090e1a)] p-6 sm:p-8">
            <div className="relative z-10 max-w-[14rem]">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-lime-300">Professional focus</p>
              <h3 className="mt-3 text-3xl font-semibold leading-[1.04] tracking-[-0.045em] text-white">Clear thinking. Reliable delivery.</h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">From ambitious ideas to practical systems that your team can use with confidence.</p>
            </div>
            <img
              src="/uploads/formal-suit-cutout.png"
              alt="Harold Madjos in a formal suit"
              className="image-reveal absolute -bottom-10 right-[-11%] h-[88%] w-auto max-w-none object-contain"
            />
          </article>
        </div>
      </div>
    </section>
  );
}
