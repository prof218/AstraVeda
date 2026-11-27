import type { Metadata } from "next";
import { Hero } from "@/components/hero/hero";
import { Stats } from "@/components/home/stats";
import { Intro } from "@/components/home/intro";
import { ServicesSection } from "@/components/home/services-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { HowItWorks } from "@/components/home/how-it-works";
import { HoroscopePreview } from "@/components/home/horoscope-preview";
import { KundliSection } from "@/components/home/kundli-section";
import { AstrologerProfile } from "@/components/home/astrologer-profile";
import { PricingSection } from "@/components/home/pricing-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { BlogSection } from "@/components/home/blog-section";
import { FinalCta } from "@/components/home/final-cta";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} — Discover What The Universe Has Written For You` },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Intro />
      <ServicesSection />
      <WhyChooseUs />
      <HowItWorks />
      <HoroscopePreview />
      <KundliSection />
      <AstrologerProfile />
      <PricingSection />
      <TestimonialsSection />
      <BlogSection />
      <FinalCta />
    </>
  );
}
