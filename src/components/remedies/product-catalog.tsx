"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Search } from "lucide-react";
import type { Product } from "@/types";
import { productCategories, products } from "@/data/remedies";
import { Artwork } from "@/components/cosmic/artwork";
import { Modal } from "@/components/ui/modal";
import { Button, ButtonLink } from "@/components/ui/button";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { formatPrice, cn } from "@/lib/utils";

export function ProductCatalog() {
  const [category, setCategory] = useState<(typeof productCategories)[number]>("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Product | null>(null);
  const [enquire, setEnquire] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => (category === "All" || p.category === category) && (!q || `${p.name} ${p.planet ?? ""} ${p.description}`.toLowerCase().includes(q)),
    );
  }, [category, query]);

  const close = useCallback(() => { setActive(null); setEnquire(false); }, []);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0" role="group" aria-label="Product category">
          {productCategories.map((c) => (
            <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}
              className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors", category === c ? "border-lavender/60 bg-violet/20 text-star" : "border-line text-muted hover:text-star")}>
              {c}
            </button>
          ))}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Search remedies</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search gemstones, planets…" type="search"
            className="h-11 w-full rounded-full border border-line bg-white/[0.035] pl-11 pr-4 text-sm text-star placeholder:text-faint outline-none focus:border-violet/60" />
        </label>
      </div>

      <p className="mt-6 text-sm text-faint" aria-live="polite">{list.length} {list.length === 1 ? "item" : "items"}</p>

      <motion.ul layout className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/[0.02] transition-colors hover:border-lavender/30">
                <button type="button" onClick={() => setActive(p)} className="relative aspect-square overflow-hidden text-left" aria-label={`View details for ${p.name}`}>
                  <Artwork variant={p.art} hue={p.hue} seed={p.id} className="transition-transform duration-[1.2s]" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-void/60 px-3 py-1 text-[0.65rem] font-semibold text-lavender backdrop-blur">{p.category}</span>
                </button>
                <div className="flex flex-1 flex-col p-5">
                  {p.planet && <p className="text-xs text-faint">Planet · {p.planet}</p>}
                  <h3 className="mt-1 font-display text-2xl leading-tight">{p.name}</h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{p.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <p><span className="font-display text-2xl text-star">{formatPrice(p.price)}</span> <span className="text-[0.65rem] text-faint">demo</span></p>
                    <Button size="sm" variant="secondary" onClick={() => setActive(p)}>Details</Button>
                  </div>
                </div>
              </article>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {list.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-line p-12 text-center">
          <p className="text-muted">No remedies match “{query}”.</p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</Button>
        </div>
      )}

      <Modal open={!!active} onClose={close} title={active ? (enquire ? `Enquire about ${active.name}` : active.name) : ""} description={active && !enquire ? `${active.category}${active.planet ? ` · ${active.planet}` : ""}` : undefined} size={enquire ? "md" : "lg"}>
        {active && !enquire && (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="aspect-square overflow-hidden rounded-2xl border border-line"><Artwork variant={active.art} hue={active.hue} seed={active.id} label={`${active.name} illustration`} /></div>
            <div className="flex flex-col">
              <p className="text-sm leading-relaxed text-muted">{active.description}</p>
              <ul className="mt-5 space-y-2">
                {active.benefits.map((b) => <li key={b} className="flex gap-2.5 text-sm text-star/85"><Check className="mt-0.5 size-4 shrink-0 text-lavender" aria-hidden />{b}</li>)}
              </ul>
              <p className="mt-6 font-display text-4xl text-gradient">{formatPrice(active.price)}</p>
              <p className="text-[0.7rem] text-faint">Demo price · online purchase not available in this prototype</p>
              <p className="mt-4 rounded-xl border border-line bg-white/[0.03] p-3 text-xs text-muted">
                Remedies are suggested only after a chart review. We recommend a gemstone consultation before purchasing any stone.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button onClick={() => setEnquire(true)} className="flex-1">Enquire</Button>
                <ButtonLink href="/book-consultation?service=general" variant="secondary" className="flex-1">Consult first</ButtonLink>
              </div>
            </div>
          </div>
        )}
        {active && enquire && <EnquiryForm productName={active.name} onDone={close} />}
      </Modal>
    </div>
  );
}
