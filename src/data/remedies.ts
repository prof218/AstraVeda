import type { Product } from "@/types";

/**
 * DEMO product catalogue. Prices are illustrative — no checkout exists.
 * Visitors can send an enquiry (frontend demo only).
 */
export const products: Product[] = [
  { id: "blue-sapphire", name: "Blue Sapphire (Neelam)", category: "Gemstones", planet: "Saturn", price: 18500, art: "gem", hue: 222,
    description: "A powerful stone associated with Saturn, traditionally recommended only after a careful chart review.",
    benefits: ["Discipline & focus", "Career stability", "Trial-wear recommended"] },
  { id: "yellow-sapphire", name: "Yellow Sapphire (Pukhraj)", category: "Gemstones", planet: "Jupiter", price: 14500, art: "gem", hue: 48,
    description: "Linked with Jupiter — wisdom, prosperity and auspicious beginnings.",
    benefits: ["Wisdom & growth", "Marriage harmony", "Financial blessings"] },
  { id: "emerald", name: "Emerald (Panna)", category: "Gemstones", planet: "Mercury", price: 12000, art: "gem", hue: 150,
    description: "Mercury's stone for communication, intellect and business acumen.",
    benefits: ["Clear communication", "Business intellect", "Learning support"] },
  { id: "pearl", name: "Natural Pearl (Moti)", category: "Gemstones", planet: "Moon", price: 6500, art: "moon", hue: 210,
    description: "A calming gem associated with the Moon and emotional balance.",
    benefits: ["Emotional calm", "Restful sleep", "Intuition"] },
  { id: "shree-yantra", name: "Shree Yantra", category: "Yantras", price: 3100, art: "yantra", hue: 38,
    description: "The sacred geometry of abundance, crafted in copper for the home altar.",
    benefits: ["Prosperity", "Harmony at home", "Meditation focus"] },
  { id: "navgraha-yantra", name: "Navagraha Yantra", category: "Yantras", price: 2500, art: "yantra", hue: 270,
    description: "Represents all nine planets — traditionally used to balance planetary influences.",
    benefits: ["Planetary balance", "Protection", "Peace of mind"] },
  { id: "rudraksha-5", name: "5 Mukhi Rudraksha", category: "Rudraksha", price: 900, art: "rudraksha", hue: 25,
    description: "The most widely worn rudraksha, associated with Jupiter and inner calm.",
    benefits: ["Calm mind", "Meditation", "Suitable for most people"] },
  { id: "rudraksha-7", name: "7 Mukhi Rudraksha", category: "Rudraksha", price: 2200, art: "rudraksha", hue: 18,
    description: "Associated with Goddess Lakshmi and traditionally worn for prosperity.",
    benefits: ["Abundance", "Overcoming obstacles", "Stability"] },
  { id: "rudraksha-mala", name: "Rudraksha Japa Mala", category: "Rudraksha", price: 1800, art: "rudraksha", hue: 30,
    description: "108 + 1 beads for mantra chanting and daily meditation.",
    benefits: ["Mantra practice", "Focus", "Daily ritual"] },
  { id: "puja-kit", name: "Personalised Puja Guidance", category: "Remedies", price: 2100, art: "mandala", hue: 300,
    description: "A planet-specific puja and mantra plan prepared from your chart.",
    benefits: ["Chart-specific", "Step-by-step guidance", "Mantra schedule"] },
  { id: "mantra-plan", name: "40-Day Mantra Sadhana Plan", category: "Remedies", price: 1100, art: "sun", hue: 40,
    description: "A structured 40-day mantra routine with timing and pronunciation notes.",
    benefits: ["Discipline", "Inner strength", "Planet-specific"] },
  { id: "daan-guide", name: "Charity (Daan) Remedy Guide", category: "Remedies", price: 500, art: "constellation", hue: 200,
    description: "Planet-wise charity recommendations — simple, meaningful and accessible.",
    benefits: ["Accessible to all", "Karmic balance", "Weekly plan"] },
];

export const productCategories = ["All", "Gemstones", "Yantras", "Rudraksha", "Remedies"] as const;
