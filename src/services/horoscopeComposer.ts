import type { Mode, Cringe, HoroscopeResult, OfficialHoroscope, RoastHoroscope } from '../types';
import { normalizeOfficial } from './aztroApi';

interface ComposeResultOptions {
  mode: Mode;
  official: OfficialHoroscope;
  roast: RoastHoroscope;
  cringe: Cringe;
  seed: number;
}

/**
 * Applies cringe-level transforms to official horoscope text
 */
function applyCringeTransforms(text: string, cringe: Cringe, seed: number): string {
  if (cringe === 0) return text; // No transforms for level 0
  
  let result = text;
  const rng = createSimpleRng(seed);
  
  switch (cringe) {
    case 1: // Ironic - subtle but noticeable changes
      // 60% chance to add mild interjections
      if (rng() < 0.6) {
        result = insertMildInterjections(result, rng);
      }
      // 50% chance for slight emphasis
      if (rng() < 0.5) {
        result = addMildEmphasis(result, rng);
      }
      // 30% chance for casual replacements
      if (rng() < 0.3) {
        result = addCasualReplacements(result, rng);
      }
      break;
      
    case 2: // Sarcastic - clearly noticeable changes
      // 80% chance to elongate vowels in 1-2 words
      if (rng() < 0.8) {
        result = elongateVowels(result, 1 + Math.floor(rng() * 2), rng);
      }
      // 70% chance for interjections
      if (rng() < 0.7) {
        result = insertInterjections(result, 1 + Math.floor(rng() * 2), rng);
      }
      // Always add emphasis
      result = addMildEmphasis(result, rng);
      // 60% chance for sarcastic replacements
      if (rng() < 0.6) {
        result = addSarcasticReplacements(result, rng);
      }
      // 40% chance for emoji additions
      if (rng() < 0.4) {
        result = addSarcasticEmojis(result, rng);
      }
      break;
      
    case 3: // Cringe Hard - VERY obvious changes
      // 90% chance for alternating caps in 2-3 words
      if (rng() < 0.9) {
        result = applyAlternatingCaps(result, 2 + Math.floor(rng() * 2), rng);
      }
      // 85% chance to elongate vowels in 2-3 words
      if (rng() < 0.85) {
        result = elongateVowels(result, 2 + Math.floor(rng() * 2), rng);
      }
      // Always add maximum hyperbole
      result = addHyperbole(result, rng);
      // 80% chance for multiple interjections
      if (rng() < 0.8) {
        result = insertInterjections(result, 2 + Math.floor(rng() * 2), rng);
      }
      // 70% chance for cringe emojis
      if (rng() < 0.7) {
        result = addCringeEmojis(result, rng);
      }
      // 60% chance for ALL CAPS words
      if (rng() < 0.6) {
        result = addRandomCaps(result, 1 + Math.floor(rng() * 2), rng);
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
        char.match(/[a-zA-Z]/) 
          ? (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
          : char
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
      const elongationLength = 4 + Math.floor(rng() * 3); // 4-6 repetitions for more obvious effect
      
      words[randomIndex] = word.slice(0, vowelIndex + 1) + 
                          randomVowel[0].repeat(elongationLength - 1) + 
                          word.slice(vowelIndex + 1);
    }
  }
  
  return words.join(' ');
}

/**
 * Adds mild emphasis to text
 */
function addMildEmphasis(text: string, rng: () => number): string {
  const emphasisWords = ['really', 'truly', 'definitely', 'absolutely', 'totally'];
  const words = text.split(' ');
  
  // 30% chance to add emphasis word
  if (rng() < 0.3 && words.length > 3) {
    const emphasisWord = emphasisWords[Math.floor(rng() * emphasisWords.length)];
    const insertIndex = 1 + Math.floor(rng() * (words.length - 2));
    words.splice(insertIndex, 0, emphasisWord);
  }
  
  return words.join(' ');
}

/**
 * Adds hyperbolic language replacements
 */
function addHyperbole(text: string, rng: () => number): string {
  let result = text;
  
  const replacements = {
    'very': 'EXTREMELY',
    'really': 'ABSOLUTELY', 
    'quite': 'INCREDIBLY',
    'pretty': 'RIDICULOUSLY',
    'good': 'AMAZING',
    'bad': 'TERRIBLE',
    'big': 'HUGE',
    'small': 'TINY',
    'nice': 'FANTASTIC',
    'great': 'PHENOMENAL',
    'okay': 'MIND-BLOWING',
    'fine': 'SPECTACULAR'
  };
  
  for (const [original, replacement] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${original}\\b`, 'gi');
    if (rng() < 0.5 && regex.test(result)) { // 50% chance to replace
      result = result.replace(regex, replacement);
      break; // Only replace one word to avoid over-transformation
    }
  }
  
  return result;
}

/**
 * Adds casual replacements for level 1
 */
function addCasualReplacements(text: string, rng: () => number): string {
  let result = text;
  
  const casualReplacements = {
    'you will': 'you\'ll',
    'you are': 'you\'re',
    'it is': 'it\'s',
    'will be': '\'ll be',
    'should': 'should probably',
    'may': 'might',
    'perhaps': 'maybe'
  };
  
  for (const [original, replacement] of Object.entries(casualReplacements)) {
    const regex = new RegExp(`\\b${original}\\b`, 'gi');
    if (rng() < 0.4 && regex.test(result)) {
      result = result.replace(regex, replacement);
      break;
    }
  }
  
  return result;
}

/**
 * Adds sarcastic replacements for level 2
 */
function addSarcasticReplacements(text: string, rng: () => number): string {
  let result = text;
  
  const sarcasticReplacements = {
    'wonderful': 'absolutely wonderful',
    'perfect': 'totally perfect',
    'great': 'oh-so-great',
    'amazing': 'super amazing',
    'excellent': 'just excellent',
    'beautiful': 'perfectly beautiful',
    'successful': 'wildly successful'
  };
  
  for (const [original, replacement] of Object.entries(sarcasticReplacements)) {
    const regex = new RegExp(`\\b${original}\\b`, 'gi');
    if (rng() < 0.6 && regex.test(result)) {
      result = result.replace(regex, replacement);
      break;
    }
  }
  
  return result;
}

/**
 * Adds sarcastic emojis for level 2
 */
function addSarcasticEmojis(text: string, rng: () => number): string {
  const emojis = ['😏', '🙄', '😌', '✨', '💫'];
  const emoji = emojis[Math.floor(rng() * emojis.length)];
  
  // Add emoji at the end
  return text + ' ' + emoji;
}

/**
 * Adds cringe emojis for level 3
 */
function addCringeEmojis(text: string, rng: () => number): string {
  const cringeEmojis = ['💅', '✨', '💫', '🔥', '💯', '😍', '🤩', '👑', '💎'];
  const numEmojis = 1 + Math.floor(rng() * 2); // 1-2 emojis
  
  let result = text;
  for (let i = 0; i < numEmojis; i++) {
    const emoji = cringeEmojis[Math.floor(rng() * cringeEmojis.length)];
    result += ' ' + emoji;
  }
  
  return result;
}

/**
 * Makes random words ALL CAPS for level 3
 */
function addRandomCaps(text: string, wordCount: number, rng: () => number): string {
  const words = text.split(' ');
  const wordsToTransform = Math.min(wordCount, words.length);
  
  for (let i = 0; i < wordsToTransform; i++) {
    const randomIndex = Math.floor(rng() * words.length);
    const word = words[randomIndex];
    
    // Skip if word is too short, already caps, or has punctuation
    if (word.length < 3 || word === word.toUpperCase() || /[^a-zA-Z]/.test(word)) continue;
    
    words[randomIndex] = word.toUpperCase();
  }
  
  return words.join(' ');
}

/**
 * Inserts mild interjections
 */
function insertMildInterjections(text: string, rng: () => number): string {
  const interjections = ['honestly', 'seriously', 'clearly', 'obviously'];
  const sentences = text.split(/([.!?]+)/);
  
  if (sentences.length > 1 && rng() < 0.5) {
    const interjection = interjections[Math.floor(rng() * interjections.length)];
    sentences.splice(1, 0, ` ${interjection},`);
  }
  
  return sentences.join('');
}

/**
 * Inserts stronger interjections
 */
function insertInterjections(text: string, maxCount: number, rng: () => number): string {
  const interjections = ['tbh', 'ngl', 'fr fr', 'periodt', 'no cap', 'bestie', 'sis', 'facts', 'tea'];
  const sentences = text.split(/([.!?]+)/);
  
  for (let i = 0; i < maxCount && sentences.length > 1; i++) {
    if (rng() < 0.8) { // Increased chance from 0.6 to 0.8
      const interjection = interjections[Math.floor(rng() * interjections.length)];
      const insertIndex = 1 + Math.floor(rng() * (sentences.length - 1));
      sentences.splice(insertIndex, 0, ` ${interjection},`);
    }
  }
  
  return sentences.join('');
}

interface ComposeResultOptions {
  mode: Mode;
  official: OfficialHoroscope;
  roast: RoastHoroscope;
  cringe: Cringe;
  seed: number;
}

/**
 * Composes final horoscope result based on mode
 * @param options - Composition options
 * @returns Final horoscope result
 */
export function composeResult(options: ComposeResultOptions): HoroscopeResult {
  const { mode, official, roast, cringe, seed } = options;
  
  switch (mode) {
    case 'official':
      // Apply cringe transforms to official text
      const transformedText = applyCringeTransforms(official.text, cringe, seed);
      return {
        text: transformedText,
        luckyColor: official.luckyColor,
        luckyNumber: official.luckyNumber,
        source: 'official'
      };
      
    case 'roast':
      return {
        text: roast.text,
        source: 'roast'
      };
      
    case 'mix':
      return composeMixedResult(official, roast, cringe, options.seed);
      
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}

/**
 * Creates a mixed result combining official and roast content
 */
function composeMixedResult(
  official: OfficialHoroscope, 
  roast: RoastHoroscope, 
  cringe: Cringe,
  seed: number
): HoroscopeResult {
  // Apply cringe transforms to official text before mixing (limit to max level 2 for mix mode)
  const mixCringe = Math.min(cringe, 2) as Cringe;
  const transformedOfficialText = applyCringeTransforms(official.text, mixCringe, seed);
  
  // Normalize both texts into sentences
  const officialSentences = normalizeOfficial(transformedOfficialText);
  const roastSentences = normalizeOfficial(roast.text);
  
  // Use seed for deterministic mixing
  const rng = createSimpleRng(seed + 1); // Use different seed for mixing
  
  // Take 1-2 sentences from official
  const numOfficialSentences = Math.min(
    officialSentences.length,
    1 + Math.floor(rng() * 2) // 1 or 2 sentences
  );
  
  // Take 1-2 sentences from roast
  const numRoastSentences = Math.min(
    roastSentences.length,
    1 + Math.floor(rng() * 2) // 1 or 2 sentences
  );
  
  // Select sentences
  const selectedOfficial = officialSentences.slice(0, numOfficialSentences);
  const selectedRoast = roastSentences.slice(0, numRoastSentences);
  
  // Decide mixing order (50/50 chance to start with official or roast)
  let mixedSentences: string[];
  if (rng() < 0.5) {
    // Start with official
    mixedSentences = [...selectedOfficial, ...selectedRoast];
  } else {
    // Start with roast
    mixedSentences = [...selectedRoast, ...selectedOfficial];
  }
  
  // For cringe level 2+, add a short punchline
  if (cringe >= 2) {
    const punchlines = [
      "Just saying.",
      "You're welcome.",
      "Deal with it.",
      "That's the tea.",
      "No cap."
    ];
    
    if (cringe === 3) {
      // More intense punchlines for level 3
      const intensePunchlines = [
        "PERIOD.",
        "FACTS ONLY.",
        "THAT'S IT. THAT'S THE TWEET.",
        "MAIN CHARACTER ENERGY.",
        "ICONIC BEHAVIOR."
      ];
      const punchline = intensePunchlines[Math.floor(rng() * intensePunchlines.length)];
      mixedSentences.push(punchline);
    } else {
      const punchline = punchlines[Math.floor(rng() * punchlines.length)];
      mixedSentences.push(punchline);
    }
  }
  
  // Join sentences with proper spacing
  const finalText = mixedSentences
    .filter(sentence => sentence.trim().length > 0)
    .join(' ');
  
  return {
    text: finalText,
    luckyColor: official.luckyColor,
    luckyNumber: official.luckyNumber,
    source: 'mix'
  };
}

/**
 * Simple RNG for deterministic mixing
 */
function createSimpleRng(seed: number): () => number {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

/**
 * Gets a readable description of the composition mode
 */
export function getModeDescription(mode: Mode): string {
  switch (mode) {
    case 'official':
      return 'Official horoscope with cringe-level transforms';
    case 'roast':
      return 'Generated roast horoscope';
    case 'mix':
      return 'Mixed: Transformed official + Roast combination';
    default:
      return 'Unknown mode';
  }
}

/**
 * Gets statistics about the composition
 */
export function getCompositionStats(result: HoroscopeResult): {
  sentenceCount: number;
  wordCount: number;
  hasLuckyInfo: boolean;
} {
  const sentences = result.text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = result.text.split(/\s+/).filter(w => w.trim().length > 0);
  
  return {
    sentenceCount: sentences.length,
    wordCount: words.length,
    hasLuckyInfo: !!(result.luckyColor || result.luckyNumber)
  };
}
