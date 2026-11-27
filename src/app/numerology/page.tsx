import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { Section, SectionHeading } from "@/components/common/section";
import { LifePathCalculator, NameCalculator } from "@/components/numerology/calculators";
import { CtaBand } from "@/components/common/cta-band";
import { numberMeanings } from "@/data/numerology";

export const metadata: Metadata = {
  title: "Numerology — Name & Date of Birth",
  description: "Calculate your Life Path and Destiny numbers for free, learn what each number means, and book a personal numerology consultation.",
  alternates: { canonical: "/numerology" },
};

export default function NumerologyPage() {
  const core = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <>
      <PageHero
        eyebrow="Numerology"
        title={<>The quiet <em className="text-gradient">language of numbers</em></>}
        description="Numerology finds meaning in the numbers of your birth date and name. Use the free calculators below, then explore a full reading."
        crumbs={[{ label: "Numerology" }]}
        accent="sky"
      />
      <Section className="pt-2 sm:pt-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <LifePathCalculator />
          <NameCalculator />
        </div>
        <p className="mt-5 text-center text-xs text-faint">Calculations run in your browser using the Pythagorean system — nothing is stored or sent.</p>
      </Section>

      <Section className="bg-gradient-to-b from-transparent via-abyss to-transparent">
        <SectionHeading eyebrow="Overview" title={<>The nine <em className="text-gradient">core numbers</em></>} description="Each number carries a distinct vibration. Master numbers 11, 22 and 33 are kept unreduced." />
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {core.map((n) => {
            const m = numberMeanings[n];
            return (
              <li key={n} data-reveal className="group relative overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-7 transition-colors hover:border-lavender/30">
                <span aria-hidden className="absolute -right-4 -top-8 font-display text-[9rem] leading-none text-white/[0.04] transition-colors group-hover:text-violet/15">{n}</span>
                <p className="font-display text-5xl text-gradient">{n}</p>
                <h3 className="mt-3 text-2xl">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{m.text}</p>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[11, 22, 33].map((n) => (
            <div key={n} data-reveal className="rounded-2xl border border-solar/25 bg-solar/[0.04] p-6">
              <p className="font-display text-4xl text-gradient-solar">{n}</p>
              <h3 className="mt-2 text-xl">{numberMeanings[n].title}</h3>
              <p className="mt-1 text-sm text-muted">{numberMeanings[n].text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div data-reveal>
            <p className="eyebrow mb-4">Name numerology</p>
            <h2 className="text-4xl">Is your name working for you?</h2>
            <p className="mt-4 text-muted">Every letter carries a number. A consultation examines your Destiny, Soul Urge and Personality numbers and how they align with your Life Path — useful when naming a child, a business, or considering a spelling change.</p>
          </div>
          <div data-reveal>
            <p className="eyebrow mb-4">Date of birth numerology</p>
            <h2 className="text-4xl">Cycles &amp; personal years</h2>
            <p className="mt-4 text-muted">Beyond your Life Path, your birth date reveals personal year cycles. Knowing which year of the nine-year cycle you are in helps you plan launches, moves and commitments.</p>
          </div>
        </div>
      </Section>
      <CtaBand title={<>A complete <em className="text-gradient">numerology reading</em></>} text="Core numbers, name analysis, lucky dates and your personal year forecast — in a 30-minute session." href="/book-consultation?service=numerology" label="Book Numerology Consultation" />
    </>
  );
}
