import type { ZodiacSign, Day, Cringe, RoastHoroscope } from '../types';
import { mulberry32 } from '../utils/prng';

// Templates for roast generation
const templates = [
  'Today {sign} will feel {mood}. At work: {work}. In love: {love}. Advice: {tip} {emoji}',
  '{sign}, get ready! {mood} awaits you. Work brings {work}. Daily wisdom: {tip} {emoji}',
  "Dear {sign}, {mood} is your everything today. {work} at work. Don't forget: {tip} {emoji}",
  'Hey {sign}! {mood} is knocking at your door. Workday: {work}. Wisdom of the day: {tip} {emoji}',
];

// Mood dictionaries by cringe level
const moods: Record<Cringe, string[]> = {
  0: ['mild anxiety', 'pleasant surprise', 'calm confidence', 'gentle determination', 'quiet joy'],
  1: [
    'ironic mood',
    'light skepticism',
    'playful doubt',
    'sarcastic smile',
    'condescending patience',
  ],
  2: [
    'malicious grin',
    'spiteful pleasure',
    'caustic righteousness',
    'premium sarcasm',
    'cynical wisdom',
  ],
  3: [
    'ABSOLUTE CHAOS in your soul',
    'CRINGE EUPHORIA',
    'TOXIC POSITIVITY',
    'DESTRUCTIVE ENERGY',
    'INSANE confidence in being right',
  ],
};

// Work situations by cringe level
const work: Record<Cringe, string[]> = {
  0: [
    'steady progress',
    'small successes',
    'productive collaboration',
    'useful meetings',
    'constructive solutions',
  ],
  1: [
    'another pointless meeting',
    'simulation of busy activity',
    'diplomatic conflict avoidance',
    'creative procrastination',
  ],
  2: [
    'theater of the absurd',
    'circus with horses',
    'parade of ambitions',
    'festival of incompetence',
    'carnival of office politics',
  ],
  3: [
    'EPIC SYSTEM MELTDOWN',
    'REVOLUTION AGAINST COMMON SENSE',
    'CHAOTIC DANCE OF DEADLINES',
    'MADNESS OF CORPORATE CULTURE',
  ],
};

// Love situations by cringe level
const love: Record<Cringe, string[]> = {
  0: [
    'harmony in relationships',
    'mutual understanding',
    'pleasant surprises',
    'romantic moments',
    'emotional closeness',
  ],
  1: [
    'slight misunderstandings',
    'ironic compliments',
    'playful arguments',
    'sarcasm as love language',
  ],
  2: [
    'dramatic relationship clarifications',
    'epic fights over trivial things',
    'passive aggression',
    'war for the TV remote',
  ],
  3: [
    'ROMANTIC APOCALYPSE',
    'LOVE CATASTROPHE',
    'CHAOS OF FEELINGS AND EMOTIONS',
    'TOXIC WHIRLPOOL OF PASSION',
  ],
};

// Tips by cringe level
const tips: Record<Cringe, string[]> = {
  0: [
    'pay attention to details',
    'trust your intuition',
    "don't rush to conclusions",
    'appreciate simple joys',
  ],
  1: [
    "activate 'I don't care' mode",
    'practice the art of sarcasm',
    "don't take everything to heart",
    "laugh at life's absurdity",
  ],
  2: [
    'prepare for battle with stupidity',
    'arm yourself with patience and venom',
    "don't hesitate to show your superiority",
    'let everyone burn with blue flame',
  ],
  3: [
    'DESTROY STEREOTYPES LEFT AND RIGHT',
    'BE THE EMBODIMENT OF CHAOS',
    "SHOW THE WORLD WHO'S THE ALPHA",
    'START A REVOLUTION IN YOUR HEAD',
  ],
};

// Emojis by cringe level
const emojis: Record<Cringe, string[]> = {
  0: ['😊', '🌟', '💫', '🌸', '✨'],
  1: ['😏', '🙄', '😉', '🤷‍♀️', '😎'],
  2: ['💀', '🔥', '😈', '💣', '⚡'],
  3: ['🤡', '💥', '🌪️', '👹', '🎭', '🔥💥', '⚡👹'],
};

// Punchlines for cringe levels 2-3
const punchlines: Record<2 | 3, string[]> = {
  2: [
    'P.S. Life is pain, get used to it.',
    "Good luck, you'll need it.",
    'Remember: everything passes, and this too shall pass... or not.',
  ],
  3: [
    "P.S. YOU'RE A LEGEND, SOME JUST DON'T KNOW IT YET!!!",
    "REMEMBER: THE WORLD ISN'T READY FOR YOUR GREATNESS!!!",
    'MOST IMPORTANTLY - BELIEVE IN YOURSELF, EVEN WHEN NO ONE ELSE DOES!!!',
  ],
};

