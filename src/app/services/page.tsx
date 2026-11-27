import type { Metadata } from "next";
import { services } from "@/data/services";
import { PageHero } from "@/components/common/page-hero";
import { ServiceCard } from "@/components/services/service-card";
import { Section, SectionHeading } from "@/components/common/section";
import { PricingCards } from "@/components/common/pricing-cards";
import { CtaBand } from "@/components/common/cta-band";
import { HowItWorks } from "@/components/home/how-it-works";

export const metadata: Metadata = {
  title: "Astrology Services",
  description: "Vedic astrology, Kundli analysis, marriage compatibility, career, finance, numerology, Vastu and gemstone consultations — explained clearly and prepared personally.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={<>Consultations for <em className="text-gradient">every question</em></>}
        description="Each service is prepared from your own birth details and delivered by video, audio or chat — with clear, practical guidance you can act on."
        crumbs={[{ label: "Services" }]}
      />
      <Section className="pt-4 sm:pt-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
        </div>
      </Section>
      <HowItWorks />
      <Section>
        <SectionHeading eyebrow="Pricing" title={<>Simple, <em className="text-gradient">transparent</em> options</>} description="Demo prices shown — final fees will be confirmed by the client." />
        <div className="mt-20"><PricingCards /></div>
      </Section>
      <CtaBand />
    </>
  );
}
