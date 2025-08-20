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
  // Different base messages for different days
  const fallbackDataByDay: Record<Day, Record<ZodiacSign, string>> = {
    yesterday: {
      aries: "Yesterday's bold moves set the stage for future success. Your courage opened doors that were previously closed.",
      taurus: "The patience you showed yesterday has planted seeds that will bloom soon. Your steady approach paid off.",
      gemini: "Yesterday's conversations created lasting connections. Your words had more impact than you realized.",
      cancer: "The emotional insights you gained yesterday will guide your relationships moving forward.",
      leo: "Your leadership yesterday inspired others in ways you may not have noticed. The ripple effects continue.",
      virgo: "The details you attended to yesterday prevented bigger problems today. Your diligence was worthwhile.",
      libra: "The balance you sought yesterday brought harmony to your surroundings. Peace was your gift to others.",
      scorpio: "Yesterday's transformation deepened your understanding of yourself. The change was necessary and powerful.",
      sagittarius: "The adventure you embraced yesterday expanded your horizons in unexpected ways.",
      capricorn: "Yesterday's hard work laid a solid foundation for the challenges ahead. Your effort was an investment.",
      aquarius: "The innovative thinking you displayed yesterday sparked new possibilities for the future.",
      pisces: "Yesterday's creative expressions touched hearts and opened minds. Your imagination was a healing force."
    },
    today: {
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
    },
    tomorrow: {
      aries: "Tomorrow brings opportunities for leadership that will test your courage. Prepare to step into your power.",
      taurus: "A steady approach tomorrow will yield results that surprise even you. Trust in your methodical nature.",
      gemini: "Tomorrow's conversations will open doors to new possibilities. Your words will carry special weight.",
      cancer: "Emotional clarity awaits you tomorrow. Trust the feelings that guide you toward meaningful connections.",
      leo: "Tomorrow you'll shine in ways that inspire others to find their own light. Your presence will be a gift.",
      virgo: "The attention to detail you bring tomorrow will solve a puzzle that has long confused others.",
      libra: "Tomorrow brings a chance to create harmony where there has been discord. Your diplomatic skills are needed.",
      scorpio: "A powerful transformation begins tomorrow. Embrace the changes that will ultimately strengthen you.",
      sagittarius: "Tomorrow's journey will take you further than you expect. Pack light but bring your curiosity.",
      capricorn: "Tomorrow's challenges require the discipline you've been building. Your preparation will pay off.",
      aquarius: "Tomorrow brings a breakthrough that changes your perspective. Your innovative mind will see the way forward.",
      pisces: "Tomorrow your intuition will guide you to exactly where you need to be. Trust the flow of events."
    }
  };

  // Different color sets for different days
  const colorsByDay: Record<Day, string[]> = {
    yesterday: ['slate gray', 'bronze', 'mahogany', 'navy', 'purple'],
    today: ['blue', 'red', 'green', 'purple', 'orange', 'pink', 'yellow', 'indigo'],
    tomorrow: ['gold', 'amber', 'jade-green', 'amethyst', 'lavender', 'sea green']
  };

  // Different lucky number ranges for different days
  const numbersByDay: Record<Day, number[]> = {
    yesterday: [1, 3, 5, 7, 9, 11, 13],
    today: [1, 3, 7, 9, 11, 13, 17, 21, 23, 27],
    tomorrow: [8, 12, 16, 18, 22, 24, 28, 30, 33, 36]
  };

  const colors = colorsByDay[day];
  const numbers = numbersByDay[day];

  return {
    text: fallbackDataByDay[day][sign],
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


