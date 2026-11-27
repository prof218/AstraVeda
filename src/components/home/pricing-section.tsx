import { PricingCards } from "@/components/common/pricing-cards";
import { Section, SectionHeading } from "@/components/common/section";

export function PricingSection() {
  return (
    <Section id="pricing" labelledBy="pricing-title">
      <SectionHeading
        id="pricing-title"
        eyebrow="Consultation Pricing"
        title={<>Choose the depth of <em className="text-gradient">your reading</em></>}
        description="Transparent, simple options. Prices shown are demo values and will be replaced with confirmed fees."
      />
      <div className="mt-20">
        <PricingCards />
      </div>
    </Section>
  );
}
