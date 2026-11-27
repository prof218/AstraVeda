import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/common/page-hero";
import { DemoNote, Section } from "@/components/common/section";
import { HoroscopeBrowser, SignFinder } from "@/components/horoscope/horoscope-browser";
import { ZodiacCard } from "@/components/horoscope/zodiac-card";
import { CtaBand } from "@/components/common/cta-band";
import { zodiacSigns } from "@/data/horoscopes";

export const metadata: Metadata = {
  title: "Horoscope — Daily, Weekly, Monthly & Yearly",
  description: "Read daily, weekly, monthly and yearly horoscopes for all twelve zodiac signs, with traits, ruling planets and lucky colours.",
  alternates: { canonical: "/horoscope" },
};

function Fallback() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {zodiacSigns.map((z) => <li key={z.slug}><ZodiacCard sign={z} period="daily" /></li>)}
    </ul>
  );
}

export default function HoroscopePage() {
  return (
    <>
      <PageHero
        eyebrow="Horoscope"
        title={<>Your stars, <em className="text-gradient">today and beyond</em></>}
        description="General forecasts for each zodiac sign — written for reflection. For insight from your own chart, a personal consultation goes far deeper."
        crumbs={[{ label: "Horoscope" }]}
        accent="sky"
      >
        <div className="max-w-xl"><SignFinder /></div>
      </PageHero>
      <Section className="pt-2 sm:pt-6">
        <Suspense fallback={<Fallback />}>
          <HoroscopeBrowser />
        </Suspense>
        <div className="mt-10 flex justify-center"><DemoNote>Sample horoscope text — for entertainment and reflection</DemoNote></div>
      </Section>
      <CtaBand title={<>Beyond your <em className="text-gradient">Sun sign</em></>} text="A personal horoscope prediction uses your full birth chart, current dasha and transits." href="/book-consultation?service=vedic" />
    </>
  );
}
