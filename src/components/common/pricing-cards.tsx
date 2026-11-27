import { Check, Clock, MonitorSmartphone } from "lucide-react";
import { pricingPlans } from "@/data/pricing";
import { ButtonLink } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";

export function PricingCards() {
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-3">
      {pricingPlans.map((plan) => (
        <article
          key={plan.id}
          data-reveal
          className={cn(
            "relative flex flex-col rounded-[20px] p-8 sm:p-10",
            plan.highlighted
              ? "border border-lavender/40 bg-abyss lg:-my-4 lg:py-14"
              : "border border-line bg-white/[0.025]",
          )}
        >
          {plan.highlighted && (
            <span className="absolute left-8 top-0 -translate-y-1/2 rounded-md border border-lavender/40 bg-abyss px-2.5 py-1 text-xs text-lavender sm:left-10">
              Most chosen
            </span>
          )}
          <h3 className="font-display text-3xl">{plan.name}</h3>
          <div className="mt-6 flex items-end gap-2">
            <span className="font-display text-6xl leading-none text-gradient">{formatPrice(plan.price)}</span>
          </div>
          <p className="mt-2 text-[0.7rem] text-faint">Demo price · to be confirmed</p>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-y border-line py-4 text-sm text-star/85">
            <span className="inline-flex items-center gap-2"><Clock className="size-4 text-lavender" aria-hidden />{plan.duration}</span>
            <span className="inline-flex items-center gap-2"><MonitorSmartphone className="size-4 text-lavender" aria-hidden />{plan.modes.join(" · ")}</span>
          </div>

          <ul className="mt-7 flex-1 space-y-3.5">
            {plan.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm text-muted">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet/20 text-lavender">
                  <Check className="size-3" aria-hidden />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <ButtonLink
            href={`/book-consultation?service=${plan.bookingService}`}
            variant={plan.highlighted ? "primary" : "secondary"}
            className="mt-9 w-full"
            aria-label={`Book ${plan.name}`}
          >
            Book Now
          </ButtonLink>
        </article>
      ))}
    </div>
  );
}
