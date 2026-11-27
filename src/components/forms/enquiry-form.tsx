"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Field, Input, Textarea, ariaFor } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.email("Please enter a valid email"),
  phone: z.string().trim().regex(/^\+?[\d\s()-]{7,20}$/, "Please enter a valid phone number"),
  message: z.string().trim().max(600).optional(),
});
type Values = z.infer<typeof schema>;

/** Product enquiry — frontend demo only, nothing is sent. */
export function EnquiryForm({ productName, onDone }: { productName: string; onDone: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Enquiry saved (demo)", { description: `Your interest in ${productName} was not sent anywhere — this prototype has no backend.` });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
      <Field label="Name" htmlFor="enq-name" error={errors.name?.message} required>
        <Input autoComplete="name" {...ariaFor("enq-name", errors.name)} {...register("name")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="enq-email" error={errors.email?.message} required>
          <Input type="email" autoComplete="email" {...ariaFor("enq-email", errors.email)} {...register("email")} />
        </Field>
        <Field label="Phone" htmlFor="enq-phone" error={errors.phone?.message} required>
          <Input type="tel" autoComplete="tel" {...ariaFor("enq-phone", errors.phone)} {...register("phone")} />
        </Field>
      </div>
      <Field label="Message (optional)" htmlFor="enq-msg" error={errors.message?.message}>
        <Textarea rows={3} placeholder="Share your birth details or question, if you like." {...ariaFor("enq-msg", errors.message)} {...register("message")} />
      </Field>
      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting ? <><Loader2 className="size-4 animate-spin" /> Sending…</> : <>Send enquiry <Send className="size-4" /></>}
      </Button>
      <p className="text-center text-[0.7rem] text-faint">Demo only — no data leaves your browser.</p>
    </form>
  );
}
