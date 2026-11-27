import type { HoroscopePeriod, ZodiacSign } from "@/types";

/**
 * SAMPLE horoscope content for the demo. General sun-sign readings are for
 * entertainment and reflection; replace with the astrologer's own columns.
 * Symbols use the text-presentation selector (U+FE0E) to avoid emoji rendering.
 */
export const zodiacSigns: ZodiacSign[] = [
  {
    slug: "aries", name: "Aries", sanskrit: "Mesha", symbol: "♈︎", dates: "Mar 21 – Apr 19",
    element: "Fire", ruler: "Mars", quality: "Cardinal",
    traits: ["Courageous", "Direct", "Energetic", "Pioneering"], luckyColor: "Crimson", luckyNumber: 9,
    horoscope: {
      daily: "A conversation you have been postponing finally finds its moment. Speak plainly but kindly — your honesty opens a door today.",
      weekly: "Mars energises your work sector, so tasks that stalled begin moving again. Midweek favours planning; the weekend rewards rest over restlessness.",
      monthly: "This month asks you to finish before you start. Clearing pending commitments creates room for an exciting proposal arriving in the final week.",
      yearly: "Jupiter's support brings growth through learning and travel. Expect a career shift in the second half of the year — one that rewards the patience you build early on.",
    },
    focus: { love: "Warmth over urgency — let things unfold.", career: "Lead a small project to visible success.", wellbeing: "Channel restlessness into morning movement." },
  },
  {
    slug: "taurus", name: "Taurus", sanskrit: "Vrishabha", symbol: "♉︎", dates: "Apr 20 – May 20",
    element: "Earth", ruler: "Venus", quality: "Fixed",
    traits: ["Grounded", "Loyal", "Patient", "Sensual"], luckyColor: "Emerald", luckyNumber: 6,
    horoscope: {
      daily: "Small comforts restore you today. A thoughtful gesture from someone close reminds you how much steady support you have.",
      weekly: "Financial matters come into focus. Review a recurring expense — a simple change now brings lasting ease. Friday is ideal for creative work.",
      monthly: "Venus brightens your relationships, encouraging reconnection with old friends. Mid-month, a practical decision about home or property needs careful thought.",
      yearly: "A year of building foundations. Savings, skills and steady relationships all grow quietly, and by year-end you will see how far you have come.",
    },
    focus: { love: "Express appreciation openly.", career: "Consistency earns you recognition.", wellbeing: "Prioritise sleep and nourishing meals." },
  },
  {
    slug: "gemini", name: "Gemini", sanskrit: "Mithuna", symbol: "♊︎", dates: "May 21 – Jun 20",
    element: "Air", ruler: "Mercury", quality: "Mutable",
    traits: ["Curious", "Witty", "Adaptable", "Expressive"], luckyColor: "Yellow", luckyNumber: 5,
    horoscope: {
      daily: "Ideas arrive quickly today — capture them before they slip away. A brief message could turn into a valuable opportunity.",
      weekly: "Your social calendar fills up. Choose quality over quantity, and you will meet someone who shares a surprising interest.",
      monthly: "Mercury favours study, writing and negotiation. It is a strong month to sign up for a course or pitch an idea you have been refining.",
      yearly: "Expansion through communication defines your year. Teaching, writing or a public-facing role brings recognition — guard your energy by setting clear priorities.",
    },
    focus: { love: "Listen as much as you share.", career: "Network with intention.", wellbeing: "Digital breaks calm a busy mind." },
  },
  {
    slug: "cancer", name: "Cancer", sanskrit: "Karka", symbol: "♋︎", dates: "Jun 21 – Jul 22",
    element: "Water", ruler: "Moon", quality: "Cardinal",
    traits: ["Nurturing", "Intuitive", "Protective", "Devoted"], luckyColor: "Silver", luckyNumber: 2,
    horoscope: {
      daily: "Trust your intuition about a family matter. A gentle approach resolves what force could not.",
      weekly: "Home and emotional security take centre stage. A small rearrangement of your living space lifts your mood more than expected.",
      monthly: "The Full Moon mid-month highlights a relationship that needs honest care. Professionally, your empathy makes you the person others rely on.",
      yearly: "This is a year to nurture yourself as deeply as you nurture others. Home improvements, family milestones and emotional healing are all strongly supported.",
    },
    focus: { love: "Share your feelings before they build up.", career: "Your people skills are an asset.", wellbeing: "Time near water restores you." },
  },
  {
    slug: "leo", name: "Leo", sanskrit: "Simha", symbol: "♌︎", dates: "Jul 23 – Aug 22",
    element: "Fire", ruler: "Sun", quality: "Fixed",
    traits: ["Generous", "Confident", "Creative", "Warm-hearted"], luckyColor: "Gold", luckyNumber: 1,
    horoscope: {
      daily: "Your presence lights up a room today. Use it to encourage someone who needs your confidence more than your advice.",
      weekly: "Creative projects flourish. Share your work — feedback received this week helps you refine something important.",
      monthly: "The Sun spotlights your career. A leadership opportunity appears; accept it with humility and you will earn lasting respect.",
      yearly: "A bold, visible year. Recognition comes through creative self-expression, and a long-held dream takes a meaningful step forward in the final quarter.",
    },
    focus: { love: "Romance thrives on playful attention.", career: "Step into a leadership role.", wellbeing: "Balance late nights with morning sun." },
  },
  {
    slug: "virgo", name: "Virgo", sanskrit: "Kanya", symbol: "♍︎", dates: "Aug 23 – Sep 22",
    element: "Earth", ruler: "Mercury", quality: "Mutable",
    traits: ["Analytical", "Helpful", "Precise", "Modest"], luckyColor: "Sage Green", luckyNumber: 5,
    horoscope: {
      daily: "An organised start sets the tone for a productive day. Let go of one perfectionist detail — it matters less than you think.",
      weekly: "Health routines and work systems improve with small adjustments. A colleague appreciates your thoughtful help midweek.",
      monthly: "A month of refinement. Streamline a process, declutter your space and you will create mental room for a new opportunity.",
      yearly: "Partnerships — personal and professional — become central this year. Collaboration multiplies what you can achieve alone.",
    },
    focus: { love: "Accept care as readily as you give it.", career: "Your attention to detail stands out.", wellbeing: "Gentle routines beat strict regimes." },
  },
  {
    slug: "libra", name: "Libra", sanskrit: "Tula", symbol: "♎︎", dates: "Sep 23 – Oct 22",
    element: "Air", ruler: "Venus", quality: "Cardinal",
    traits: ["Diplomatic", "Graceful", "Fair-minded", "Sociable"], luckyColor: "Rose", luckyNumber: 6,
    horoscope: {
      daily: "Harmony comes easily when you state your own preference first. Others are more flexible than you assume.",
      weekly: "Social and romantic opportunities increase. A creative collaboration started this week has lasting potential.",
      monthly: "Venus favours beauty, art and relationships. Mid-month, a decision you have been weighing becomes clearer — trust the balance you find.",
      yearly: "A transformative year for personal goals. You learn to choose for yourself, and that clarity attracts healthier partnerships.",
    },
    focus: { love: "Honest needs build deeper bonds.", career: "Mediation skills earn trust.", wellbeing: "Art and music restore balance." },
  },
  {
    slug: "scorpio", name: "Scorpio", sanskrit: "Vrishchika", symbol: "♏︎", dates: "Oct 23 – Nov 21",
    element: "Water", ruler: "Mars", quality: "Fixed",
    traits: ["Intense", "Perceptive", "Resilient", "Loyal"], luckyColor: "Maroon", luckyNumber: 8,
    horoscope: {
      daily: "Your insight cuts straight to the heart of a problem today. Share it thoughtfully, and it becomes a gift rather than a challenge.",
      weekly: "An emotional breakthrough is possible. Letting go of an old grievance frees energy for something new and promising.",
      monthly: "Birthday season brings renewal. Set intentions for the year ahead — the clarity you feel now is worth writing down.",
      yearly: "A year of deep personal growth. Financial partnerships, research and inner work bring rewards; trust the process of slow transformation.",
    },
    focus: { love: "Vulnerability deepens trust.", career: "Research and strategy shine.", wellbeing: "Release tension through breathwork." },
  },
  {
    slug: "sagittarius", name: "Sagittarius", sanskrit: "Dhanu", symbol: "♐︎", dates: "Nov 22 – Dec 21",
    element: "Fire", ruler: "Jupiter", quality: "Mutable",
    traits: ["Optimistic", "Adventurous", "Philosophical", "Honest"], luckyColor: "Purple", luckyNumber: 3,
    horoscope: {
      daily: "Optimism is contagious today. A spontaneous plan turns into one of the highlights of your week.",
      weekly: "Learning, travel and big-picture thinking are favoured. A mentor's advice helps you see your next step clearly.",
      monthly: "Jupiter expands your horizons — consider a course, a trip or a philosophical exploration. Keep a close eye on spending late in the month.",
      yearly: "Growth through relationships and teaching. A partnership formed this year opens doors you could not open alone.",
    },
    focus: { love: "Adventure together strengthens bonds.", career: "Teach or share what you know.", wellbeing: "Outdoor time is medicine." },
  },
  {
    slug: "capricorn", name: "Capricorn", sanskrit: "Makara", symbol: "♑︎", dates: "Dec 22 – Jan 19",
    element: "Earth", ruler: "Saturn", quality: "Cardinal",
    traits: ["Disciplined", "Ambitious", "Responsible", "Steady"], luckyColor: "Charcoal", luckyNumber: 8,
    horoscope: {
      daily: "Steady effort today lays groundwork that pays off later. Take a short break — productivity improves when you rest.",
      weekly: "Career matters move forward. A senior figure notices your reliability; be ready to discuss your goals openly.",
      monthly: "Saturn rewards structure. Set realistic milestones for the coming quarter, and allow some time for loved ones.",
      yearly: "A year of earned recognition. Long-term efforts reach visible milestones, and relationships stabilise as you balance work with warmth.",
    },
    focus: { love: "Make time — not just plans.", career: "Your reliability opens doors.", wellbeing: "Stretch and strengthen the back and knees." },
  },
  {
    slug: "aquarius", name: "Aquarius", sanskrit: "Kumbha", symbol: "♒︎", dates: "Jan 20 – Feb 18",
    element: "Air", ruler: "Saturn", quality: "Fixed",
    traits: ["Visionary", "Independent", "Humanitarian", "Inventive"], luckyColor: "Electric Blue", luckyNumber: 4,
    horoscope: {
      daily: "An unconventional idea gets a warm reception today. Share it with someone who can help bring it to life.",
      weekly: "Community and friendships are highlighted. A group project or online community brings unexpected support.",
      monthly: "Innovation is favoured — experiment with new tools or approaches at work. Late in the month, slow down and reconnect with your inner self.",
      yearly: "A year of reinvention. Personal goals, appearance and direction all evolve; embrace the change and you will feel more like yourself.",
    },
    focus: { love: "Friendship is your foundation.", career: "Innovate and propose.", wellbeing: "Quiet time balances social energy." },
  },
  {
    slug: "pisces", name: "Pisces", sanskrit: "Meena", symbol: "♓︎", dates: "Feb 19 – Mar 20",
    element: "Water", ruler: "Jupiter", quality: "Mutable",
    traits: ["Compassionate", "Imaginative", "Gentle", "Spiritual"], luckyColor: "Sea Green", luckyNumber: 7,
    horoscope: {
      daily: "Your intuition is unusually clear today. Follow a gentle nudge — it leads somewhere meaningful.",
      weekly: "Creative and spiritual pursuits flow beautifully. Protect your time from people who drain rather than inspire you.",
      monthly: "Jupiter supports growth in your inner life. Meditation, art or service brings deep fulfilment; mid-month, a financial matter needs grounding.",
      yearly: "A year of gentle abundance. Creative work, spiritual practice and kind relationships all flourish — boundaries keep the blessings flowing.",
    },
    focus: { love: "Romance blossoms through shared dreams.", career: "Creative work gains traction.", wellbeing: "Rest deeply; protect your energy." },
  },
];

export const horoscopePeriods: { id: HoroscopePeriod; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

export function getSign(slug: string) {
  return zodiacSigns.find((s) => s.slug === slug);
}

export function isPeriod(v: string | null | undefined): v is HoroscopePeriod {
  return v === "daily" || v === "weekly" || v === "monthly" || v === "yearly";
}

/** Western (tropical) sun sign from a yyyy-MM-dd date string. */
export function sunSignFromDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  const md = m * 100 + d;
  const ranges: [number, number, string][] = [
    [321, 419, "aries"], [420, 520, "taurus"], [521, 620, "gemini"], [621, 722, "cancer"],
    [723, 822, "leo"], [823, 922, "virgo"], [923, 1022, "libra"], [1023, 1121, "scorpio"],
    [1122, 1221, "sagittarius"], [120, 218, "aquarius"], [219, 320, "pisces"],
  ];
  const match = ranges.find(([a, b]) => md >= a && md <= b);
  return getSign(match ? match[2] : "capricorn")!;
}
