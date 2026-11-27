import type { Metadata } from "next";
import { LegalPage } from "@/components/common/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for using the website and consultation services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      crumb="Terms & Conditions"
      sections={[
        { h: "Nature of services", p: "Astrology, numerology and Vastu consultations provide perspective and guidance. They are not a substitute for medical, legal, psychological or financial advice, and no specific outcome is guaranteed." },
        { h: "Demo prototype", p: "Bookings, prices, enquiries and confirmations on this website are simulated. No appointment is scheduled and no payment is processed." },
        { h: "Bookings & rescheduling", p: "In the live service, rescheduling and cancellation terms would be listed here once confirmed by the client." },
        { h: "Content", p: "Horoscopes, articles and sample content are provided for general information and reflection." },
        { h: "Changes", p: "These terms may be updated. The date of the latest revision would appear here." },
      ]}
    />
  );
}
