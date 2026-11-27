import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blog";
import { BlogCard } from "@/components/blog/blog-card";
import { Section, SectionHeading } from "@/components/common/section";
import { ButtonLink } from "@/components/ui/button";

export function BlogSection() {
  const [first, ...rest] = blogPosts;
  return (
    <Section labelledBy="blog-title">
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading id="blog-title" align="left" eyebrow="Astrology Journal" title={<>Insights from <em className="text-gradient">the stars</em></>} />
        <ButtonLink href="/blog" variant="secondary" className="shrink-0">Visit the journal <ArrowRight className="size-4" /></ButtonLink>
      </div>
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <div data-reveal className="lg:row-span-2"><BlogCard post={first} featured className="h-full" /></div>
        {rest.slice(0, 2).map((p) => (
          <div key={p.slug} data-reveal><BlogCard post={p} className="h-full sm:flex-row sm:[&>div:first-child]:aspect-auto sm:[&>div:first-child]:w-2/5 sm:[&>div:first-child]:shrink-0" /></div>
        ))}
      </div>
    </Section>
  );
}
