/**
 * Central site configuration.
 * Contact details come from msastrologer.com (Mahender Singh). Social links
 * are still placeholders until the client shares real profile URLs.
 */
export const site = {
  name: "AstraVeda",
  tagline: "First Time, Original Intelligence Applied in Vedic Science",
  description:
    "Honest, practical astrology by Mahender Singh — 30 years of experience in Vedic Astrology, BNN, Lal Kitab, KP Astrology, Numerology and Graphology. Consultations by phone and email.",
  url: "https://astraveda-six.vercel.app",
  currency: "INR",
  locale: "en-IN",
  contact: {
    phone: "+91-9205573935",
    phoneHref: "tel:+919205573935",
    whatsapp: "+91-9205573935",
    whatsappHref: "https://wa.me/919205573935",
    email: "contactmsastrologer@gmail.com",
    // No street address is published — consultations happen by phone and email.
    address: ["Consultations by phone & email", "Clients across India and abroad"],
    hours: "By appointment — book on WhatsApp or by email",
  },
  social: [
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "X", href: "https://x.com", icon: "x" },
  ] as const,
  /** Shown wherever demo content is displayed so nobody mistakes it for real data. */
  demoNotice: "Demo content — to be replaced with the client's verified information.",
};

export type SocialIcon = (typeof site.social)[number]["icon"];

export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: (NavLink & { menu?: "services" | "horoscope" })[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", menu: "services" },
  { label: "Horoscope", href: "/horoscope", menu: "horoscope" },
  { label: "Kundli", href: "/kundli" },
  { label: "Numerology", href: "/numerology" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const exploreLinks: (NavLink & { description: string })[] = [
  { label: "Vastu Shastra", href: "/vastu", description: "Harmonise homes, offices & businesses" },
  { label: "Remedies & Gemstones", href: "/remedies", description: "Gemstones, yantras & rudraksha" },
  { label: "Gallery", href: "/gallery", description: "Moments, events & video talks" },
];

export const footerLinks = {
  quick: [
    { label: "About", href: "/about" },
    { label: "Horoscope", href: "/horoscope" },
    { label: "Free Kundli", href: "/kundli" },
    { label: "Numerology", href: "/numerology" },
    { label: "Vastu", href: "/vastu" },
    { label: "Remedies", href: "/remedies" },
    { label: "Blog", href: "/blog" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};
