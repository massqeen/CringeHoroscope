import type { ZodiacSign, Day, Cringe, RoastHoroscope } from '../types';
import { mulberry32 } from '../utils/prng';

// Templates for roast generation
const templates = [
  "Today {sign} will feel {mood}. At work: {work}. In love: {love}. Advice: {tip} {emoji}",
  "{sign}, get ready! {mood} awaits you. Work brings {work}. Daily wisdom: {tip} {emoji}",
  "Dear {sign}, {mood} is your everything today. {work} at work. Don't forget: {tip} {emoji}",
  "Hey {sign}! {mood} is knocking at your door. Workday: {work}. Wisdom of the day: {tip} {emoji}"
];

// Mood dictionaries by cringe level
const moods: Record<Cringe, string[]> = {
  0: [
    "mild anxiety", "pleasant surprise", "calm confidence", 
    "gentle determination", "quiet joy"
  ],
  1: [
    "ironic mood", "light skepticism", "playful doubt",
    "sarcastic smile", "condescending patience"
  ],
  2: [
    "malicious grin", "spiteful pleasure", "caustic righteousness",
    "premium sarcasm", "cynical wisdom"
  ],
  3: [
    "ABSOLUTE CHAOS in your soul", "CRINGE EUPHORIA", "TOXIC POSITIVITY",
    "DESTRUCTIVE ENERGY", "INSANE confidence in being right"
  ]
};

// Work situations by cringe level
const work: Record<Cringe, string[]> = {
  0: [
    "steady progress", "small successes", "productive collaboration",
    "useful meetings", "constructive solutions"
  ],
  1: [
    "another pointless meeting", "simulation of busy activity", 
    "diplomatic conflict avoidance", "creative procrastination"
  ],
  2: [
    "theater of the absurd", "circus with horses", "parade of ambitions", 
    "festival of incompetence", "carnival of office politics"
  ],
  3: [
    "EPIC SYSTEM MELTDOWN", "REVOLUTION AGAINST COMMON SENSE",
    "CHAOTIC DANCE OF DEADLINES", "MADNESS OF CORPORATE CULTURE"
  ]
};

// Love situations by cringe level  
const love: Record<Cringe, string[]> = {
  0: [
    "harmony in relationships", "mutual understanding", "pleasant surprises",
    "romantic moments", "emotional closeness"
  ],
  1: [
    "slight misunderstandings", "ironic compliments", 
    "playful arguments", "sarcasm as love language"
  ],
  2: [
    "dramatic relationship clarifications", "epic fights over trivial things",
    "passive aggression", "war for the TV remote"
  ],
  3: [
    "ROMANTIC APOCALYPSE", "LOVE CATASTROPHE",
    "CHAOS OF FEELINGS AND EMOTIONS", "TOXIC WHIRLPOOL OF PASSION"
  ]
};

// Tips by cringe level
const tips: Record<Cringe, string[]> = {
  0: [
    "pay attention to details", "trust your intuition", 
    "don't rush to conclusions", "appreciate simple joys"
  ],
  1: [
    "activate 'I don't care' mode", "practice the art of sarcasm",
    "don't take everything to heart", "laugh at life's absurdity"
  ],
  2: [
    "prepare for battle with stupidity", "arm yourself with patience and venom",
    "don't hesitate to show your superiority", "let everyone burn with blue flame"
  ],
  3: [
    "DESTROY STEREOTYPES LEFT AND RIGHT", "BE THE EMBODIMENT OF CHAOS",
    "SHOW THE WORLD WHO'S THE ALPHA", "START A REVOLUTION IN YOUR HEAD"
  ]
};

// Emojis by cringe level
const emojis: Record<Cringe, string[]> = {
  0: ["😊", "🌟", "💫", "🌸", "✨"],
  1: ["😏", "🙄", "😉", "🤷‍♀️", "😎"],
  2: ["💀", "🔥", "😈", "💣", "⚡"],
  3: ["🤡", "💥", "🌪️", "👹", "🎭", "🔥💥", "⚡👹"]
};

