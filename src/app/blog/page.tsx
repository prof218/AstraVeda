import type { Metadata } from "next";
import { PageHero } from "@/components/common/page-hero";
import { DemoNote, Section } from "@/components/common/section";
import { BlogBrowser } from "@/components/blog/blog-browser";

export const metadata: Metadata = {
  title: "Astrology Blog & Articles",
  description: "Articles on Vedic astrology, planets, marriage compatibility, numerology, Vastu and remedies — explained clearly and without fear.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="The Journal"
        title={<>Notes from <em className="text-gradient">the celestial desk</em></>}
        description="Thoughtful, practical writing on the planets, charts and traditions of Jyotish."
        crumbs={[{ label: "Blog" }]}
      />
      <Section className="pt-2 sm:pt-6">
        <BlogBrowser />
        <div className="mt-12 flex justify-center"><DemoNote>Sample articles for demonstration</DemoNote></div>
      </Section>
    </>
  );
}
