import { ArrowRight } from "lucide-react";
import { astrologer } from "@/data/astrologer";
import { ButtonLink } from "@/components/ui/button";
import { Portrait } from "@/components/common/portrait";
import { Section } from "@/components/common/section";

export function Intro() {
  return (
    <Section labelledBy="intro-title" className="overflow-hidden">
      <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        {/* Visual */}
        <div data-reveal="scale" className="relative mx-auto w-full max-w-md lg:max-w-none">
          <Portrait className="relative aspect-[4/5]" />
          <div className="glass absolute -bottom-6 -right-2 rounded-2xl px-5 py-4 sm:-right-8">
            <p className="font-display text-4xl leading-none text-gradient-solar">{astrologer.experienceYears}+</p>
            <p className="mt-1 text-[0.7rem] text-muted">Years of practice</p>
          </div>
        </div>

        {/* Copy */}
        <div>
          <div data-reveal>
            <p className="eyebrow mb-5">Meet your astrologer</p>
            <h2 id="intro-title" className="text-4xl leading-[1.05] sm:text-5xl lg:text-[3.6rem]">
              Ancient Wisdom for Your <em className="text-gradient">Modern Journey</em>
            </h2>
          </div>
          <div data-reveal className="mt-7 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            <p>
              <span className="text-star">{astrologer.name}</span> — {astrologer.shortBio}
            </p>
            <p>{astrologer.intro[1]}</p>
          </div>
          <ul data-reveal className="mt-8 flex flex-wrap gap-2" aria-label="Areas of expertise">
            {astrologer.expertise.slice(0, 6).map((e) => (
              <li key={e} className="rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-xs text-star/80">{e}</li>
            ))}
          </ul>
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-6">
            <ButtonLink href="/about" variant="secondary">
              Read More <ArrowRight className="size-4" />
            </ButtonLink>
            <p className="font-display text-2xl italic text-lavender/80">{astrologer.name}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
