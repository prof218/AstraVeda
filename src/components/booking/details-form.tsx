"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { BookingDetails } from "@/types";
import { Field, Input, Select, Textarea, ariaFor } from "@/components/ui/form";

export const detailsSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Please enter a valid phone number")
    .refine((v) => v.replace(/\D/g, "").length >= 7, "Please enter a valid phone number"),
  gender: z.enum(["female", "male", "other"], { message: "Please select an option" }),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((v) => !Number.isNaN(Date.parse(v)) && new Date(v) <= new Date(), "Enter a valid past date"),
  tob: z.string().regex(/^\d{2}:\d{2}$/, "Time of birth is required"),
  pob: z.string().trim().min(2, "Please enter your place of birth").max(100),
  concern: z.string().trim().min(10, "Please share a little more (at least 10 characters)").max(1000, "Please keep it under 1000 characters"),
});

export const DETAILS_FORM_ID = "booking-details-form";

export function DetailsForm({ defaultValues, onSubmit }: { defaultValues: BookingDetails | null; onSubmit: (v: BookingDetails) => void }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: (defaultValues as z.infer<typeof detailsSchema> | null) ?? {
      fullName: "", email: "", phone: "", dob: "", tob: "", pob: "", concern: "",
    },
  });
  const concernLen = useWatch({ control, name: "concern" })?.length ?? 0;

  return (
    <form id={DETAILS_FORM_ID} noValidate onSubmit={handleSubmit((v) => onSubmit(v))} className="grid gap-5 sm:grid-cols-2" aria-label="Your details">
      <Field label="Full Name" htmlFor="b-name" error={errors.fullName?.message} required className="sm:col-span-2">
        <Input {...ariaFor("b-name", errors.fullName)} autoComplete="name" {...register("fullName")} />
      </Field>
      <Field label="Email" htmlFor="b-email" error={errors.email?.message} required>
        <Input type="email" inputMode="email" autoComplete="email" {...ariaFor("b-email", errors.email)} {...register("email")} />
      </Field>
      <Field label="Phone Number" htmlFor="b-phone" error={errors.phone?.message} required>
        <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 …" {...ariaFor("b-phone", errors.phone)} {...register("phone")} />
      </Field>
      <Field label="Gender" htmlFor="b-gender" error={errors.gender?.message} required>
        <Select {...ariaFor("b-gender", errors.gender)} defaultValue={defaultValues?.gender ?? ""} {...register("gender")}>
          <option value="" disabled>Select</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other / Prefer not to say</option>
        </Select>
      </Field>
      <Field label="Date of Birth" htmlFor="b-dob" error={errors.dob?.message} required>
        <Input type="date" {...ariaFor("b-dob", errors.dob)} {...register("dob")} />
      </Field>
      <Field label="Time of Birth" htmlFor="b-tob" error={errors.tob?.message} hint="Check your birth certificate if possible" required>
        <Input type="time" {...ariaFor("b-tob", errors.tob)} {...register("tob")} />
      </Field>
      <Field label="Place of Birth" htmlFor="b-pob" error={errors.pob?.message} required>
        <Input placeholder="City, Country" {...ariaFor("b-pob", errors.pob)} {...register("pob")} />
      </Field>
      <Field label="Your Question / Concern" htmlFor="b-concern" error={errors.concern?.message} hint={`${concernLen}/1000`} required className="sm:col-span-2">
        <Textarea rows={5} placeholder="What would you like guidance on? The more context you share, the more focused your session can be." {...ariaFor("b-concern", errors.concern)} {...register("concern")} />
      </Field>
    </form>
  );
}
