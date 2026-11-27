import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { DemoNote, Section, SectionHeading } from "@/components/common/section";
import { ProductCatalog } from "@/components/remedies/product-catalog";
import { CtaBand } from "@/components/common/cta-band";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/types";

export const metadata: Metadata = {
  title: "Remedies — Gemstones, Yantras & Rudraksha",
  description: "Explore astrological remedies: certified gemstones, yantras, rudraksha and mantra plans — recommended only after a careful chart review.",
  alternates: { canonical: "/remedies" },
};

const pillars: { icon: IconName; title: string; text: string }[] = [
  { icon: "gem", title: "Gemstones", text: "Strengthen beneficial planets — only after a chart review." },
  { icon: "sparkles", title: "Yantras", text: "Sacred geometry for focus, protection and prosperity." },
  { icon: "flower", title: "Rudraksha", text: "Sacred beads traditionally worn for calm and strength." },
  { icon: "sun", title: "Astrology remedies", text: "Mantra, charity and puja plans — accessible to everyone." },
];

export default function RemediesPage() {
  return (
    <>
      <PageHero
        eyebrow="Remedies"
        title={<>Gentle remedies, <em className="text-gradient-solar">thoughtfully chosen</em></>}
        description="Traditional remedies support your chart — but they are never a shortcut. Here is our curated catalogue, with honest guidance."
        crumbs={[{ label: "Remedies" }]}
        accent="solar"
      />
      <Section className="pt-0 sm:pt-0">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <li key={p.title} data-reveal className="rounded-2xl border border-line bg-white/[0.02] p-5">
              <Icon name={p.icon} className="size-5 text-solar" />
              <h2 className="mt-3 text-2xl">{p.title}</h2>
              <p className="mt-1 text-sm text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section className="pt-0 sm:pt-0">
        <SectionHeading align="left" eyebrow="Catalogue" title="Remedies & sacred products">
          <DemoNote>Demo catalogue and pricing — no checkout in this prototype</DemoNote>
        </SectionHeading>
        <div className="mt-10"><ProductCatalog /></div>
      </Section>
      <CtaBand title={<>Not sure which remedy <em className="text-gradient">is right?</em></>} text="A gemstone consultation checks your chart first — and suggests affordable alternatives." href="/book-consultation?service=general" />
    </>
  );
}
