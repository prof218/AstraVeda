"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Info, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Field, Input, Select, ariaFor } from "@/components/ui/form";
import { Button, ButtonLink } from "@/components/ui/button";
import { ChartTemplate } from "./chart-template";
import { sunSignFromDate } from "@/data/horoscopes";
import { lifePathNumber, numberMeanings } from "@/data/numerology";
import { STORAGE_KEYS, writeStorage } from "@/lib/storage";
import { formatDisplayDate, cn } from "@/lib/utils";

export const kundliSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80, "Name is too long"),
  gender: z.enum(["female", "male", "other"], { message: "Please select an option" }),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date")
    .refine((v) => new Date(v) <= new Date(), "Date of birth can't be in the future")
    .refine((v) => new Date(v).getFullYear() >= 1900, "Please enter a year after 1900"),
  tob: z.string().regex(/^\d{2}:\d{2}$/, "Time of birth is required"),
  pob: z.string().trim().min(2, "Please enter your place of birth").max(100),
});

export type KundliValues = z.infer<typeof kundliSchema>;

export function KundliForm({ compact = false }: { compact?: boolean }) {
  const [result, setResult] = useState<KundliValues | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<KundliValues>({
    resolver: zodResolver(kundliSchema),
    defaultValues: { fullName: "", dob: "", tob: "", pob: "" },
  });

  const onSubmit = async (values: KundliValues) => {
    await new Promise((r) => setTimeout(r, 1100));
    writeStorage(STORAGE_KEYS.kundli, values);
    setResult(values);
  };

  const idp = compact ? "hk" : "kundli";

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {!result ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Kundli birth details"
            className="grid gap-5 sm:grid-cols-2"
          >
            <Field label="Full Name" htmlFor={`${idp}-name`} error={errors.fullName?.message} required className="sm:col-span-2">
              <Input {...ariaFor(`${idp}-name`, errors.fullName)} autoComplete="name" placeholder="e.g. Ananya Sharma" {...register("fullName")} />
            </Field>
            <Field label="Gender" htmlFor={`${idp}-gender`} error={errors.gender?.message} required>
              <Select {...ariaFor(`${idp}-gender`, errors.gender)} defaultValue="" {...register("gender")}>
                <option value="" disabled>Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other / Prefer not to say</option>
              </Select>
            </Field>
            <Field label="Date of Birth" htmlFor={`${idp}-dob`} error={errors.dob?.message} required>
              <Input type="date" {...ariaFor(`${idp}-dob`, errors.dob)} {...register("dob")} />
            </Field>
            <Field label="Time of Birth" htmlFor={`${idp}-tob`} error={errors.tob?.message} hint="As exact as possible" required>
              <Input type="time" {...ariaFor(`${idp}-tob`, errors.tob)} {...register("tob")} />
            </Field>
            <Field label="Place of Birth" htmlFor={`${idp}-pob`} error={errors.pob?.message} required>
              <Input {...ariaFor(`${idp}-pob`, errors.pob)} placeholder="City, Country" autoComplete="address-level2" {...register("pob")} />
            </Field>
            <div className="flex flex-col gap-4 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-xs text-faint">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden /> Details stay in your browser — nothing is sent anywhere.
              </p>
              <Button type="submit" size="lg" disabled={isSubmitting} className="shrink-0">
                {isSubmitting ? (<><Loader2 className="size-4 animate-spin" /> Aligning the stars…</>) : (<>Generate Kundli <Sparkles className="size-4" /></>)}
              </Button>
            </div>
          </motion.form>
        ) : (
          <KundliResult key="result" values={result} onReset={() => setResult(null)} compact={compact} />
        )}
      </AnimatePresence>
    </div>
  );
}

function KundliResult({ values, onReset, compact }: { values: KundliValues; onReset: () => void; compact: boolean }) {
  const sign = sunSignFromDate(values.dob);
  const lp = lifePathNumber(values.dob);
  const meaning = numberMeanings[lp];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow">Demo Kundli Preview</p>
        <span className="rounded-full border border-solar/30 bg-solar/10 px-3 py-1 text-[0.68rem] font-semibold text-solar">Not an astronomical calculation</span>
      </div>
      <h3 className="mt-3 font-display text-3xl sm:text-4xl">Namaste, {values.fullName.split(" ")[0]}.</h3>

      <div className={cn("mt-6 grid gap-6", !compact && "lg:grid-cols-[minmax(0,18rem)_1fr]")}>
        <div className="mx-auto w-full max-w-[18rem]">
          <ChartTemplate lagnaLabel="LAGNA" />
          <p className="mt-2 text-center text-[0.7rem] text-faint">Illustrative layout — planets not plotted</p>
        </div>
        <div className="space-y-4">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Born", formatDisplayDate(values.dob)],
              ["Time", values.tob],
              ["Place", values.pob],
              ["Gender", values.gender === "other" ? "—" : values.gender[0].toUpperCase() + values.gender.slice(1)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5">
                <dt className="text-[0.65rem] text-faint">{k}</dt>
                <dd className="mt-0.5 truncate text-star">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white/[0.04] p-4">
              <p className="text-[0.65rem] text-faint">Western Sun sign</p>
              <p className="mt-1 flex items-center gap-2 font-display text-2xl"><span className="glyph text-lavender">{sign.symbol}</span>{sign.name}</p>
              <p className="mt-1 text-xs text-muted">From date only. Your Vedic (sidereal) signs may differ.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white/[0.04] p-4">
              <p className="text-[0.65rem] text-faint">Life Path number</p>
              <p className="mt-1 font-display text-2xl"><span className="text-gradient">{lp}</span> · {meaning?.title}</p>
              <p className="mt-1 text-xs text-muted">Numerology, calculated from your birth date.</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Your Lagna, Moon sign, nakshatra, planetary positions and dashas require a precise astronomical calculation from your time and place of birth.
            That is prepared by the astrologer during a <span className="text-star">Detailed Kundli Analysis</span>.
          </p>
        </div>
      </div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/book-consultation?service=kundli">Book Detailed Kundli Analysis <ArrowRight className="size-4" /></ButtonLink>
        <Button variant="secondary" onClick={onReset}><RotateCcw className="size-4" /> Edit details</Button>
      </div>
    </motion.div>
  );
}
