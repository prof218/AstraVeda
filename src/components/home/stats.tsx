import { stats } from "@/data/astrologer";
import { CountUp } from "@/components/common/count-up";
import { DemoNote } from "@/components/common/section";

export function Stats() {
  return (
    <section id="stats" aria-label="Practice at a glance" className="relative py-16 sm:py-20">
      <div className="container-cosmic">
        <div data-reveal className="relative overflow-hidden rounded-[20px] border border-line bg-gradient-to-b from-white/[0.04] to-transparent">
          <div aria-hidden className="absolute inset-x-0 top-0 hairline" />
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`relative flex flex-col items-center gap-2 px-4 py-10 text-center sm:py-12 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
              >
                <dd className="order-1 font-display text-5xl leading-none text-gradient sm:text-6xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="order-2 max-w-[12rem] text-xs font-medium text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-4 flex justify-center">
          <DemoNote>Client and consultation counts are placeholders — to be confirmed</DemoNote>
        </div>
      </div>
    </section>
  );
}
