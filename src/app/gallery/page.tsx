import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { DemoNote, Section } from "@/components/common/section";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery — Photos & Videos",
  description: "Moments from workshops, pujas, Vastu visits and talks — plus video introductions to Vedic astrology.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={<>Moments under <em className="text-gradient">the stars</em></>}
        description="Workshops, ceremonies, consultations and video talks from the practice."
        crumbs={[{ label: "Gallery" }]}
      />
      <Section className="pt-2 sm:pt-6">
        <GalleryGrid />
        <div className="mt-12 flex justify-center"><DemoNote>Illustrations stand in for the client&apos;s photographs and videos</DemoNote></div>
      </Section>
    </>
  );
}
