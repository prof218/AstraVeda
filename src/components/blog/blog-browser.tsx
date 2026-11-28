"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { blogCategories, blogPosts } from "@/data/blog";
import { BlogCard } from "./blog-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BlogBrowser() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter(
      (p) => (category === "All" || p.category === category) && (!q || `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(q)),
    );
  }, [category, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0" role="group" aria-label="Filter by category">
          {blogCategories.map((c) => (
            <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}
              className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors", category === c ? "border-lavender/60 bg-violet/20 text-star" : "border-line text-muted hover:text-star")}>
              {c}
            </button>
          ))}
        </div>
        <label className="relative block md:w-80">
          <span className="sr-only">Search articles</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles…"
            className="h-11 w-full rounded-full border border-line bg-white/[0.035] pl-11 pr-10 text-base sm:text-sm text-star placeholder:text-faint outline-none focus:border-violet/60 [&::-webkit-search-cancel-button]:hidden" />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-faint hover:text-star">
              <X className="size-4" />
            </button>
          )}
        </label>
      </div>
      <p className="mt-6 text-sm text-faint" aria-live="polite">{posts.length} {posts.length === 1 ? "article" : "articles"}{category !== "All" ? ` in ${category}` : ""}{query ? ` matching “${query}”` : ""}</p>

      <motion.ul layout className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {posts.map((p) => (
            <motion.li key={p.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
              <BlogCard post={p} className="h-full" />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {posts.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-line p-12 text-center">
          <p className="text-muted">No articles found.</p>
          <Button size="sm" variant="secondary" className="mt-4" onClick={() => { setQuery(""); setCategory("All"); }}>Reset filters</Button>
        </div>
      )}
    </div>
  );
}
