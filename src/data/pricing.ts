import type { PricingPlan } from "@/types";

/** Consultation fees as published on msastrologer.com. */
export const pricingPlans: PricingPlan[] = [
  {
    id: "one-question",
    name: "Ask 1 Question",
    price: 1100,
    duration: "10 minutes",
    modes: ["Phone"],
    features: ["One specific question answered", "Based on your birth chart", "Quick, focused guidance", "Book on WhatsApp or email"],
    bookingService: "general",
  },
  {
    id: "phone-30",
    name: "Phone Consultation",
    price: 2100,
    duration: "30 minutes",
    modes: ["Phone"],
    features: ["Discuss your main concerns in depth", "Vedic, KP, Lal Kitab & Numerology insight", "Timing and practical next steps", "Simple, affordable remedies", "Complete confidentiality"],
    highlighted: true,
    bookingService: "vedic",
  },
  {
    id: "email-3",
    name: "Email Consultation",
    price: 1100,
    duration: "Reply in 7–10 days",
    modes: ["Email"],
    features: ["Ask up to 3 questions", "Detailed written answers", "Useful if you are abroad or prefer writing", "Keep the guidance for reference"],
    bookingService: "general",
  },
];
