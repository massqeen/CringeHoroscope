import axios from 'axios';

import type { ZodiacSign, Day, HoroscopeResponse } from '../types';

// Aztro API endpoint
const AZTRO_API_URL = 'https://api.aistrology.beandev.xyz/v1';

export async function getOfficial(
  sign: ZodiacSign, 
  day: Day
): Promise<HoroscopeResponse> {
  const response = await axios.post<HoroscopeResponse>(
      `${AZTRO_API_URL}?sign=${sign}&day=${day}`,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    return response.data;
}


/**
 * Normalizes official horoscope text by splitting into sentences
 */
export function normalizeOfficial(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0)
    .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1));
}
