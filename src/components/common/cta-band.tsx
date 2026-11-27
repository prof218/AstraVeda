import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";

/** Compact consultation CTA used at the end of inner pages. */
export function CtaBand({
  title = <>Ready for <em className="text-gradient">personal guidance?</em></>,
  text = "Book a one-to-one consultation and get answers based on your own birth chart.",
  href = "/book-consultation",
  label = "Book Your Consultation",
}: { title?: ReactNode; text?: string; href?: string; label?: string }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-cosmic">
        <div data-reveal className="relative overflow-hidden rounded-[20px] border border-line bg-abyss px-6 py-14 text-center sm:px-14 sm:py-20">
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-4xl leading-tight sm:text-5xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">{text}</p>
            <ButtonLink href={href} size="lg" className="mt-9">{label} <ArrowRight className="size-4" /></ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
