export type Cringe = 0 | 1 | 2 | 3;
export type Mode = "official" | "roast" | "mix";
export type Day = "today" | "tomorrow";
export type ZodiacSign = 
  | "aries" 
  | "taurus" 
  | "gemini" 
  | "cancer" 
  | "leo" 
  | "virgo" 
  | "libra" 
  | "scorpio" 
  | "sagittarius" 
  | "capricorn" 
  | "aquarius" 
  | "pisces";

export interface Options {
  sign: ZodiacSign;
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
  luckyColor?: string;
  luckyNumber?: number;
  source: "official" | "roast" | "mix";
}
