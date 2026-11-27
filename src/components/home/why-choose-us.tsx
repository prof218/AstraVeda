import type { IconName } from "@/types";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeading } from "@/components/common/section";
import { ZodiacWheel } from "@/components/cosmic/zodiac-wheel";
import { cn } from "@/lib/utils";

export const trustFactors: { title: string; text: string; icon: IconName }[] = [
  { title: "Experienced Astrologer", text: "Nearly two decades of classical Jyotish practice and thousands of charts read.", icon: "star" },
  { title: "Personalised Consultations", text: "Every session is prepared from your own chart — never a template reading.", icon: "user" },
  { title: "Traditional Knowledge", text: "Rooted in Parashari and Jaimini texts, explained in clear, modern language.", icon: "book" },
  { title: "Confidential Sessions", text: "Your birth details and questions stay private, always.", icon: "shield" },
  { title: "Practical Guidance", text: "Clear next steps and simple remedies — no fear, no pressure to buy.", icon: "lightbulb" },
  { title: "Online, Worldwide", text: "Consult by video, audio or chat from anywhere, in English or Hindi.", icon: "orbit" },
];

function Factor({ f, align }: { f: (typeof trustFactors)[number]; align: "left" | "right" }) {
  return (
    <li data-reveal className={cn("group flex gap-5", align === "right" && "lg:flex-row-reverse lg:text-right")}>
      <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-white/[0.04] text-lavender transition-colors duration-500 group-hover:border-lavender/40 group-hover:text-star">
        <Icon name={f.icon} className="size-5" />
      </span>
      <div>
        <h3 className="font-display text-2xl leading-tight">{f.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
      </div>
    </li>
  );
}

export function WhyChooseUs() {
  return (
    <Section labelledBy="why-title" className="overflow-hidden bg-gradient-to-b from-transparent via-abyss to-transparent">
      <SectionHeading
        id="why-title"
        eyebrow="Why Choose Us"
        title={<>A practice built on <em className="text-gradient">trust</em></>}
        description="Astrology is personal. Here is what you can expect from every consultation."
      />
      <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,26rem)_1fr] lg:gap-10">
        <ul className="order-2 space-y-10 lg:order-1">
          {trustFactors.slice(0, 3).map((f) => <Factor key={f.title} f={f} align="right" />)}
        </ul>
        <div data-reveal="scale" className="order-1 mx-auto w-full max-w-[22rem] lg:order-2 lg:max-w-none">
          <ZodiacWheel />
        </div>
        <ul className="order-3 space-y-10">
          {trustFactors.slice(3).map((f) => <Factor key={f.title} f={f} align="left" />)}
        </ul>
      </div>
    </Section>
  );
}
