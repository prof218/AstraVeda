import { Check } from "lucide-react";
import { KundliForm } from "@/components/kundli/kundli-form";
import { ChartTemplate } from "@/components/kundli/chart-template";

const points = ["Lagna & Moon sign", "Planetary placements", "Dasha periods", "Doshas & yogas"];

export function KundliSection() {
  return (
    <section aria-labelledby="kundli-title" className="relative py-20 sm:py-28 lg:py-32">
      <div className="container-cosmic">
        <div className="relative overflow-hidden rounded-[20px] border border-line bg-abyss">

          <div className="relative grid gap-10 p-5 sm:gap-12 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:p-16">
            <div data-reveal className="flex flex-col">
              <p className="eyebrow mb-5">Free Kundli</p>
              <h2 id="kundli-title" className="text-4xl leading-[1.05] sm:text-5xl">
                Your birth chart, <em className="text-gradient-solar">the map of your sky</em>
              </h2>
              <p className="mt-5 text-muted">
                Enter your birth details to preview your Kundli layout, Sun sign and Life Path number. A full chart is calculated and interpreted during a consultation.
              </p>
              <ul className="mt-7 grid grid-cols-2 gap-3">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-star/85">
                    <Check className="size-4 text-lavender" aria-hidden /> {p}
                  </li>
                ))}
              </ul>
              <div aria-hidden className="relative mx-auto mt-10 hidden w-56 opacity-70 lg:block">
                <ChartTemplate className="" />
              </div>
            </div>
            <div data-reveal className="glass rounded-2xl p-4 sm:p-8">
              <KundliForm compact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
