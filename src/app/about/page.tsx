import type { Metadata } from "next";
import { Award } from "lucide-react";
import { astrologer } from "@/data/astrologer";
import { PageHero } from "@/components/common/page-hero";
import { Portrait } from "@/components/common/portrait";
import { DemoNote, Section, SectionHeading } from "@/components/common/section";
import { Stats } from "@/components/home/stats";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { CtaBand } from "@/components/common/cta-band";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About the Astrologer",
  description: `Meet ${astrologer.name} — ${astrologer.experienceYears}+ years of classical Vedic astrology, numerology and Vastu practice with a calm, practical approach.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={<>Classical Jyotish, <em className="text-gradient">honestly practised</em></>}
        description={astrologer.shortBio}
        crumbs={[{ label: "About" }]}
      />

      <Section className="pt-6 sm:pt-10">
        <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div data-reveal="scale" className="mx-auto w-full max-w-md lg:sticky lg:top-28">
            <Portrait className="aspect-[4/5]" />
          </div>
          <div>
            <p className="eyebrow mb-4">Background & experience</p>
            <h2 className="text-4xl sm:text-5xl">{astrologer.name}</h2>
            <p className="mt-3 text-sm text-lavender/80">{astrologer.title}</p>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
              {astrologer.intro.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
            </div>

            <ol className="relative mt-12 space-y-8 border-l border-line pl-8" aria-label="Career timeline">
              {astrologer.timeline.map((t) => (
                <li key={t.year} data-reveal className="relative">
                  <span aria-hidden className="absolute -left-[2.4rem] top-1.5 size-3 rounded-full border border-lavender bg-void" />
                  <p className="font-display text-2xl text-gradient-solar">{t.year}</p>
                  <p className="mt-1 text-sm text-muted">{t.text}</p>
                </li>
              ))}
            </ol>
            <DemoNote className="mt-10">Placeholder biography and timeline</DemoNote>
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-transparent via-abyss to-transparent">
        <SectionHeading eyebrow="Philosophy & approach" title={<>How every reading <em className="text-gradient">is approached</em></>} />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {astrologer.philosophy.map((p, i) => (
            <article key={p.title} data-reveal className="relative rounded-2xl border border-line bg-white/[0.025] p-8">
              <span className="font-display text-6xl leading-none text-violet/40">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-3xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading align="left" eyebrow="Achievements" title={<>Recognition along <em className="text-gradient">the way</em></>}
            description="Milestones from the practice so far. These entries are placeholders until the client provides verified details." />
          <ul className="grid gap-4 sm:grid-cols-2">
            {astrologer.achievements.map((a) => (
              <li key={a.label} data-reveal className="rounded-2xl border border-line bg-white/[0.025] p-6">
                <Award className="size-6 text-solar" aria-hidden />
                <p className="mt-4 font-semibold text-star">{a.label}</p>
                <p className="mt-1 text-xs text-faint">{a.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-14">
          <h3 className="mb-5 text-sm font-medium text-star/60">Expertise</h3>
          <ul className="flex flex-wrap gap-2.5">
            {astrologer.expertise.map((e) => (
              <li key={e} className="rounded-full border border-line bg-white/[0.03] px-4 py-2 text-sm text-star/85">{e}</li>
            ))}
          </ul>
          <ButtonLink href="/services" variant="secondary" className="mt-10">Explore services</ButtonLink>
        </div>
      </Section>

      <Stats />
      <WhyChooseUs />
      <CtaBand />
    </>
  );
}
