import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

export default function PortfolioMoments() {
  return (
    <section id="story" className="overflow-hidden bg-[#eceae4] px-5 py-24 text-[#0a0a0a] sm:px-8 lg:px-12 lg:py-36">
      <div className="page-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-2">
            <p className="chapter-label text-black/45">Chapter V / Beyond</p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="editorial-heading max-w-[9ch] font-light uppercase">
              Built with
              <span className="block">curiosity.</span>
              <span className="block">Grounded in</span>
              <span className="block">delivery.</span>
            </h2>
          </div>
          <div className="flex items-end lg:col-span-3 lg:pb-3">
            <p className="max-w-xs text-sm leading-6 text-black/50">The work is technical. The journey behind it is shaped by learning, collaboration, and showing up for the details.</p>
          </div>
        </div>

        <div className="mt-20 grid gap-6 lg:mt-32 lg:grid-cols-12 lg:items-end">
          <ScrollReveal className="lg:col-span-8">
            <figure>
              <div className="group relative aspect-[4/5] overflow-hidden bg-black sm:aspect-[16/11]">
                <Image
                  src="/uploads/haroldExhibit.jpg"
                  alt="Harold Madjos at the ACLC College of Butuan Project Exhibit 2025"
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover grayscale transition duration-700 group-hover:scale-[1.02] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <p className="absolute bottom-6 left-6 max-w-md text-3xl font-light uppercase leading-none tracking-[-0.04em] text-white sm:bottom-9 sm:left-9 sm:text-5xl">Ideas become stronger when they are shared.</p>
              </div>
              <figcaption className="mt-4 flex items-center justify-between border-t border-black/20 pt-4 text-[9px] font-bold uppercase tracking-[0.13em] text-black/45">
                <span>Project Exhibit 2025 / AI & Automation</span>
                <span>Butuan City</span>
              </figcaption>
            </figure>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-4 lg:pb-16">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
              <div className="editorial-grid absolute inset-0 opacity-30" />
              <Image
                src="/uploads/harold-portrait-cutout-v2.png"
                alt="Harold Madjos in formal Filipino attire"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-contain object-bottom grayscale"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <p className="absolute left-5 top-5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#d7ff4f]">Independent specialist / 2026</p>
              <p className="absolute bottom-6 left-5 max-w-[13rem] text-2xl font-light uppercase leading-none tracking-[-0.04em] text-white">Thoughtful systems. Clear communication.</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
