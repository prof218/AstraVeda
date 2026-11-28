"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Check } from "lucide-react";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/lib/storage";

const schema = z.object({ email: z.email("Please enter a valid email address") });
type Values = z.infer<typeof schema>;

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Values>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount
    setSubscribed(readStorage<string | null>(STORAGE_KEYS.newsletter, null));
  }, []);

  const onSubmit = async ({ email }: Values) => {
    await new Promise((r) => setTimeout(r, 500));
    writeStorage(STORAGE_KEYS.newsletter, email);
    setSubscribed(email);
    reset();
    toast.success("You're on the list (demo)", {
      description: "No email was sent — newsletter delivery will be connected with the backend.",
    });
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-success/25 bg-success/5 px-4 py-3 text-sm text-star/85">
        <Check className="size-4 shrink-0 text-success" aria-hidden />
        <span>Subscribed as <strong className="font-semibold">{subscribed}</strong> (demo only).</span>
        <button type="button" onClick={() => setSubscribed(null)} className="ml-auto text-xs text-lavender underline-offset-4 hover:underline">Change</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <div className="flex gap-2 rounded-full border border-line bg-white/[0.04] p-1.5 transition-colors focus-within:border-violet/60">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "newsletter-error" : undefined}
          className="min-w-0 flex-1 bg-transparent px-4 text-base text-star placeholder:text-faint outline-none sm:text-sm"
          {...register("email")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-star px-5 text-xs font-semibold text-void transition-shadow disabled:opacity-60"
        >
          {isSubmitting ? "Joining…" : "Subscribe"} <ArrowRight className="size-3.5" aria-hidden />
        </button>
      </div>
      {errors.email && <p id="newsletter-error" role="alert" className="mt-2 pl-4 text-xs text-danger">{errors.email.message}</p>}
    </form>
  );
}
