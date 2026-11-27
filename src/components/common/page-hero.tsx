import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Inner-page header: a quiet strip of night sky (static CSS stars) that fades
 * into the page. No glows, no motion — the home hero carries the spectacle.
 */
export function PageHero({
  eyebrow, title, description, crumbs = [], children, className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  /** kept for API compatibility */
  accent?: "violet" | "sky" | "solar";
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-40", className)}>
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="starfield absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000_30%,transparent)]" />
      </div>

      <div className="container-cosmic">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.8rem] text-faint">
              <li><Link href="/" className="inline-block py-2 transition-colors hover:text-star">Home</Link></li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight className="size-3" aria-hidden />
                  {c.href ? (
                    <Link href={c.href} className="inline-block py-2 transition-colors hover:text-star">{c.label}</Link>
                  ) : (
                    <span aria-current="page" className="text-star/70">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
          <h1 className="text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-6xl lg:text-[4.25rem]">{title}</h1>
          {description && <p className="mt-6 max-w-2xl text-lg leading-8 text-star/65">{description}</p>}
          {children && <div className="mt-9">{children}</div>}
        </div>
      </div>
    </section>
  );
}
