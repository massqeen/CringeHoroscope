/**
 * Mulberry32 PRNG implementation for deterministic random generation
 * 
 * Features:
 * - High-quality pseudorandom number generation
 * - Full period of 2^32 
 * - Fast performance (~1-2 million operations/second)
 * - Deterministic output from same seed
 */
export class PRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0; // Ensure unsigned 32-bit integer
  }

  /**
   * Generate next random number between 0 and 1
   * Uses Mulberry32 algorithm for high-quality randomness
   */
  public next(): number {
    let t = this.state += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  /**
   * Generate random integer between min and max (inclusive)
   */
  public nextInt(min: number, max: number): number {
    if (min > max) throw new Error('min must be <= max');
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Choose random element from array
   */
  public choose<T>(array: T[]): T {
    if (array.length === 0) throw new Error('Array cannot be empty');
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Generate boolean with given probability (0-1)
   */
  public probability(chance: number): boolean {
    if (chance < 0 || chance > 1) throw new Error('Probability must be between 0 and 1');
    return this.next() < chance;
  }

  /**
   * Generate random float between min and max
   */
  public nextFloat(min: number = 0, max: number = 1): number {
    return min + this.next() * (max - min);
  }

  /**
   * Shuffle array in-place using Fisher-Yates algorithm
   */
  public shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Generate multiple random numbers at once
   */
  public generateSequence(count: number): number[] {
    return Array.from({ length: count }, () => this.next());
  }

  /**
   * Reset the PRNG to its initial state
   */
  public reset(seed: number): void {
    this.state = seed >>> 0;
  }

  /**
   * Get current internal state (for debugging)
   */
  public getState(): number {
    return this.state;
  }
}

/**
 * Simple function version of Mulberry32 PRNG
 * @param seed - Seed value for deterministic random generation
 * @returns Function that generates random numbers between 0 and 1
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0; // Ensure unsigned 32-bit integer
  return function() {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Generate seed from sign, date and cringe level for deterministic mode
 * Formula: hash(sign|YYYY-MM-DD|cringe) using djb2 algorithm
 * 
 * @param sign - Zodiac sign (e.g., "aries", "scorpio")  
 * @param date - Date in YYYY-MM-DD format
 * @param cringe - Cringe level (0-3)
 * @returns 32-bit positive integer seed
 */
export function generateDeterministicSeed(sign: string, date: string, cringe: number): number {
  const seedString = `${sign}|${date}|${cringe}`;
  let hash = 5381; // djb2 initial value
  
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = ((hash << 5) + hash) + char; // hash * 33 + char
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash) >>> 0; // Ensure positive unsigned 32-bit integer
}

/**
 * Generate random seed using crypto API for true randomness
 * Falls back to Math.random() if crypto is unavailable
 * 
 * @returns 32-bit positive integer seed
 */
export function generateRandomSeed(): number {
  try {
    const array = new Uint32Array(1);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
      return array[0];
    } else {
      // Fallback for environments without crypto API
      return Math.floor(Math.random() * 4294967296) >>> 0;
    }
  } catch (error) {
    // Final fallback
    return Math.floor(Math.random() * 4294967296) >>> 0;
  }
}

/**
 * Validate seed parameters for deterministic generation
 */
export function validateSeedParams(sign: string, date: string, cringe: number): boolean {
  // Validate sign
  const validSigns = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  
  if (!validSigns.includes(sign.toLowerCase())) {
    throw new Error(`Invalid zodiac sign: ${sign}`);
  }
  
  // Validate date format (basic check)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
  }
  
  // Validate cringe level
  if (!Number.isInteger(cringe) || cringe < 0 || cringe > 3) {
    throw new Error(`Invalid cringe level: ${cringe}. Expected 0-3`);
  }
  
  return true;
}

/**
 * Create seeded version of common random operations
 */
export function createSeededOperations(seed: number) {
  const rng = new PRNG(seed);
  
  return {
    random: () => rng.next(),
    randomInt: (min: number, max: number) => rng.nextInt(min, max),
    choose: <T>(array: T[]) => rng.choose(array),
    probability: (chance: number) => rng.probability(chance),
    shuffle: <T>(array: T[]) => rng.shuffle([...array]), // Non-mutating version
    gaussian: (mean: number = 0, stdDev: number = 1) => {
      // Box-Muller transform for normal distribution
      const u1 = rng.next();
      const u2 = rng.next();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return z0 * stdDev + mean;
    }
  };
}

/**
 * Compare two seeds and their generated sequences for testing
 */
export function compareSeedSequences(seed1: number, seed2: number, length: number = 10) {
  const rng1 = mulberry32(seed1);
  const rng2 = mulberry32(seed2);
  
  const seq1 = Array.from({ length }, () => rng1());
  const seq2 = Array.from({ length }, () => rng2());
  
  return {
    seed1,
    seed2,
    sequence1: seq1,
    sequence2: seq2,
    identical: JSON.stringify(seq1) === JSON.stringify(seq2),
    correlation: calculateCorrelation(seq1, seq2)
  };
}

/**
 * Calculate correlation coefficient between two sequences
 */
function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length) return 0;
  
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}
