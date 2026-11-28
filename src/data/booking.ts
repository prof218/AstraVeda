import { addDays, format, isBefore, startOfDay } from "date-fns";
import type { BookingService, ConsultationMode, IconName } from "@/types";
import { hashString } from "@/lib/utils";

/**
 * Booking wizard options. Fees follow msastrologer.com: a 30-minute phone
 * consultation is INR 2,100; a single question (10 min) is INR 1,100.
 */
export const bookingServices: BookingService[] = [
  { id: "vedic", name: "Vedic Astrology", description: "Complete birth chart reading & life overview", icon: "sun", duration: "30 min", price: 2100 },
  { id: "kundli", name: "Kundli Analysis", description: "In-depth Janam Kundli with divisional charts", icon: "scroll", duration: "30 min", price: 2100 },
  { id: "love", name: "Love & Relationship", description: "Emotional patterns, Venus & relationship timing", icon: "heart", duration: "30 min", price: 2100 },
  { id: "marriage", name: "Marriage Consultation", description: "Kundli matching & marriage timing", icon: "rings", duration: "30 min", price: 2100 },
  { id: "career", name: "Career Guidance", description: "Vocation, job change & growth windows", icon: "briefcase", duration: "30 min", price: 2100 },
  { id: "business", name: "Business Guidance", description: "Ventures, partnerships & financial cycles", icon: "coins", duration: "30 min", price: 2100 },
  { id: "numerology", name: "Numerology", description: "Life Path, Destiny & name analysis", icon: "hash", duration: "30 min", price: 2100 },
  { id: "vastu", name: "Vastu Consultation", description: "Home, office or shop floor-plan review", icon: "compass", duration: "30 min", price: 2100 },
  { id: "general", name: "Ask 1 Question", description: "One specific question, answered from your chart", icon: "sparkles", duration: "10 min", price: 1100 },
];

export const consultationModes: { id: ConsultationMode; name: string; description: string; icon: IconName }[] = [
  { id: "audio", name: "Phone Call", description: "A focused one-to-one call with Mahender Singh", icon: "phone" },
  { id: "chat", name: "Email Consultation", description: "Up to 3 questions, written reply in 7–10 days", icon: "message" },
];

const ALL_SLOTS = ["10:00", "10:45", "11:30", "12:15", "14:00", "14:45", "15:30", "16:15", "17:00", "17:45", "18:30"];

/** How far ahead the demo calendar accepts bookings. */
export const BOOKING_WINDOW_DAYS = 60;

/**
 * Deterministic MOCK availability.
 * Sundays are closed; roughly one weekday in six is fully booked.
 */
export function getAvailableSlots(date: Date, today: Date): string[] {
  const day = startOfDay(date);
  const now = startOfDay(today);
  if (isBefore(day, now)) return [];
  if (isBefore(addDays(now, BOOKING_WINDOW_DAYS), day)) return [];
  if (day.getDay() === 0) return [];
  const key = format(day, "yyyy-MM-dd");
  const h = hashString(key);
  if (h % 6 === 0) return [];
  const slots = ALL_SLOTS.filter((_, i) => ((h >> i) & 3) !== 0);
  // Today: hide slots that already passed (plus 1h buffer)
  if (format(now, "yyyy-MM-dd") === key) {
    const minutes = today.getHours() * 60 + today.getMinutes() + 60;
    return slots.filter((s) => {
      const [hh, mm] = s.split(":").map(Number);
      return hh * 60 + mm > minutes;
    });
  }
  return slots;
}

export function formatSlot(slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function generateDemoReference() {
  const stamp = format(new Date(), "yyMMdd");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `AV-DEMO-${stamp}-${rand}`;
}
