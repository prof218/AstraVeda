import type { PricingPlan } from "@/types";

/**
 * DEMO pricing. These are illustrative amounts only — the client's real
 * consultation fees must be confirmed and entered here before launch.
 */
export const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic Consultation",
    price: 1100,
    duration: "30 minutes",
    modes: ["Audio", "Chat"],
    features: ["One focused question or life area", "Birth chart overview", "Current dasha snapshot", "One simple remedy"],
    bookingService: "general",
  },
  {
    id: "premium",
    name: "Premium Consultation",
    price: 2100,
    duration: "45 minutes",
    modes: ["Video", "Audio", "Chat"],
    features: ["Up to three life areas", "Detailed planetary analysis", "Transit & timing windows", "Personalised remedy plan", "7-day follow-up question"],
    highlighted: true,
    bookingService: "vedic",
  },
  {
    id: "kundli",
    name: "Detailed Kundli Analysis",
    price: 3500,
    duration: "75 minutes",
    modes: ["Video", "Audio"],
    features: ["Complete D1, D9 & D10 study", "Dosha & yoga assessment", "5-year dasha roadmap", "Career, marriage & health focus", "Gemstone suitability check"],
    bookingService: "kundli",
  },
];
