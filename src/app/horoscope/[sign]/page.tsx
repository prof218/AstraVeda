import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getSign, zodiacSigns } from "@/data/horoscopes";
import { PageHero } from "@/components/common/page-hero";
import { DemoNote, Section } from "@/components/common/section";
import { SignForecast } from "@/components/horoscope/sign-forecast";
import { CtaBand } from "@/components/common/cta-band";

export function generateStaticParams() {
  return zodiacSigns.map((z) => ({ sign: z.slug }));
}

export async function generateMetadata({ params }: PageProps<"/horoscope/[sign]">): Promise<Metadata> {
  const { sign } = await params;
  const z = getSign(sign);
  if (!z) return { title: "Sign not found" };
  return {
    title: `${z.name} Horoscope (${z.dates})`,
    description: `${z.name} (${z.sanskrit}) daily, weekly, monthly and yearly horoscope — ${z.element} sign ruled by ${z.ruler}.`,
    alternates: { canonical: `/horoscope/${z.slug}` },
  };
}

export default async function SignPage({ params }: PageProps<"/horoscope/[sign]">) {
  const { sign: slug } = await params;
  const sign = getSign(slug);
  if (!sign) notFound();
  const i = zodiacSigns.findIndex((z) => z.slug === sign.slug);
  const prev = zodiacSigns[(i + 11) % 12];
  const next = zodiacSigns[(i + 1) % 12];

  const facts: [string, string][] = [
    ["Dates", sign.dates],
    ["Sanskrit", sign.sanskrit],
    ["Element", sign.element],
    ["Quality", sign.quality],
    ["Ruling planet", sign.ruler],
    ["Lucky colour", sign.luckyColor],
    ["Lucky number", String(sign.luckyNumber)],
  ];

  return (
    <>
      <PageHero
        eyebrow={`${sign.element} sign · ruled by ${sign.ruler}`}
        title={<span className="flex items-center gap-5"><span className="glyph text-gradient text-[0.85em]">{sign.symbol}</span>{sign.name}</span>}
        description={`${sign.sanskrit} · ${sign.dates}`}
        crumbs={[{ label: "Horoscope", href: "/horoscope" }, { label: sign.name }]}
      />
      <Section className="pt-2 sm:pt-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <Suspense fallback={<p className="font-display text-3xl">{sign.horoscope.daily}</p>}>
              <SignForecast sign={sign} />
            </Suspense>
            <DemoNote className="mt-8">Sample horoscope text</DemoNote>
          </div>
          <aside className="space-y-6">
            <div className="glass rounded-2xl p-7">
              <h2 className="text-sm font-medium text-star/60">Sign profile</h2>
              <dl className="mt-5 divide-y divide-line">
                {facts.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5 text-sm"><dt className="text-faint">{k}</dt><dd className="text-right text-star">{v}</dd></div>
                ))}
              </dl>
              <h3 className="mt-6 text-sm font-medium text-star/60">Traits</h3>
              <ul className="mt-3 flex flex-wrap gap-2">{sign.traits.map((t) => <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-star/85">{t}</li>)}</ul>
            </div>
          </aside>
        </div>

        <nav aria-label="Other signs" className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
          <Link href={`/horoscope/${prev.slug}`} className="group flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-white/[0.03]">
            <ArrowLeft className="size-5 text-lavender transition-transform" aria-hidden />
            <span><span className="block text-xs text-faint">Previous sign</span><span className="font-display text-2xl"><span className="glyph mr-2 text-lavender">{prev.symbol}</span>{prev.name}</span></span>
          </Link>
          <Link href={`/horoscope/${next.slug}`} className="group flex items-center justify-end gap-4 rounded-2xl p-4 text-right transition-colors hover:bg-white/[0.03]">
            <span><span className="block text-xs text-faint">Next sign</span><span className="font-display text-2xl">{next.name}<span className="glyph ml-2 text-lavender">{next.symbol}</span></span></span>
            <ArrowRight className="size-5 text-lavender transition-transform" aria-hidden />
          </Link>
        </nav>
      </Section>
      <CtaBand title={<>A forecast for <em className="text-gradient">you alone</em></>} text={`Sun-sign horoscopes are general. A personal reading looks at your full chart — not just ${sign.name}.`} href="/book-consultation?service=vedic" />
    </>
  );
}
