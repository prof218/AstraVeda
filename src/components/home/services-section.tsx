import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";
import { ServiceCard } from "@/components/services/service-card";
import { Section, SectionHeading } from "@/components/common/section";
import { ButtonLink } from "@/components/ui/button";

export function ServicesSection() {
  return (
    <Section id="services" labelledBy="services-title" className="overflow-hidden">
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          id="services-title"
          align="left"
          eyebrow="Our Astrology Services"
          title={<>Guidance for every <em className="text-gradient">chapter of life</em></>}
          description="From your first chart reading to marriage matching, career timing and harmonising your home — each consultation is prepared personally from your birth details."
        />
        <ButtonLink href="/services" variant="secondary" className="shrink-0">
          View all services <ArrowRight className="size-4" />
        </ButtonLink>
      </div>
      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((s, i) => (
          <ServiceCard
            key={s.slug}
            service={s}
            index={i}
            className={i === 0 ? "xl:col-span-2 xl:row-span-1" : i === 9 ? "lg:col-span-3 xl:col-span-2" : undefined}
          />
        ))}
      </div>
    </Section>
  );
}
