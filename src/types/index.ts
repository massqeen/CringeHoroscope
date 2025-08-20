// Core types for Cringe Horoscope application
export type Cringe = 0 | 1 | 2 | 3;
export type Mode = "official" | "roast" | "mix";
export type Day = "today" | "tomorrow";

export interface Options {
  sign: string;
  day: Day;
  mode: Mode;
  cringe: Cringe;
  deterministic: boolean;
  seed?: number;
}

export interface OfficialHoroscope {
  text: string;
  luckyColor?: string;
  luckyNumber?: number;
}

export interface RoastHoroscope {
  text: string;
}

export interface HoroscopeResult {
  text: string;
  source: "official" | "roast" | "mix";
  luckyColor?: string;
  luckyNumber?: number;
}

export const ZODIAC_SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
] as const;

export type ZodiacSign = typeof ZODIAC_SIGNS[number];

export const CRINGE_LABELS = {
  0: "Gentle",
  1: "Ironic", 
  2: "Sarcastic",
  3: "Cringe Hard"
} as const;
