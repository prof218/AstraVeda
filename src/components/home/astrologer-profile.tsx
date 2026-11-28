import { Award, ArrowRight } from "lucide-react";
import { astrologer } from "@/data/astrologer";
import { Portrait } from "@/components/common/portrait";
import { ButtonLink } from "@/components/ui/button";
import { DemoNote } from "@/components/common/section";

export function AstrologerProfile() {
  return (
    <section aria-labelledby="profile-title" className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div className="container-cosmic relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
          <div data-reveal="scale" className="relative mx-auto max-w-md lg:sticky lg:top-28">
            <Portrait className="aspect-[4/5]" />
            <div className="absolute -left-4 top-10 hidden rotate-[-4deg] rounded-2xl border border-line bg-abyss/90 px-4 py-3 backdrop-blur sm:block">
              <p className="text-[0.65rem] text-faint">Languages</p>
              <p className="mt-0.5 text-sm text-star">{astrologer.languages.join(" · ")}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:row-start-1">
          <div data-reveal>
            <p className="eyebrow mb-5">The Astrologer</p>
            <h2 id="profile-title" className="text-5xl leading-none sm:text-6xl lg:text-7xl">{astrologer.name}</h2>
            <p className="mt-4 text-sm font-medium text-lavender/80">{astrologer.title}</p>
          </div>
          <div data-reveal className="mt-8 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            {astrologer.intro.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
          </div>

          <div data-reveal className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-4 text-sm font-medium text-star/60">Specialisations</h3>
              <ul className="space-y-2.5">
                {astrologer.expertise.map((e) => (
                  <li key={e} className="flex items-center gap-3 text-sm text-star/85">
                    <span aria-hidden className="size-1.5 rotate-45 bg-gradient-to-br from-solar to-violet" /> {e}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium text-star/60">Achievements</h3>
              <ul className="space-y-4">
                {astrologer.achievements.map((a) => (
                  <li key={a.label} className="flex gap-3">
                    <Award className="mt-0.5 size-4 shrink-0 text-solar" aria-hidden />
                    <span>
                      <span className="block text-sm text-star">{a.label}</span>
                      <span className="block text-xs text-faint">{a.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-reveal className="mt-12 flex flex-col items-start gap-5">
            <ButtonLink href="/book-consultation" size="lg">Book a Consultation <ArrowRight className="size-4" /></ButtonLink>
            <DemoNote>Placeholder biography — replace with the astrologer’s verified details</DemoNote>
          </div>
        </div>
      </div>
    </section>
  );
}
