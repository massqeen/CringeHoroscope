import { useState, useCallback } from 'react';
import { getOfficial } from '../services/aztroApi';
import type { ZodiacSign, Day, OfficialHoroscope } from '../types';

interface UseHoroscopeReturn {
  horoscope: OfficialHoroscope | null;
  loading: boolean;
  error: string | null;
  fetchHoroscope: (sign: ZodiacSign, day: Day) => Promise<void>;
  clearHoroscope: () => void;
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

export function useHoroscope(): UseHoroscopeReturn {
  const [horoscope, setHoroscope] = useState<OfficialHoroscope | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHoroscope = useCallback(async (sign: ZodiacSign, day: Day) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getOfficial(sign, day);
      const item = data[0];
      console.log('✅ Official data fetched:', data);
      const officialHoroscope: OfficialHoroscope = {
        text: item.description,
        luckyColor: item.color,
        luckyNumber: item?.lucky_number ?? 0,
      };
      setHoroscope(officialHoroscope);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch horoscope');
      setHoroscope(getFallbackHoroscope(sign, day));
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHoroscope = useCallback(() => {
    setHoroscope(null);
    setError(null);
  }, []);

  return {
    horoscope,
    loading,
    error,
    fetchHoroscope,
    clearHoroscope,
  };
}


