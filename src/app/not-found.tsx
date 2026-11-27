import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { RealisticMoon } from "@/components/cosmic/realistic-bodies";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-28">
      <div aria-hidden className="starfield absolute inset-0 opacity-70" />
      <div className="container-cosmic relative grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-4 text-6xl leading-none sm:text-7xl">Lost among <em className="text-gradient">the stars</em></h1>
          <p className="mt-5 max-w-md text-muted">The page you&apos;re looking for has drifted out of orbit. Let&apos;s guide you back.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/"><ArrowLeft className="size-4" /> Back to Home</ButtonLink>
            <ButtonLink href="/book-consultation" variant="secondary">Book Consultation</ButtonLink>
          </div>
        </div>
        <div className="mx-auto w-56 sm:w-72"><RealisticMoon /></div>
      </div>
    </section>
  );
}
