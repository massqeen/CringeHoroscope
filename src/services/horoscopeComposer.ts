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
 * Composes final horoscope result based on mode
 * @param options - Composition options
 * @returns Final horoscope result
 */
export function composeResult(options: ComposeResultOptions): HoroscopeResult {
  const { mode, official, roast, cringe } = options;
  
  switch (mode) {
    case 'official':
      return {
        text: official.text,
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
  // Normalize official text into sentences
  const officialSentences = normalizeOfficial(official.text);
  const roastSentences = normalizeOfficial(roast.text);
  
  // Use seed for deterministic mixing
  const rng = createSimpleRng(seed);
  
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
      return 'Official horoscope from Aztro API';
    case 'roast':
      return 'Generated roast horoscope';
    case 'mix':
      return 'Mixed: Official + Roast combination';
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
