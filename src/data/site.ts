/**
 * Central site configuration.
 * Everything here is DEMO / PLACEHOLDER content — replace with the client's
 * real brand, contact details and social profiles before launch.
 */
export const site = {
  name: "AstraVeda",
  tagline: "Vedic Astrology & Celestial Guidance",
  description:
    "Personalised Vedic astrology, Kundli analysis, numerology and Vastu consultations — ancient wisdom translated into clear, practical guidance for modern life.",
  url: "https://astraveda.example",
  currency: "INR",
  locale: "en-IN",
  contact: {
    phone: "+91 98765 43210",
    phoneHref: "tel:+919876543210",
    whatsapp: "+91 98765 43210",
    email: "hello@astraveda.example",
    address: ["Studio 4, Celestial Court", "Placeholder Road, New Delhi 110001", "India"],
    hours: "Mon – Sat · 10:00 AM – 7:00 PM IST",
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
