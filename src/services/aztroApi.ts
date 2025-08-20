import axios from 'axios';
import type { ZodiacSign, Day, OfficialHoroscope } from '../types';

// Aztro API endpoint
const AZTRO_API_URL = 'https://aztro.sameerkumar.website/';

// Interface for Aztro API response
interface AztroResponse {
  date_range: string;
  current_date: string;
  description: string;
  compatibility: string;
  mood: string;
  color: string;
  lucky_number: string;
  lucky_time: string;
}

/**
 * Fetches horoscope data from Aztro API
 * @param sign - Zodiac sign
 * @param day - "today" or "tomorrow"
 * @returns Promise with horoscope data
 */
export async function getOfficial(
  sign: ZodiacSign, 
  day: Day
): Promise<OfficialHoroscope> {
  try {
    const response = await axios.post<AztroResponse>(
      `${AZTRO_API_URL}?sign=${sign}&day=${day}`,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    const data = response.data;
    
    return {
      text: data.description,
      luckyColor: data.color,
      luckyNumber: parseInt(data.lucky_number, 10) || undefined,
    };
  } catch (error) {
    console.error('Error fetching from Aztro API:', error);
    
    // Return fallback data if API fails
    return getFallbackHoroscope(sign, day);
  }
}

/**
 * Fallback horoscope data when API is unavailable
 */
function getFallbackHoroscope(sign: ZodiacSign, day: Day): OfficialHoroscope {
  const fallbackData: Record<ZodiacSign, string> = {
    aries: "Your fiery energy will guide you through today's challenges. Take bold action but remember to think before you leap.",
    taurus: "Stability and patience will be your allies today. Trust in your practical nature to make the right decisions.",
    gemini: "Communication is key today. Your versatility will help you adapt to changing circumstances with ease.",
    cancer: "Trust your intuition and nurture the relationships that matter most to you. Home brings comfort today.",
    leo: "Your natural leadership shines bright today. Share your generous spirit with others and watch magic happen.",
    virgo: "Attention to detail will serve you well today. Your analytical mind sees solutions others might miss.",
    libra: "Balance and harmony guide your path today. Your diplomatic nature helps resolve conflicts around you.",
    scorpio: "Deep transformation awaits you today. Trust your instincts and embrace the power of change.",
    sagittarius: "Adventure calls to your spirit today. Your optimism and wisdom will inspire those around you.",
    capricorn: "Discipline and determination lead you to success today. Your ambitious nature pays dividends.",
    aquarius: "Innovation and independence mark your day. Your unique perspective brings fresh solutions to old problems.",
    pisces: "Creativity and compassion flow through you today. Trust your dreams and let your imagination soar."
  };

  const colors = ['blue', 'red', 'green', 'purple', 'orange', 'pink', 'yellow', 'indigo'];
  const numbers = [1, 3, 7, 9, 11, 13, 17, 21, 23, 27];

  return {
    text: fallbackData[sign],
    luckyColor: colors[Math.floor(Math.random() * colors.length)],
    luckyNumber: numbers[Math.floor(Math.random() * numbers.length)],
  };
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