// Zodiac sign names in English
const signNames: Record<ZodiacSign, string> = {
  aries: 'Aries',
  taurus: 'Taurus',
  gemini: 'Gemini',
  cancer: 'Cancer',
  leo: 'Leo',
  virgo: 'Virgo',
  libra: 'Libra',
  scorpio: 'Scorpio',
  sagittarius: 'Sagittarius',
  capricorn: 'Capricorn',
  aquarius: 'Aquarius',
  pisces: 'Pisces',
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
  const { sign, cringe, seed } = options;
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
 * Gets detailed breakdown of cringe level mapping for debugging/visualization
 */
export function getCringeMapping(cringe: Cringe): {
  level: Cringe;
  label: string;
  description: string;
  availableOptions: {
    moods: string[];
    workSituations: string[];
    loveSituations: string[];
    tips: string[];
    emojis: string[];
    punchlines?: string[];
  };
  transformFeatures: string[];
} {
  const labels = {
    0: 'Mild',
    1: 'Ironic',
    2: 'Sarcastic',
    3: 'Cringe Hard',
  };

  const descriptions = {
    0: 'Gentle and pleasant vibes',
    1: 'Light sarcasm and wit',
    2: 'Sharp sarcasm and attitude',
    3: 'Maximum chaos and cringe',
  };

  const transformFeatures = {
    0: ['Clean text', 'No modifications', 'Pure content'],
    1: ['10% mild emphasis phrases', '15% emoji intensification', 'Subtle enhancements'],
    2: [
      '20% alternating caps (AbCdEfG)',
      'Hyperbole replacements',
      '25% interjection insertions',
      '30% emoji upgrades',
    ],
    3: [
      '40% vowel elongation (wooooord)',
      '35% alternating caps on 2-3 words',
      'Maximum hyperbole',
      '40% multiple interjections',
      '50% emoji explosion',
    ],
  };

  return {
    level: cringe,
    label: labels[cringe],
    description: descriptions[cringe],
    availableOptions: {
      moods: moods[cringe],
      workSituations: work[cringe],
      loveSituations: love[cringe],
      tips: tips[cringe],
      emojis: emojis[cringe],
      punchlines: cringe >= 2 ? punchlines[cringe as 2 | 3] : undefined,
    },
    transformFeatures: transformFeatures[cringe],
  };
}

/**
 * Generates a preview of all possible content for a given cringe level
 */
export function generateCringePreview(
  cringe: Cringe,
  sign: ZodiacSign = 'aries',
): {
  sampleTexts: string[];
  mapping: ReturnType<typeof getCringeMapping>;
} {
  const mapping = getCringeMapping(cringe);
  const sampleTexts: string[] = [];

  // Generate 3 sample texts with different seeds
  for (let i = 0; i < 3; i++) {
    const seed = Date.now() + i * 1000;
    const sample = generateRoast({
      sign,
      day: 'today',
      cringe,
      seed,
    });
    sampleTexts.push(sample.text);
  }

  return {
    sampleTexts,
    mapping,
  };
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
        result += ' (you know what I mean)';
      }
      // 15% chance for emoji intensification
      if (rng() < 0.15) {
        result = intensifyEmojis(result, 1, rng);
      }
      break;

    case 2:
      // 20% chance to add alternating caps to 1-2 words
      if (rng() < 0.2) {
        result = applyAlternatingCaps(result, 1, rng);
      }
      // Add hyperbole replacements
      result = addHyperbole(result, rng);
      // 25% chance for interjection insertions
      if (rng() < 0.25) {
        result = insertInterjections(result, 1, rng);
      }
      // 30% chance for emoji intensification
      if (rng() < 0.3) {
        result = intensifyEmojis(result, 2, rng);
      }
      break;

    case 3:
      // 40% chance for vowel elongation on 2-3 words
      if (rng() < 0.4) {
        result = elongateVowels(result, 2 + Math.floor(rng() * 2), rng);
      }
      // 35% chance for alternating caps on 2-3 words
      if (rng() < 0.35) {
        result = applyAlternatingCaps(result, 2 + Math.floor(rng() * 2), rng);
      }
      // Maximum hyperbole
      result = addHyperbole(result, rng, true);
      // 40% chance for multiple interjections
      if (rng() < 0.4) {
        result = insertInterjections(result, 2, rng);
      }
      // Maximum emoji intensification
      if (rng() < 0.5) {
        result = intensifyEmojis(result, 3, rng);
      }
      break;
  }

  return result;
}

/**
 * Applies alternating caps pattern (AbCdEfG) to random words
 */
function applyAlternatingCaps(text: string, wordCount: number, rng: () => number): string {
  const words = text.split(' ');
  const wordsToTransform = Math.min(wordCount, words.length);

  for (let i = 0; i < wordsToTransform; i++) {
    const randomIndex = Math.floor(rng() * words.length);
    const word = words[randomIndex];

    // Skip if word is too short or already transformed
    if (word.length < 3 || /[A-Z].*[a-z].*[A-Z]/.test(word)) continue;

    // Apply alternating caps pattern
    words[randomIndex] = word
      .split('')
      .map((char, index) =>
        char.match(/[a-zA-Z]/) ? (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()) : char,
      )
      .join('');
  }

  return words.join(' ');
}

