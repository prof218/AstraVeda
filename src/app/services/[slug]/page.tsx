import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock } from "lucide-react";
import { getService, services } from "@/data/services";
import { bookingServices } from "@/data/booking";
import { PageHero } from "@/components/common/page-hero";
import { Section } from "@/components/common/section";
import { Artwork } from "@/components/cosmic/artwork";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CtaBand } from "@/components/common/cta-band";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return { title: "Service not found" };
  return {
    title: s.name,
    description: s.short,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: `${s.name} — ${s.tagline}`, description: s.short },
  };
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const booking = bookingServices.find((b) => b.id === service.bookingId);
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={service.tagline}
        title={service.name}
        description={service.short}
        crumbs={[{ label: "Services", href: "/services" }, { label: service.name }]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href={`/book-consultation?service=${service.bookingId}`} size="lg">Book this consultation <ArrowRight className="size-4" /></ButtonLink>
          {booking && (
            <p className="flex items-center gap-2 text-sm text-muted">
              <Clock className="size-4 text-lavender" aria-hidden /> {booking.duration} · {formatPrice(booking.price)}
            </p>
          )}
        </div>
      </PageHero>

      <Section className="pt-4 sm:pt-8">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div data-reveal className="relative aspect-[16/8] overflow-hidden rounded-[20px] border border-line">
              <Artwork variant={service.art} hue={service.hue} seed={service.slug} label={`${service.name} illustration`} />
            </div>
            <div className="mt-12 space-y-5 text-lg leading-relaxed text-muted">
              {service.description.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
            </div>

            <h2 className="mt-14 text-4xl">Benefits</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.benefits.map((b) => (
                <li key={b} data-reveal className="flex gap-3 rounded-2xl border border-line bg-white/[0.025] p-5 text-sm text-star/90">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet/20 text-lavender"><Check className="size-3.5" aria-hidden /></span>
                  {b}
                </li>
              ))}
            </ul>

            <h2 className="mt-14 text-4xl">Frequently asked</h2>
            <Accordion items={service.faqs} name={`faq-${service.slug}`} className="mt-6" />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="glass rounded-2xl p-7">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-white/[0.04] text-lavender"><Icon name={service.icon} className="size-5" /></span>
              <h2 className="mt-5 text-2xl">What&apos;s included</h2>
              <ul className="mt-4 space-y-3">
                {service.includes.map((x) => (
                  <li key={x} className="flex gap-2.5 text-sm text-muted"><Check className="mt-0.5 size-4 shrink-0 text-lavender" aria-hidden />{x}</li>
                ))}
              </ul>
              <h3 className="mt-7 text-sm font-medium text-star/60">Ideal for</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.whoFor.map((w) => <li key={w} className="rounded-full border border-line px-3 py-1 text-xs text-star/80">{w}</li>)}
              </ul>
              <h3 className="mt-7 text-sm font-medium text-star/60">Consultation modes</h3>
              <p className="mt-2 text-sm text-muted">Phone call · Email</p>
              <ButtonLink href={`/book-consultation?service=${service.bookingId}`} className="mt-7 w-full">Book Consultation</ButtonLink>
            </div>
            <div className="rounded-2xl border border-line p-7">
              <h3 className="text-sm font-medium text-star/60">Other services</h3>
              <ul className="mt-4 space-y-1">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/services/${o.slug}`} className="group flex items-center justify-between rounded-xl px-2 py-2.5 text-sm text-star/85 hover:bg-white/[0.04]">
                      {o.name} <ArrowRight className="size-4 text-lavender/60 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>
      <CtaBand title={<>Ready to explore <em className="text-gradient">{service.name.toLowerCase()}?</em></>} href={`/book-consultation?service=${service.bookingId}`} />
    </>
  );
}
