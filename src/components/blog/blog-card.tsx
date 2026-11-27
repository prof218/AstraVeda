import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/types";
import { Artwork } from "@/components/cosmic/artwork";
import { formatDisplayDate, cn } from "@/lib/utils";

export function BlogCard({ post, featured = false, className }: { post: BlogPost; featured?: boolean; className?: string }) {
  return (
    <article className={cn("group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white/[0.02] transition-[border-color,transform] duration-500 hover:border-lavender/30", className)}>
      <div className={cn("relative overflow-hidden", featured ? "aspect-[16/10]" : "aspect-[16/9]")}>
        <Artwork variant={post.art} hue={post.hue} seed={post.slug} className="transition-transform duration-[1.2s] ease-[var(--ease-cosmic)]" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-void/60 px-3 py-1 text-[0.65rem] font-semibold text-lavender backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-xs text-faint">
          <time dateTime={post.date}>{formatDisplayDate(post.date)}</time> · {post.readTime}
        </p>
        <h3 className={cn("mt-3 leading-tight", featured ? "text-3xl sm:text-4xl" : "text-2xl")}>
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">{post.title}</Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-lavender transition-colors group-hover:text-star">
          Read More <ArrowUpRight className="size-4 transition-transform" />
        </span>
      </div>
    </article>
  );
}