/**
 * Elongates vowels in random words (wooooord)
 */
function elongateVowels(text: string, wordCount: number, rng: () => number): string {
  const words = text.split(' ');
  const wordsToTransform = Math.min(wordCount, words.length);

  for (let i = 0; i < wordsToTransform; i++) {
    const randomIndex = Math.floor(rng() * words.length);
    const word = words[randomIndex];

    // Skip short words or those already elongated
    if (word.length < 3 || /([aeiou])\1{2,}/i.test(word)) continue;

    // Find vowels and elongate one randomly
    const vowelMatches = [...word.matchAll(/[aeiou]/gi)];
    if (vowelMatches.length > 0) {
      const randomVowel = vowelMatches[Math.floor(rng() * vowelMatches.length)];
      const vowelIndex = randomVowel.index!;
      const elongationLength = 3 + Math.floor(rng() * 3); // 3-5 repetitions

      words[randomIndex] =
        word.slice(0, vowelIndex + 1) +
        randomVowel[0].repeat(elongationLength - 1) +
        word.slice(vowelIndex + 1);
    }
  }

  return words.join(' ');
}

/**
 * Adds hyperbolic language replacements
 */
function addHyperbole(text: string, rng: () => number, intense: boolean = false): string {
  let result = text;

  const basicReplacements = {
    very: 'INCREDIBLY',
    really: 'ABSOLUTELY',
    quite: 'EXTREMELY',
    pretty: 'RIDICULOUSLY',
    rather: 'INSANELY',
  };

  const intenseReplacements = {
    good: 'LEGENDARY',
    bad: 'CATASTROPHIC',
    big: 'MASSIVE',
    small: 'MICROSCOPIC',
    fast: 'LIGHTNING-SPEED',
    slow: 'GLACIALLY SLOW',
    nice: 'MIND-BLOWING',
    weird: 'ABSOLUTELY BONKERS',
  };

  // Apply basic replacements
  Object.entries(basicReplacements).forEach(([from, to]) => {
    const regex = new RegExp(`\\b${from}\\b`, 'gi');
    result = result.replace(regex, to);
  });

  // Apply intense replacements if cringe level is high
  if (intense) {
    Object.entries(intenseReplacements).forEach(([from, to]) => {
      const regex = new RegExp(`\\b${from}\\b`, 'gi');
      if (rng() < 0.3) {
        // 30% chance for each replacement
        result = result.replace(regex, to);
      }
    });
  }

  return result;
}

/**
 * Inserts interjections and filler words
 */
function insertInterjections(text: string, count: number, rng: () => number): string {
  const interjections = [
    'OMG',
    'WOW',
    'LITERALLY',
    'NO CAP',
    'FR FR',
    'PERIODT',
    'SLAY',
    'BESTIE',
    'NOT ME',
    'THE WAY',
    'I CANNOT',
    'BRUH',
  ];

  let result = text;

  for (let i = 0; i < count; i++) {
    const interjection = interjections[Math.floor(rng() * interjections.length)];

    if (rng() < 0.5) {
      // Add at beginning
      result = interjection + ', ' + result;
    } else {
      // Add before punctuation
      result = result.replace(/([.!?])/, `, ${interjection}$1`);
    }
  }

  return result;
}

/**
 * Intensifies emojis by adding more or upgrading them
 */
function intensifyEmojis(text: string, level: number, rng: () => number): string {
  let result = text;

  const emojiUpgrades = {
    '😊': ['😊✨', '😊💫⭐', '😊🌟💖✨'],
    '😏': ['😏👑', '😏💅✨', '😏👑💎🔥'],
    '😈': ['😈🔥', '😈💀🔥', '😈💀🔥💥'],
    '🤡': ['🤡💥', '🤡🎪💥', '🤡🎪💥⚡🌪️'],
  };

  // Upgrade existing emojis
  Object.entries(emojiUpgrades).forEach(([basic, upgrades]) => {
    if (result.includes(basic)) {
      const upgradeIndex = Math.min(level - 1, upgrades.length - 1);
      result = result.replace(basic, upgrades[upgradeIndex]);
    }
  });

  // Add random extra emojis based on level
  const extraEmojis = ['✨', '💫', '🔥', '💎', '⚡', '💥', '🌟', '👑'];
  const emojisToAdd = Math.min(level, 3);

  for (let i = 0; i < emojisToAdd; i++) {
    if (rng() < 0.4) {
      // 40% chance per emoji
      const emoji = extraEmojis[Math.floor(rng() * extraEmojis.length)];
      result += ' ' + emoji;
    }
  }

  return result;
}
