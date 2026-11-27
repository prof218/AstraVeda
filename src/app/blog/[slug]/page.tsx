import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts, getPost } from "@/data/blog";
import { Artwork } from "@/components/cosmic/artwork";
import { BlogCard } from "@/components/blog/blog-card";
import { CtaBand } from "@/components/common/cta-band";
import { formatDisplayDate } from "@/lib/utils";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, authors: [post.author] },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category).concat(blogPosts.filter((p) => p.slug !== post.slug && p.category !== post.category)).slice(0, 3);

  return (
    <>
      <article>
        <header className="relative overflow-hidden pb-12 pt-36 sm:pt-44">
          <div className="container-cosmic relative max-w-4xl">
            <Link href="/blog" className="inline-flex items-center gap-2 py-2 text-sm text-muted hover:text-lavender"><ArrowLeft className="size-4" /> All articles</Link>
            <p className="eyebrow mt-8">{post.category}</p>
            <h1 className="mt-4 text-4xl leading-[1.05] sm:text-6xl">{post.title}</h1>
            <p className="mt-6 text-sm text-faint">
              By <span className="text-star">{post.author}</span> · <time dateTime={post.date}>{formatDisplayDate(post.date)}</time> · {post.readTime}
            </p>
          </div>
        </header>
        <div className="container-cosmic max-w-5xl">
          <div className="aspect-[21/9] overflow-hidden rounded-[20px] border border-line">
            <Artwork variant={post.art} hue={post.hue} seed={post.slug} label={`Cover illustration for ${post.title}`} />
          </div>
        </div>
        <div className="container-cosmic max-w-3xl py-16">
          <p className="font-display text-2xl leading-relaxed text-star/90 sm:text-3xl">{post.excerpt}</p>
          {post.body.map((block, i) => (
            <section key={i} className="mt-10">
              {block.heading && <h2 className="mb-4 text-3xl sm:text-4xl">{block.heading}</h2>}
              {block.paragraphs.map((p) => <p key={p.slice(0, 30)} className="mt-4 text-lg leading-relaxed text-muted">{p}</p>)}
            </section>
          ))}
          <p className="mt-14 rounded-2xl border border-line bg-white/[0.02] p-5 text-xs text-faint">
            Sample article written for this demo. Astrology offers perspective for reflection and is not a substitute for medical, legal or financial advice.
          </p>
        </div>
      </article>

      <section className="border-t border-line py-20" aria-labelledby="related-title">
        <div className="container-cosmic">
          <h2 id="related-title" className="text-4xl">Keep reading</h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {related.map((p) => <li key={p.slug}><BlogCard post={p} className="h-full" /></li>)}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
