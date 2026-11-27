import type { Metadata } from "next";
import { LegalPage } from "@/components/common/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How personal and birth details are handled.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      crumb="Privacy Policy"
      sections={[
        { h: "This is a demo", p: "This prototype has no backend. Forms do not transmit data; some entries (booking drafts, newsletter preference, last Kundli input) are stored only in your own browser's localStorage and can be cleared at any time by clearing site data." },
        { h: "Information we would collect", p: "In the live service: your name, contact details, birth date, time and place, and the questions you share, used solely to prepare and deliver consultations." },
        { h: "Confidentiality", p: "Birth details and consultation notes would be kept confidential and never sold or shared with third parties, except where required by law." },
        { h: "Your rights", p: "You would be able to request access to, correction of, or deletion of your personal data by contacting us." },
        { h: "Contact", p: "Questions about privacy can be sent via the contact page (placeholder details)." },
      ]}
    />
  );
}
