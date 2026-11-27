"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, Play } from "lucide-react";
import type { GalleryItem } from "@/types";
import { galleryItems } from "@/data/gallery";
import { Artwork } from "@/components/cosmic/artwork";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

type Tab = "image" | "video";

export function GalleryGrid() {
  const [tab, setTab] = useState<Tab>("image");
  const [open, setOpen] = useState<number | null>(null);
  const items = galleryItems.filter((g) => g.type === tab);
  const current = open !== null ? items[open] : null;

  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const close = useCallback(() => setOpen(null), []);

  return (
    <div>
      <div role="tablist" aria-label="Gallery type" className="inline-flex rounded-full border border-line bg-white/[0.03] p-1">
        {(["image", "video"] as Tab[]).map((t) => (
          <button key={t} role="tab" id={`gallery-tab-${t}`} aria-selected={tab === t} aria-controls="gallery-panel" type="button"
            onClick={() => { setTab(t); setOpen(null); }}
            className={cn("relative rounded-full px-6 py-2 text-sm font-semibold transition-colors", tab === t ? "text-void" : "text-muted hover:text-star")}>
            {tab === t && <motion.span layoutId="gallery-pill" className="absolute inset-0 rounded-full bg-star" />}
            <span className="relative">{t === "image" ? "Photos" : "Videos"}</span>
          </button>
        ))}
      </div>

      <div id="gallery-panel" role="tabpanel" aria-labelledby={`gallery-tab-${tab}`} className="mt-10">
        <AnimatePresence mode="wait">
          <motion.ul key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={cn("grid gap-4", tab === "image" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2")}>
            {items.map((g, i) => (
              <li key={g.id} className={cn(tab === "image" && (i === 0 || i === 5) && "md:col-span-2 md:row-span-2")}>
                <button type="button" onClick={() => setOpen(i)} className="group relative block aspect-square h-full w-full overflow-hidden rounded-2xl border border-line text-left sm:aspect-auto sm:min-h-56" aria-label={`Open ${g.title}`}>
                  <span className={cn("absolute inset-0", tab === "video" && "aspect-video")}>
                    <Artwork variant={g.art} hue={g.hue} seed={g.id} className="transition-transform duration-[1.2s]" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block font-display text-xl leading-tight text-star sm:text-2xl">{g.title}</span>
                    {g.duration && <span className="mt-1 block text-xs text-muted">{g.duration}</span>}
                  </span>
                  {g.type === "video" ? (
                    <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-void/50 backdrop-blur transition-transform duration-500">
                      <Play className="ml-1 size-6 fill-white text-white" aria-hidden />
                    </span>
                  ) : (
                    <Expand aria-hidden className="absolute right-4 top-4 size-5 text-white/0 transition-colors group-hover:text-white/80" />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <Modal open={!!current} onClose={close} title={current?.title ?? ""} size="xl" hideTitle className="bg-void">
        {current && <Lightbox item={current} index={open!} total={items.length} onStep={step} />}
      </Modal>
    </div>
  );
}

function Lightbox({ item, index, total, onStep }: { item: GalleryItem; index: number; total: number; onStep: (d: number) => void }) {
  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[20px] sm:aspect-video">
        <AnimatePresence mode="wait">
          <motion.div key={item.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <Artwork variant={item.art} hue={item.hue} seed={item.id} label={item.title} />
            {item.type === "video" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/55 p-6 text-center">
                <span className="flex size-16 items-center justify-center rounded-full border border-white/30"><Play className="ml-1 size-6 text-white" aria-hidden /></span>
                <p className="max-w-sm text-sm text-star/85">Video placeholder — the client&apos;s YouTube or hosted video will be embedded here.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <button type="button" onClick={() => onStep(-1)} aria-label="Previous item" className={arrow + " left-3"}><ChevronLeft className="size-5" /></button>
        <button type="button" onClick={() => onStep(1)} aria-label="Next item" className={arrow + " right-3"}><ChevronRight className="size-5" /></button>
      </div>
      <div className="flex items-start justify-between gap-4 p-6">
        <div>
          <h3 className="text-2xl">{item.title}</h3>
          <p className="mt-1 text-sm text-muted">{item.caption}</p>
        </div>
        <p className="shrink-0 text-xs tabular-nums text-faint" aria-live="polite">{index + 1} / {total}</p>
      </div>
    </div>
  );
}

const arrow = "absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-void/60 text-white backdrop-blur transition-colors hover:border-lavender";
