/** Numerology meanings and calculators (Pythagorean system). */
export const numberMeanings: Record<number, { title: string; keywords: string[]; text: string }> = {
  1: { title: "The Leader", keywords: ["Independent", "Driven", "Original"], text: "Number 1 carries the energy of beginnings. You are wired to initiate, lead and carve your own path." },
  2: { title: "The Peacemaker", keywords: ["Diplomatic", "Sensitive", "Cooperative"], text: "Number 2 seeks harmony and partnership. Your gift is bringing people and ideas together." },
  3: { title: "The Communicator", keywords: ["Creative", "Joyful", "Expressive"], text: "Number 3 thrives on self-expression. Words, art and social connection are where you shine." },
  4: { title: "The Builder", keywords: ["Practical", "Loyal", "Disciplined"], text: "Number 4 builds lasting foundations through patience, order and dependable effort." },
  5: { title: "The Explorer", keywords: ["Adventurous", "Versatile", "Free"], text: "Number 5 craves variety and freedom. Change is your teacher, and adaptability your strength." },
  6: { title: "The Nurturer", keywords: ["Caring", "Responsible", "Harmonious"], text: "Number 6 is devoted to home, family and service. You create beauty and balance for others." },
  7: { title: "The Seeker", keywords: ["Intuitive", "Analytical", "Spiritual"], text: "Number 7 looks beneath the surface. Research, reflection and spiritual inquiry fulfil you." },
  8: { title: "The Achiever", keywords: ["Ambitious", "Authoritative", "Resilient"], text: "Number 8 is the number of material mastery — power, responsibility and long-term success." },
  9: { title: "The Humanitarian", keywords: ["Compassionate", "Wise", "Generous"], text: "Number 9 carries the wisdom of completion. You are drawn to serve something larger than yourself." },
  11: { title: "Master Intuitive", keywords: ["Inspired", "Visionary", "Sensitive"], text: "Master number 11 amplifies intuition and inspiration — a path of illuminating others." },
  22: { title: "Master Builder", keywords: ["Visionary", "Practical", "Powerful"], text: "Master number 22 turns grand visions into reality through disciplined, practical work." },
  33: { title: "Master Teacher", keywords: ["Compassionate", "Healing", "Selfless"], text: "Master number 33 embodies compassionate teaching and healing service." },
};

function reduce(n: number, keepMaster = true): number {
  while (n > 9 && !(keepMaster && (n === 11 || n === 22 || n === 33))) {
    n = String(n).split("").reduce((a, d) => a + Number(d), 0);
  }
  return n;
}

/** Life Path from yyyy-MM-dd. */
export function lifePathNumber(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return reduce(reduce(d) + reduce(m) + reduce(y));
}

const LETTERS: Record<string, number> = {};
"abcdefghijklmnopqrstuvwxyz".split("").forEach((c, i) => (LETTERS[c] = (i % 9) + 1));
const VOWELS = new Set(["a", "e", "i", "o", "u"]);

export function nameNumbers(name: string) {
  const letters = name.toLowerCase().replace(/[^a-z]/g, "").split("");
  const total = letters.reduce((a, c) => a + LETTERS[c], 0);
  const soul = letters.filter((c) => VOWELS.has(c)).reduce((a, c) => a + LETTERS[c], 0);
  const personality = letters.filter((c) => !VOWELS.has(c)).reduce((a, c) => a + LETTERS[c], 0);
  return {
    destiny: reduce(total),
    soulUrge: reduce(soul),
    personality: reduce(personality),
    letters: letters.length,
  };
}
