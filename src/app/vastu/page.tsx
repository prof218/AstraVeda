import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/common/page-hero";
import { Section, SectionHeading } from "@/components/common/section";
import { Icon } from "@/components/ui/icon";
import { Accordion } from "@/components/ui/accordion";
import { CtaBand } from "@/components/common/cta-band";
import { Artwork } from "@/components/cosmic/artwork";
import type { IconName } from "@/types";

export const metadata: Metadata = {
  title: "Vastu Consultation — Home, Office & Commercial",
  description: "Practical, mostly non-demolition Vastu Shastra consultations for homes, offices and commercial spaces — online or on-site.",
  alternates: { canonical: "/vastu" },
};

const types: { icon: IconName; title: string; text: string; points: string[]; hue: number }[] = [
  { icon: "home", title: "Residential Vastu", hue: 160, text: "Homes, apartments and villas — for harmony, health and restful sleep.",
    points: ["Entrance & main door", "Kitchen and fire zone", "Bedroom placement", "Puja room direction"] },
  { icon: "store", title: "Commercial Vastu", hue: 40, text: "Shops, showrooms, factories and hospitality spaces — for footfall and growth.",
    points: ["Cash counter placement", "Display & storage zones", "Signage direction", "Machinery & stock layout"] },
  { icon: "building", title: "Office Vastu", hue: 220, text: "Corporate offices and home workspaces — for focus, leadership and teamwork.",
    points: ["Owner's cabin direction", "Seating & facing", "Meeting room zone", "Server & electricals"] },
];

const directions = [
  ["North", "Wealth & opportunity", "Kubera"], ["North-East", "Clarity & spirituality", "Ishaan"],
  ["East", "Health & social ties", "Indra"], ["South-East", "Fire, energy & cash flow", "Agni"],
  ["South", "Fame & rest", "Yama"], ["South-West", "Stability & relationships", "Nairutya"],
  ["West", "Gains & profits", "Varuna"], ["North-West", "Support & movement", "Vayu"],
];

const process = [
  { t: "Share your floor plan", d: "Send a scaled plan with the north direction marked (or a compass video)." },
  { t: "Zone analysis", d: "Your space is mapped into 16 zones and five elements." },
  { t: "Consultation call", d: "A 60-minute walkthrough of findings and priorities." },
  { t: "Remedy plan", d: "Practical, mostly non-demolition changes — colours, placement, elements." },
];

export default function VastuPage() {
  return (
    <>
      <PageHero
        eyebrow="Vastu Shastra"
        title={<>Spaces in harmony <em className="text-gradient">with the cosmos</em></>}
        description="The ancient science of direction and space — applied practically, with remedies that rarely require construction."
        crumbs={[{ label: "Vastu" }]}
        accent="sky"
      />
      <Section className="pt-2 sm:pt-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {types.map((t) => (
            <article key={t.title} data-reveal className="group overflow-hidden rounded-[20px] border border-line bg-white/[0.02] transition-colors hover:border-lavender/30">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Artwork variant="yantra" hue={t.hue} seed={t.title} className="transition-transform duration-[1.2s]" />
                <span className="absolute left-5 top-5 flex size-11 items-center justify-center rounded-xl border border-white/15 bg-void/60 text-lavender backdrop-blur"><Icon name={t.icon} className="size-5" /></span>
              </div>
              <div className="p-7">
                <h2 className="text-3xl">{t.title}</h2>
                <p className="mt-2 text-sm text-muted">{t.text}</p>
                <ul className="mt-5 space-y-2">
                  {t.points.map((p) => <li key={p} className="flex gap-2.5 text-sm text-star/85"><Check className="mt-0.5 size-4 shrink-0 text-lavender" aria-hidden />{p}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-transparent via-abyss to-transparent">
        <SectionHeading eyebrow="The eight directions" title={<>Every direction <em className="text-gradient">has a purpose</em></>} />
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {directions.map(([dir, meaning, deity]) => (
            <div key={dir} data-reveal className="rounded-2xl border border-line bg-white/[0.02] p-5 text-center">
              <p className="font-display text-2xl text-star">{dir}</p>
              <p className="mt-1 text-xs text-lavender">{deity}</p>
              <p className="mt-2 text-xs text-muted">{meaning}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Consultation details" title={<>How a Vastu <em className="text-gradient">consultation works</em></>}
              description="Available online for most properties; on-site visits can be arranged for larger commercial projects (placeholder)." />
            <ol className="mt-10 space-y-6">
              {process.map((p, i) => (
                <li key={p.t} data-reveal className="flex gap-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-lavender/40 font-display text-lg text-lavender">{i + 1}</span>
                  <div><h3 className="font-semibold text-star">{p.t}</h3><p className="mt-1 text-sm text-muted">{p.d}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="mb-6 text-3xl">Common questions</h2>
            <Accordion name="vastu-faq" items={[
              { q: "Will I need to demolish anything?", a: "Very rarely. Most corrections involve rearrangement, colours, lighting, mirrors or element balancing." },
              { q: "Can Vastu be done for a rented home?", a: "Yes. Remedies for rented spaces focus on placement and portable corrections." },
              { q: "What do I need to share?", a: "A floor plan (hand-drawn is fine) with north marked, plus photos of key rooms if possible." },
              { q: "How long does it take?", a: "Analysis is prepared before a 60-minute consultation. Larger commercial spaces may need longer." },
            ]} />
          </div>
        </div>
      </Section>
      <CtaBand title={<>Bring harmony <em className="text-gradient">to your space</em></>} text="Book a Vastu consultation for your home, office or business." href="/book-consultation?service=vastu" label="Book Vastu Consultation" />
    </>
  );
}
