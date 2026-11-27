import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { Section, SectionHeading } from "@/components/common/section";
import { KundliForm } from "@/components/kundli/kundli-form";
import { Accordion } from "@/components/ui/accordion";
import { CtaBand } from "@/components/common/cta-band";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/types";

export const metadata: Metadata = {
  title: "Free Kundli — Birth Chart Preview",
  description: "Enter your birth details to preview a Kundli layout, your Sun sign and Life Path number, then book a detailed Kundli analysis.",
  alternates: { canonical: "/kundli" },
};

const reveals: { icon: IconName; title: string; text: string }[] = [
  { icon: "sun", title: "Lagna (Ascendant)", text: "The sign rising at your birth — your temperament, body and life approach." },
  { icon: "moon", title: "Moon sign & Nakshatra", text: "Your emotional nature and the lunar mansion that colours your mind." },
  { icon: "orbit", title: "Planetary placements", text: "Where each of the nine grahas sits by sign and house, and how strong it is." },
  { icon: "calendar", title: "Dasha periods", text: "The planetary periods that time the chapters and turning points of life." },
];

const faqs = [
  { q: "Why does birth time matter so much?", a: "The Lagna changes roughly every two hours, and house positions shift with it. Even a 10–15 minute difference can change divisional charts." },
  { q: "Is this demo calculating my real chart?", a: "No. This page shows an illustrative layout plus your Sun sign and Life Path number. A real Kundli needs an astronomical ephemeris calculation, which will be connected with the backend or prepared by the astrologer." },
  { q: "What if I don't know my exact birth time?", a: "Mention it when you book. The astrologer can discuss birth-time rectification using key life events." },
];

export default function KundliPage() {
  return (
    <>
      <PageHero
        eyebrow="Kundli"
        title={<>Your Janam Kundli, <em className="text-gradient-solar">beautifully explained</em></>}
        description="A Kundli is a snapshot of the sky at the moment you were born. Share your details to see a preview — then let an expert read it for you."
        crumbs={[{ label: "Kundli" }]}
        accent="solar"
      />
      <Section className="pt-2 sm:pt-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass rounded-[20px] p-6 sm:p-10">
            <h2 className="mb-2 text-3xl">Birth details</h2>
            <p className="mb-8 text-sm text-muted">All fields are required for an accurate chart.</p>
            <KundliForm />
          </div>
          <div>
            <h2 className="text-3xl">What your Kundli reveals</h2>
            <ul className="mt-6 space-y-4">
              {reveals.map((r) => (
                <li key={r.title} data-reveal className="flex gap-4 rounded-2xl border border-line bg-white/[0.02] p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-solar"><Icon name={r.icon} className="size-5" /></span>
                  <div><h3 className="font-semibold text-star">{r.title}</h3><p className="mt-1 text-sm text-muted">{r.text}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Section className="pt-0 sm:pt-0">
        <SectionHeading eyebrow="Questions" title="About Kundli" />
        <Accordion items={faqs} name="kundli-faq" className="mx-auto mt-12 max-w-3xl" />
      </Section>
      <CtaBand title={<>Have your chart <em className="text-gradient-solar">read by an expert</em></>} text="A Detailed Kundli Analysis covers D1, D9 and D10 charts, doshas, yogas and a 5-year dasha roadmap." href="/book-consultation?service=kundli" label="Book Kundli Analysis" />
    </>
  );
}
