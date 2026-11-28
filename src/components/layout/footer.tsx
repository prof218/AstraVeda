import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { footerLinks, site } from "@/data/site";
import { services } from "@/data/services";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SocialIcon } from "@/components/ui/social-icon";
import { Logo } from "./logo";
import { CopyrightYear } from "./copyright-year";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-abyss">

      <div className="container-cosmic relative">
        {/* Newsletter band */}
        <div className="grid gap-8 border-b border-line py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-3">The Celestial Letter</p>
            <h2 className="text-3xl sm:text-4xl">Monthly transits, remedies &amp; reflections — in your inbox.</h2>
          </div>
          <NewsletterForm />
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.3fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{site.description}</p>
            <ul className="mt-6 flex gap-2.5" aria-label="Social media">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in new tab)`}
                    className="flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-lavender/50 hover:text-star">
                    <SocialIcon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterCol title="Quick Links" links={footerLinks.quick} />
          <FooterCol title="Services" links={services.slice(0, 8).map((s) => ({ label: s.name, href: `/services/${s.slug}` }))} />

          <div>
            <h3 className="mb-5 text-sm font-medium text-star/60">Contact</h3>
            <ul className="space-y-4 text-sm text-muted">
              <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-lavender/70" aria-hidden /><a href={site.contact.phoneHref} className="hover:text-star">{site.contact.phone}</a></li>
              <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-lavender/70" aria-hidden /><a href={`mailto:${site.contact.email}`} className="break-all hover:text-star">{site.contact.email}</a></li>
              <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-lavender/70" aria-hidden /><address className="not-italic">{site.contact.address.join(", ")}</address></li>
              <li className="flex gap-3"><Clock className="mt-0.5 size-4 shrink-0 text-lavender/70" aria-hidden />{site.contact.hours}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-7 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© <CopyrightYear /> {site.name}. All rights reserved. Astrology offers guidance, not guarantees.</p>
          <ul className="flex gap-6">
            {footerLinks.legal.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-lavender">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-5 text-sm font-medium text-star/60">{title}</h3>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-muted transition-colors hover:text-star">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
