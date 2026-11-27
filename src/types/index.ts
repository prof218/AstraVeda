export type IconName =
  | "sun"
  | "scroll"
  | "heart"
  | "rings"
  | "briefcase"
  | "coins"
  | "hash"
  | "compass"
  | "gem"
  | "orbit"
  | "moon"
  | "sparkles"
  | "building"
  | "home"
  | "store"
  | "shield"
  | "user"
  | "book"
  | "lightbulb"
  | "video"
  | "phone"
  | "message"
  | "star"
  | "calendar"
  | "flower";

export type ArtVariant =
  | "planet"
  | "moon"
  | "constellation"
  | "mandala"
  | "gem"
  | "rudraksha"
  | "yantra"
  | "eclipse"
  | "galaxy"
  | "sun"
  | "chart";

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  icon: IconName;
  short: string;
  description: string[];
  benefits: string[];
  whoFor: string[];
  includes: string[];
  faqs: { q: string; a: string }[];
  /** id of the matching option in the booking wizard */
  bookingId: string;
  art: ArtVariant;
  hue: number;
}

export type ZodiacElement = "Fire" | "Earth" | "Air" | "Water";
export type HoroscopePeriod = "daily" | "weekly" | "monthly" | "yearly";

export interface ZodiacSign {
  slug: string;
  name: string;
  sanskrit: string;
  symbol: string;
  dates: string;
  element: ZodiacElement;
  ruler: string;
  quality: "Cardinal" | "Fixed" | "Mutable";
  traits: string[];
  luckyColor: string;
  luckyNumber: number;
  horoscope: Record<HoroscopePeriod, string>;
  focus: { love: string; career: string; wellbeing: string };
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  service: string;
  rating: number;
  quote: string;
  initials: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  /** Demo amount only — replace with client-approved pricing. */
  price: number;
  duration: string;
  modes: string[];
  features: string[];
  highlighted?: boolean;
  bookingService: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  author: string;
  art: ArtVariant;
  hue: number;
  body: { heading?: string; paragraphs: string[] }[];
}

export interface Product {
  id: string;
  name: string;
  category: "Gemstones" | "Yantras" | "Rudraksha" | "Remedies";
  price: number;
  planet?: string;
  description: string;
  benefits: string[];
  art: ArtVariant;
  hue: number;
}

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  title: string;
  caption: string;
  art: ArtVariant;
  hue: number;
  duration?: string;
}

export interface BookingService {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  duration: string;
  /** Demo amount only. */
  price: number;
}

export type ConsultationMode = "video" | "audio" | "chat";

export interface BookingDetails {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  tob: string;
  pob: string;
  concern: string;
}

export interface BookingState {
  serviceId: string | null;
  mode: ConsultationMode | null;
  date: string | null; // yyyy-MM-dd
  slot: string | null; // "10:30"
  details: BookingDetails | null;
}

export interface ConfirmedBooking extends BookingState {
  reference: string;
  createdAt: string;
}
