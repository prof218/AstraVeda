import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { RealisticMoon } from "@/components/cosmic/realistic-bodies";

const NEAR_FULL: [number, number, number] = [0.22, 0.3, 0.93];

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden pb-56 pt-24 sm:pb-72 sm:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="starfield absolute inset-0 opacity-60" />
        {/* moonrise: a near-full Moon rising from the bottom edge */}
        <div className="absolute bottom-0 left-1/2 w-[min(120vw,820px)] -translate-x-1/2 translate-y-[58%]">
          <RealisticMoon light={NEAR_FULL} className="w-full" />
        </div>
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void to-transparent" />
      </div>

      <div className="container-cosmic text-center">
        <div data-reveal className="mx-auto max-w-3xl">
          <p className="eyebrow mb-6">Begin today</p>
          <h2 id="cta-title" className="text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            Your cosmic journey begins here
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-star/65">
            Take the first step toward understanding your path with personalized astrological guidance.
          </p>
          <div className="mt-10 flex justify-center">
            <ButtonLink href="/book-consultation" size="lg">
              Book your consultation <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
