import { useState, useCallback } from 'react';
import { getOfficial } from '../services/aztroApi';
import type { ZodiacSign, Day, OfficialHoroscope } from '../types';

interface UseHoroscopeReturn {
  horoscope: OfficialHoroscope | null;
  loading: boolean;
  error: string | null;
  fetchHoroscope: (sign: ZodiacSign, day: Day) => Promise<void>;
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
      setHoroscope(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch horoscope');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    horoscope,
    loading,
    error,
    fetchHoroscope,
  };
}
