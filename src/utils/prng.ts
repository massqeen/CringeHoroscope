/**
 * Mulberry32 PRNG implementation for deterministic random generation
 */
export class PRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  /**
   * Generate next random number between 0 and 1
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
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Choose random element from array
   */
  public choose<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Generate boolean with given probability (0-1)
   */
  public probability(chance: number): boolean {
    return this.next() < chance;
  }
}

/**
 * Simple function version of Mulberry32 PRNG
 * @param seed - Seed value for deterministic random generation
 * @returns Function that generates random numbers between 0 and 1
 */
export function mulberry32(seed: number): () => number {
  let a = seed;
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
 */
export function generateDeterministicSeed(sign: string, date: string, cringe: number): number {
  const seedString = `${sign}|${date}|${cringe}`;
  let hash = 0;
  
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash);
}

/**
 * Generate random seed using crypto API
 */
export function generateRandomSeed(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0];
}
