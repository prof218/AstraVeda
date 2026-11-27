import type { GalleryItem } from "@/types";

/**
 * DEMO gallery. Artwork is generated illustration standing in for the client's
 * real photographs; videos are placeholders until real embeds are supplied.
 */
export const galleryItems: GalleryItem[] = [
  { id: "g1", type: "image", title: "Guru Purnima Satsang", caption: "Evening satsang and Q&A with students (placeholder).", art: "mandala", hue: 38 },
  { id: "g2", type: "image", title: "Navagraha Puja", caption: "Annual planetary peace ceremony (placeholder).", art: "sun", hue: 25 },
  { id: "g3", type: "image", title: "Vastu Site Visit", caption: "Assessing a new office space in Gurugram (placeholder).", art: "yantra", hue: 160 },
  { id: "g4", type: "image", title: "Astrology Convention", caption: "Talk on dasha timing techniques (placeholder).", art: "galaxy", hue: 255 },
  { id: "g5", type: "image", title: "Lunar Eclipse Meditation", caption: "Group meditation during the eclipse (placeholder).", art: "eclipse", hue: 285 },
  { id: "g6", type: "image", title: "Consultation Studio", caption: "The calm space where consultations happen (placeholder).", art: "moon", hue: 220 },
  { id: "g7", type: "image", title: "Jyotish Workshop", caption: "Weekend workshop for beginners (placeholder).", art: "constellation", hue: 195 },
  { id: "g8", type: "image", title: "Gemstone Certification", caption: "Reviewing certified gemstones (placeholder).", art: "gem", hue: 300 },
  { id: "v1", type: "video", title: "What Is Your Moon Sign?", caption: "A 6-minute introduction to the Moon in Vedic astrology.", art: "moon", hue: 230, duration: "6:12" },
  { id: "v2", type: "video", title: "Saturn Transit 2026", caption: "How the current Saturn transit affects each sign.", art: "planet", hue: 210, duration: "14:05" },
  { id: "v3", type: "video", title: "Vastu for Bedrooms", caption: "Simple changes for restful sleep.", art: "yantra", hue: 165, duration: "8:47" },
  { id: "v4", type: "video", title: "Choosing a Gemstone", caption: "Why your chart matters more than your sign.", art: "gem", hue: 280, duration: "10:30" },
];
