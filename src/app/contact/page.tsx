import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/data/site";
import { PageHero } from "@/components/common/page-hero";
import { DemoNote, Section } from "@/components/common/section";
import { ContactForm } from "@/components/forms/contact-form";
import { SocialIcon } from "@/components/ui/social-icon";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for consultations, Vastu projects, remedies or media enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const channels = [
    { icon: Phone, label: "Phone", value: site.contact.phone, href: site.contact.phoneHref },
    { icon: MessageCircle, label: "WhatsApp", value: site.contact.whatsapp, href: `https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}` },
    { icon: Mail, label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: Clock, label: "Hours", value: site.contact.hours },
  ];
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let&apos;s talk about <em className="text-gradient">your path</em></>}
        description="Questions about a consultation, a Vastu project or remedies? Send a message, or book a session directly."
        crumbs={[{ label: "Contact" }]}
      >
        <ButtonLink href="/book-consultation">Book a Consultation</ButtonLink>
      </PageHero>
      <Section className="pt-2 sm:pt-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass rounded-[20px] p-6 sm:p-10">
            <h2 className="text-3xl">Send a message</h2>
            <p className="mb-8 mt-1 text-sm text-muted">We aim to respond within one working day (placeholder).</p>
            <ContactForm />
          </div>
          <div className="space-y-6">
            <ul className="grid gap-3">
              {channels.map(({ icon: I, label, value, href }) => (
                <li key={label} className="flex items-center gap-4 rounded-2xl border border-line bg-white/[0.02] p-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet/15 text-lavender"><I className="size-5" aria-hidden /></span>
                  <div className="min-w-0">
                    <p className="text-[0.65rem] text-faint">{label}</p>
                    {href ? <a href={href} className="inline-block break-all py-2 text-star hover:text-lavender" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{value}</a> : <p className="text-star">{value}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="overflow-hidden rounded-[20px] border border-line">
              {/* Map placeholder — replace with an embedded map once the address is confirmed */}
              <div className="relative aspect-[4/3] bg-[linear-gradient(rgba(196,181,253,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(196,181,253,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" role="img" aria-label="Map placeholder">
                <svg aria-hidden viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-50">
                  <path d="M0 200 C80 180 120 120 200 140 S330 90 400 110" fill="none" stroke="#c4b5fd" strokeOpacity="0.35" strokeWidth="6" />
                  <path d="M150 0 C160 100 140 200 170 300" fill="none" stroke="#38bdf8" strokeOpacity="0.25" strokeWidth="4" />
                </svg>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                  <MapPin className="size-10 fill-lavender/30 text-lavender drop-" aria-hidden />
                </div>
                <p className="absolute bottom-4 left-4 rounded-full border border-line bg-void/70 px-3 py-1 text-[0.65rem] text-faint">Map placeholder</p>
              </div>
              <address className="flex gap-3 p-5 text-sm not-italic text-muted">
                <MapPin className="mt-0.5 size-4 shrink-0 text-lavender" aria-hidden />{site.contact.address.join(", ")}
              </address>
            </div>
            <div>
              <p className="mb-3 text-[0.65rem] text-faint">Follow</p>
              <ul className="flex gap-2.5">
                {site.social.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in new tab)`} className="flex size-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-lavender/50 hover:text-star">
                      <SocialIcon name={s.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <DemoNote>Contact details and social links are placeholders</DemoNote>
          </div>
        </div>
      </Section>
    </>
  );
}
