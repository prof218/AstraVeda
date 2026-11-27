"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Field, Input, Select, Textarea, ariaFor } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.email("Please enter a valid email"),
  phone: z.string().trim().regex(/^$|^\+?[\d\s()-]{7,20}$/, "Please enter a valid phone number").optional(),
  subject: z.string().min(1, "Please choose a topic"),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(1500),
  consent: z.literal(true, { message: "Please accept to continue" }),
});
type Values = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: Values) => {
    await new Promise((r) => setTimeout(r, 900));
    setSent(v.name.split(" ")[0]);
    reset();
    toast.success("Message captured (demo)", { description: "Nothing was sent — the contact form will be connected to a backend later." });
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center py-12 text-center" role="status">
        <CheckCircle2 className="size-12 text-success" aria-hidden />
        <h3 className="mt-5 text-3xl">Thank you, {sent}.</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">This is a demo, so your message was not delivered. In the live site, the team would reply within one working day.</p>
        <Button variant="secondary" className="mt-6" onClick={() => setSent(null)}>Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2" aria-label="Contact form">
      <Field label="Name" htmlFor="c-name" error={errors.name?.message} required>
        <Input autoComplete="name" {...ariaFor("c-name", errors.name)} {...register("name")} />
      </Field>
      <Field label="Email" htmlFor="c-email" error={errors.email?.message} required>
        <Input type="email" autoComplete="email" {...ariaFor("c-email", errors.email)} {...register("email")} />
      </Field>
      <Field label="Phone (optional)" htmlFor="c-phone" error={errors.phone?.message}>
        <Input type="tel" autoComplete="tel" {...ariaFor("c-phone", errors.phone)} {...register("phone")} />
      </Field>
      <Field label="Topic" htmlFor="c-subject" error={errors.subject?.message} required>
        <Select defaultValue="" {...ariaFor("c-subject", errors.subject)} {...register("subject")}>
          <option value="" disabled>Select a topic</option>
          <option>Consultation enquiry</option>
          <option>Vastu project</option>
          <option>Remedies & gemstones</option>
          <option>Media / speaking</option>
          <option>Other</option>
        </Select>
      </Field>
      <Field label="Message" htmlFor="c-message" error={errors.message?.message} required className="sm:col-span-2">
        <Textarea rows={5} {...ariaFor("c-message", errors.message)} {...register("message")} />
      </Field>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" className="mt-1 size-4 accent-violet" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? "c-consent-error" : undefined} {...register("consent")} />
          I agree that my details may be used to respond to this enquiry (see Privacy Policy).
        </label>
        {errors.consent && <p id="c-consent-error" role="alert" className="mt-2 text-xs text-danger">{errors.consent.message}</p>}
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="size-4 animate-spin" /> Sending…</> : <>Send Message <Send className="size-4" /></>}
        </Button>
      </div>
    </form>
  );
}
