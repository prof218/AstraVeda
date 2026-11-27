"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calculator } from "lucide-react";
import { lifePathNumber, nameNumbers, numberMeanings } from "@/data/numerology";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

function NumberResult({ n, label }: { n: number; label: string }) {
  const m = numberMeanings[n];
  if (!m) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 flex gap-5 rounded-2xl border border-lavender/25 bg-white/[0.04] p-5" aria-live="polite">
      <span className="font-display text-6xl leading-none text-gradient">{n}</span>
      <div>
        <p className="text-[0.65rem] text-faint">{label}</p>
        <p className="mt-1 font-display text-2xl">{m.title}</p>
        <p className="mt-1 text-sm text-muted">{m.text}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">{m.keywords.map((k) => <li key={k} className="rounded-full border border-line px-2.5 py-0.5 text-[0.7rem] text-star/80">{k}</li>)}</ul>
      </div>
    </motion.div>
  );
}

export function LifePathCalculator() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="glass h-full rounded-2xl p-6 sm:p-8">
      <h3 className="flex items-center gap-2 text-3xl"><Calculator className="size-5 text-lavender" aria-hidden /> Date of birth numerology</h3>
      <p className="mt-2 text-sm text-muted">Your Life Path number — the core theme of your journey.</p>
      <form
        className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!dob || Number.isNaN(Date.parse(dob))) { setError("Please enter a valid date of birth"); setResult(null); return; }
          setError(null);
          setResult(lifePathNumber(dob));
        }}
      >
        <Field label="Date of birth" htmlFor="np-dob" error={error ?? undefined} className="flex-1">
          <Input id="np-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? "np-dob-error" : undefined} />
        </Field>
        <Button type="submit">Calculate</Button>
      </form>
      <AnimatePresence mode="wait">{result !== null && <NumberResult key={result} n={result} label="Life Path number" />}</AnimatePresence>
    </div>
  );
}

export function NameCalculator() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<ReturnType<typeof nameNumbers> | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="glass h-full rounded-2xl p-6 sm:p-8">
      <h3 className="flex items-center gap-2 text-3xl"><Calculator className="size-5 text-lavender" aria-hidden /> Name numerology</h3>
      <p className="mt-2 text-sm text-muted">Destiny, Soul Urge and Personality numbers (Pythagorean system).</p>
      <form
        className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const r = nameNumbers(name);
          if (r.letters < 2) { setError("Please enter your full name using English letters"); setResult(null); return; }
          setError(null);
          setResult(r);
        }}
      >
        <Field label="Full name (as commonly used)" htmlFor="np-name" error={error ?? undefined} className="flex-1">
          <Input id="np-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ananya Sharma" aria-invalid={error ? true : undefined} aria-describedby={error ? "np-name-error" : undefined} />
        </Field>
        <Button type="submit">Calculate</Button>
      </form>
      <AnimatePresence mode="wait">
        {result && (
          <motion.div key={name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <NumberResult n={result.destiny} label="Destiny (Expression) number" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[["Soul Urge", result.soulUrge], ["Personality", result.personality]].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-line bg-white/[0.02] p-4">
                  <p className="text-[0.65rem] text-faint">{k}</p>
                  <p className="mt-1 font-display text-3xl text-star">{v} <span className="text-base text-muted">· {numberMeanings[v as number]?.title}</span></p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
