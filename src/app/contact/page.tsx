import type { Metadata } from "next";
import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
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
        description="Questions about a consultation, a reading or remedies? Send a message, or book a session directly."
        crumbs={[{ label: "Contact" }]}
      >
        <ButtonLink href="/book-consultation">Book a Consultation</ButtonLink>
      </PageHero>
      <Section className="pt-2 sm:pt-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass rounded-[20px] p-6 sm:p-10">
            <h2 className="text-3xl">Send a message</h2>
            <p className="mb-8 mt-1 text-sm text-muted">Prefer a quick reply? Message on WhatsApp at {site.contact.whatsapp}.</p>
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
            <div className="rounded-[20px] border border-line bg-white/[0.02] p-6">
              <h2 className="text-2xl">How to book</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Send a message on WhatsApp or an email with your question and birth details (date, time and place of birth).
                Consultations happen by phone or email for clients across India and abroad.
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <a href={site.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#eeecf4] px-5 text-sm font-medium text-[#0b0914] transition-colors hover:bg-white">
                  <MessageCircle className="size-4" aria-hidden /> WhatsApp
                </a>
                <a href={`mailto:${site.contact.email}`} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[10px] border border-line-strong bg-white/[0.04] px-5 text-sm font-medium text-star transition-colors hover:bg-white/[0.07]">
                  <Mail className="size-4" aria-hidden /> Email
                </a>
              </div>
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
            <DemoNote>Social media links are placeholders until profiles are shared</DemoNote>
          </div>
        </div>
      </Section>
    </>
  );
}
