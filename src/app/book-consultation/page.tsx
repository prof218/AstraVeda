import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PageHero } from "@/components/common/page-hero";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Book a personal Vedic astrology, Kundli, numerology or Vastu consultation by video, audio or chat in a few simple steps.",
  alternates: { canonical: "/book-consultation" },
  openGraph: { title: "Book a Consultation", description: "Schedule a personal astrology consultation in a few simple steps." },
};

export default function BookConsultationPage() {
  return (
    <>
      <PageHero
        eyebrow="Consultation Booking"
        title={<>Book your <em className="text-gradient">personal reading</em></>}
        description="Five calm steps: choose a service, how you'd like to talk, a time that suits you, and share your birth details."
        crumbs={[{ label: "Book Consultation" }]}
        className="pb-10 sm:pb-14"
      />
      <section className="pb-28">
        <div className="container-cosmic">
          <Suspense
            fallback={
              <div className="flex h-96 items-center justify-center rounded-2xl border border-line">
                <Loader2 className="size-6 animate-spin text-lavender" aria-label="Loading booking form" />
              </div>
            }
          >
            <BookingWizard />
          </Suspense>
        </div>
      </section>
    </>
  );
}