// Punchlines for cringe levels 2-3
const punchlines: Record<2 | 3, string[]> = {
  2: [
    "P.S. Life is pain, get used to it.", 
    "Good luck, you'll need it.",
    "Remember: everything passes, and this too shall pass... or not."
  ],
  3: [
    "P.S. YOU'RE A LEGEND, SOME JUST DON'T KNOW IT YET!!!",
    "REMEMBER: THE WORLD ISN'T READY FOR YOUR GREATNESS!!!",
    "MOST IMPORTANTLY - BELIEVE IN YOURSELF, EVEN WHEN NO ONE ELSE DOES!!!"
  ]
};

// Zodiac sign names in English
const signNames: Record<ZodiacSign, string> = {
  aries: "Aries",
  taurus: "Taurus", 
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces"
};

interface GenerateRoastOptions {
  sign: ZodiacSign;
  day: Day;
  cringe: Cringe;
  seed: number;
}

/**
 * Generates a roast horoscope based on templates and dictionaries
 */
export function generateRoast(options: GenerateRoastOptions): RoastHoroscope {
  const { sign, day, cringe, seed } = options;
  const rng = mulberry32(seed);
  
  // Select random template
  const template = templates[Math.floor(rng() * templates.length)];
  
  // Select random elements based on cringe level
  const mood = moods[cringe][Math.floor(rng() * moods[cringe].length)];
  const workSituation = work[cringe][Math.floor(rng() * work[cringe].length)];
  const loveSituation = love[cringe][Math.floor(rng() * love[cringe].length)];
  const tip = tips[cringe][Math.floor(rng() * tips[cringe].length)];
  const emoji = emojis[cringe][Math.floor(rng() * emojis[cringe].length)];
  
  // Replace placeholders in template
  let text = template
    .replace('{sign}', signNames[sign])
    .replace('{mood}', mood)
    .replace('{work}', workSituation)
    .replace('{love}', loveSituation)
    .replace('{tip}', tip)
    .replace('{emoji}', emoji);
  
  // Apply transforms based on cringe level
  text = applyTransforms(text, cringe, rng);
  
  // Add punchline for cringe levels 2-3
  if (cringe >= 2) {
    const punchlineArray = punchlines[cringe as 2 | 3];
    const punchline = punchlineArray[Math.floor(rng() * punchlineArray.length)];
    text += ' ' + punchline;
  }
  
  return { text };
}

/**
 * Applies text transformations based on cringe level
 */
function applyTransforms(text: string, cringe: Cringe, rng: () => number): string {
  let result = text;
  
  switch (cringe) {
    case 1:
      // 10% chance to add mild emphasis
      if (rng() < 0.1) {
        result += " (you know what I mean)";
      }
      break;
      
    case 2:
      // 20% chance to add caps to one word
      if (rng() < 0.2) {
        const words = result.split(' ');
        const randomWordIndex = Math.floor(rng() * words.length);
        words[randomWordIndex] = words[randomWordIndex].toUpperCase();
        result = words.join(' ');
      }
      // Add some hyperbole
      result = result.replace(/very/gi, 'INCREDIBLY');
      result = result.replace(/really/gi, 'ABSOLUTELY');
      break;
      
    case 3:
      // 30% chance for word elongation on vowels
      if (rng() < 0.3) {
        result = result.replace(/([aeiou])/gi, (match) => 
          rng() < 0.1 ? match.repeat(3) : match
        );
      }
      // More caps words
      if (rng() < 0.4) {
        const words = result.split(' ');
        const numCapsWords = Math.floor(rng() * 3) + 1;
        for (let i = 0; i < numCapsWords; i++) {
          const randomWordIndex = Math.floor(rng() * words.length);
          words[randomWordIndex] = words[randomWordIndex].toUpperCase();
        }
        result = words.join(' ');
      }
      break;
  }
  
  return result;
}
