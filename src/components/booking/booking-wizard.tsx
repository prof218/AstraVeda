"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CalendarClock, Check, Loader2, Pencil, RotateCcw } from "lucide-react";
import type { BookingDetails, BookingState, ConfirmedBooking } from "@/types";
import { bookingServices, consultationModes, formatSlot, generateDemoReference, getAvailableSlots } from "@/data/booking";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useTodayKey } from "@/hooks/use-today";
import { readStorage, removeStorage, STORAGE_KEYS, writeStorage } from "@/lib/storage";
import { formatPrice, cn } from "@/lib/utils";
import { OptionCard } from "./option-card";
import { Calendar } from "./calendar";
import { DetailsForm, DETAILS_FORM_ID } from "./details-form";
import { Confirmation } from "./confirmation";

const STEPS = ["Service", "Mode", "Date & Time", "Your Details", "Review"] as const;

const EMPTY: BookingState = { serviceId: null, mode: null, date: null, slot: null, details: null };

type Draft = { step: number; state: BookingState };

export function BookingWizard() {
  const params = useSearchParams();
  const todayKey = useTodayKey();
  const today = useMemo(() => (todayKey ? new Date() : null), [todayKey]);

  const [step, setStep] = useState(0);
  const [state, setState] = useState<BookingState>(EMPTY);
  const [restored, setRestored] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Restore draft + apply ?service= preselection (client only).
  useEffect(() => {
    const draft = readStorage<Draft | null>(STORAGE_KEYS.bookingDraft, null);
    const fromQuery = params.get("service");
    const validQuery = bookingServices.some((s) => s.id === fromQuery) ? fromQuery : null;
    let next: Draft = draft ?? { step: 0, state: EMPTY };
    if (validQuery && validQuery !== next.state.serviceId) {
      next = { step: next.state.mode ? Math.min(next.step, 1) : 1, state: { ...next.state, serviceId: validQuery } };
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
    setState(next.state);
    setStep(Math.min(Math.max(next.step, 0), STEPS.length - 1));
    setRestored(true);
  }, [params]);

  useEffect(() => {
    if (restored && !confirmed) writeStorage<Draft>(STORAGE_KEYS.bookingDraft, { step, state });
  }, [step, state, restored, confirmed]);

  const service = bookingServices.find((s) => s.id === state.serviceId) ?? null;
  const mode = consultationModes.find((m) => m.id === state.mode) ?? null;

  // A previously chosen slot may no longer be available (e.g. a day later).
  const slotsForDate = useMemo(
    () => (today && state.date ? getAvailableSlots(parseISO(state.date), today) : []),
    [today, state.date],
  );
  const slotStillValid = !!state.slot && slotsForDate.includes(state.slot);

  const canContinue = [
    !!state.serviceId,
    !!state.mode,
    !!state.date && slotStillValid,
    true, // handled by form submit
    !!state.details,
  ][step];

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const goTo = (s: number) => {
    setStep(s);
    scrollTop();
  };

  const next = () => {
    if (step === 3) return; // form handles
    if (!canContinue) {
      toast.error(["Please choose a service", "Please choose a consultation mode", "Please pick a date and time slot"][step] ?? "Please complete this step");
      return;
    }
    goTo(step + 1);
  };

  const confirm = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1300));
    const booking: ConfirmedBooking = { ...state, reference: generateDemoReference(), createdAt: new Date().toISOString() };
    writeStorage(STORAGE_KEYS.lastBooking, booking);
    removeStorage(STORAGE_KEYS.bookingDraft);
    setConfirmed(booking);
    setSubmitting(false);
    scrollTop();
    toast.success("Demo booking created", { description: "No request was sent — this is a frontend prototype." });
  };

  const reset = () => {
    removeStorage(STORAGE_KEYS.bookingDraft);
    setState(EMPTY);
    setConfirmed(null);
    goTo(0);
  };

  if (confirmed) {
    return (
      <div ref={topRef} className="scroll-mt-28">
        <Confirmation booking={confirmed} onReset={reset} />
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* ===== Progress ===== */}
      <nav aria-label="Booking progress" className="mb-10">
        <ol className="flex items-center gap-2 sm:gap-3">
          {STEPS.map((label, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3 last:flex-none">
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => goTo(i)}
                  aria-current={current ? "step" : undefined}
                  className="group flex items-center gap-2.5 disabled:cursor-default"
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors duration-500",
                      current && "border-transparent bg-star text-void",
                      done && "border-lavender/50 bg-violet/15 text-lavender group-hover:bg-violet/30",
                      !current && !done && "border-line text-faint",
                    )}
                  >
                    {done ? <Check className="size-4" /> : i + 1}
                  </span>
                  <span className={cn("hidden text-sm font-medium md:inline", current ? "text-star" : done ? "text-lavender" : "text-faint")}>{label}</span>
                  <span className="sr-only">{done ? "(completed)" : current ? "(current step)" : ""}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <span aria-hidden className="relative h-px flex-1 overflow-hidden bg-line">
                    <span className="absolute inset-0 origin-left bg-star transition-transform duration-700" style={{ transform: `scaleX(${done ? 1 : 0})` }} />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-sm text-muted md:hidden">Step {step + 1} of {STEPS.length} · <span className="text-star">{STEPS[step]}</span></p>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem] xl:grid-cols-[1fr_22rem]">
        {/* ===== Step content ===== */}
        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <StepShell title="Select a service" subtitle="What would you like guidance on?">
                  <div role="radiogroup" aria-label="Consultation service" className="grid gap-3 sm:grid-cols-2">
                    {bookingServices.map((s) => (
                      <OptionCard
                        key={s.id}
                        name="service"
                        selected={state.serviceId === s.id}
                        onSelect={() => setState((p) => ({ ...p, serviceId: s.id }))}
                        icon={s.icon}
                        title={s.name}
                        description={s.description}
                        meta={<>{s.duration} · {formatPrice(s.price)}</>}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 1 && (
                <StepShell title="Consultation mode" subtitle="How would you like to connect?">
                  <div role="radiogroup" aria-label="Consultation mode" className="grid gap-3 md:grid-cols-2">
                    {consultationModes.map((m) => (
                      <OptionCard
                        key={m.id}
                        name="mode"
                        selected={state.mode === m.id}
                        onSelect={() => setState((p) => ({ ...p, mode: m.id }))}
                        icon={m.icon}
                        title={m.name}
                        description={m.description}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell title="Choose date & time" subtitle="All times are shown in Indian Standard Time (IST). Availability is simulated for this demo.">
                  {!today ? (
                    <div className="flex h-80 items-center justify-center rounded-2xl border border-line"><Loader2 className="size-5 animate-spin text-lavender" /></div>
                  ) : (
                    <div className="grid gap-6 xl:grid-cols-[1fr_15rem]">
                      <Calendar
                        today={today}
                        selected={state.date}
                        onSelect={(iso) => setState((p) => ({ ...p, date: iso, slot: p.date === iso ? p.slot : null }))}
                      />
                      <div>
                        <h3 className="mb-3 text-sm font-medium text-star/60">
                          {state.date ? format(parseISO(state.date), "EEE, d MMM") : "Available slots"}
                        </h3>
                        {!state.date ? (
                          <p className="rounded-2xl border border-dashed border-line p-5 text-sm text-faint">Select a date to see available time slots.</p>
                        ) : slotsForDate.length === 0 ? (
                          <p className="rounded-2xl border border-dashed border-line p-5 text-sm text-faint">No slots left on this date — please choose another.</p>
                        ) : (
                          <div role="radiogroup" aria-label="Time slots" className="grid grid-cols-3 gap-2 xl:grid-cols-2">
                            {slotsForDate.map((s) => {
                              const sel = state.slot === s;
                              return (
                                <button
                                  key={s}
                                  type="button"
                                  role="radio"
                                  aria-checked={sel}
                                  onClick={() => setState((p) => ({ ...p, slot: s }))}
                                  className={cn(
                                    "rounded-xl border px-2 py-2.5 text-sm font-medium tabular-nums transition-colors",
                                    sel
                                      ? "border-transparent bg-star text-void"
                                      : "border-line text-star/85 hover:border-lavender/50 hover:bg-white/[0.04]",
                                  )}
                                >
                                  {formatSlot(s)}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </StepShell>
              )}

              {step === 3 && (
                <StepShell title="Your details" subtitle="Accurate birth details help the astrologer prepare your chart before the session.">
                  <DetailsForm
                    defaultValues={state.details}
                    onSubmit={(details: BookingDetails) => {
                      setState((p) => ({ ...p, details }));
                      goTo(4);
                    }}
                  />
                </StepShell>
              )}

              {step === 4 && service && mode && state.date && state.slot && state.details && (
                <StepShell title="Review your booking" subtitle="Please check everything before confirming.">
                  <div className="space-y-4">
                    <ReviewBlock title="Consultation" onEdit={() => goTo(0)}>
                      <ReviewRow k="Service" v={service.name} />
                      <ReviewRow k="Mode" v={mode.name} onEdit={() => goTo(1)} />
                      <ReviewRow k="Duration" v={service.duration} />
                    </ReviewBlock>
                    <ReviewBlock title="Schedule" onEdit={() => goTo(2)}>
                      <ReviewRow k="Date" v={format(parseISO(state.date), "EEEE, d MMMM yyyy")} />
                      <ReviewRow k="Time" v={`${formatSlot(state.slot)} IST`} />
                    </ReviewBlock>
                    <ReviewBlock title="Your details" onEdit={() => goTo(3)}>
                      <ReviewRow k="Name" v={state.details.fullName} />
                      <ReviewRow k="Email" v={state.details.email} />
                      <ReviewRow k="Phone" v={state.details.phone} />
                      <ReviewRow k="Birth" v={`${format(parseISO(state.details.dob), "d MMM yyyy")} · ${state.details.tob} · ${state.details.pob}`} />
                      <ReviewRow k="Concern" v={state.details.concern} multiline />
                    </ReviewBlock>
                    <div className="flex items-center justify-between rounded-2xl border border-lavender/30 bg-white/[0.04] p-5">
                      <div>
                        <p className="text-sm text-muted">Consultation fee</p>
                        <p className="text-[0.7rem] text-faint">Payment is arranged when you confirm on WhatsApp or email</p>
                      </div>
                      <p className="font-display text-4xl text-gradient">{formatPrice(service.price)}</p>
                    </div>
                  </div>
                </StepShell>
              )}
              {step === 4 && !(service && mode && state.date && state.slot && state.details) && (
                <StepShell title="Almost there" subtitle="Some details are missing.">
                  <Button variant="secondary" onClick={() => goTo(0)}><RotateCcw className="size-4" /> Start again</Button>
                </StepShell>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ===== Navigation ===== */}
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => goTo(step - 1)} disabled={step === 0}>
                <ArrowLeft className="size-4" /> Back
              </Button>
              {(state.serviceId || step > 0) && (
                <button type="button" onClick={reset} className="text-xs text-faint underline-offset-4 hover:text-lavender hover:underline">Start over</button>
              )}
            </div>
            {step < 3 && (
              <Button onClick={next} aria-disabled={!canContinue} className={cn(!canContinue && "opacity-50")}>
                Continue <ArrowRight className="size-4" />
              </Button>
            )}
            {step === 3 && (
              <Button type="submit" form={DETAILS_FORM_ID}>Review Booking <ArrowRight className="size-4" /></Button>
            )}
            {step === 4 && (
              <Button onClick={confirm} disabled={submitting || !(service && mode && state.details && slotStillValid)} size="lg">
                {submitting ? (<><Loader2 className="size-4 animate-spin" /> Confirming…</>) : (<>Confirm Demo Booking <Check className="size-4" /></>)}
              </Button>
            )}
          </div>
          {step === 4 && state.slot && !slotStillValid && (
            <p role="alert" className="mt-3 text-sm text-danger">Your selected slot is no longer available. Please choose another time.</p>
          )}
        </div>

        {/* ===== Summary ===== */}
        <aside aria-label="Booking summary" className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass rounded-2xl p-6">
            <p className="eyebrow mb-5 text-[0.62rem]">Your booking</p>
            <ul className="space-y-4 text-sm">
              <SummaryRow icon="sparkles" label="Service" value={service?.name} />
              <SummaryRow icon={mode?.icon ?? "video"} label="Mode" value={mode?.name} />
              <SummaryRow
                icon="calendar"
                label="Date & time"
                value={state.date ? `${format(parseISO(state.date), "d MMM yyyy")}${state.slot && slotStillValid ? ` · ${formatSlot(state.slot)}` : ""}` : undefined}
              />
              <SummaryRow icon="user" label="Client" value={state.details?.fullName} />
            </ul>
            <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
              <span className="text-sm text-muted">Fee</span>
              <span className="font-display text-3xl text-star">{service ? formatPrice(service.price) : "—"}</span>
            </div>
          </div>
          <p className="mt-4 flex gap-2 px-2 text-xs leading-relaxed text-faint">
            <CalendarClock className="size-4 shrink-0" aria-hidden />
            This is a frontend demo. Your progress is saved in this browser only; nothing is sent to the astrologer.
          </p>
        </aside>
      </div>
    </div>
  );
}

function StepShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
      <div className="mt-7">{children}</div>
    </div>
  );
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-star/60">{title}</h3>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 text-xs text-muted hover:text-star">
          <Pencil className="size-3" /> Edit
        </button>
      </div>
      <dl className="space-y-2.5">{children}</dl>
    </div>
  );
}

function ReviewRow({ k, v, multiline, onEdit }: { k: string; v: string; multiline?: boolean; onEdit?: () => void }) {
  return (
    <div className={cn("grid gap-1 text-sm sm:grid-cols-[7rem_1fr]", multiline && "items-start")}>
      <dt className="text-faint">{k}</dt>
      <dd className={cn("text-star/90", multiline ? "whitespace-pre-line" : "break-words")}>
        {v}
        {onEdit && <button type="button" onClick={onEdit} className="ml-2 text-xs text-lavender hover:underline">change</button>}
      </dd>
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: Parameters<typeof Icon>[0]["name"]; label: string; value?: string }) {
  return (
    <li className="flex gap-3">
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg border", value ? "border-lavender/40 text-lavender" : "border-line text-faint")}>
        <Icon name={icon} className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[0.65rem] text-faint">{label}</span>
        <span className={cn("block truncate", value ? "text-star" : "text-faint")}>{value ?? "Not selected"}</span>
      </span>
    </li>
  );
}
