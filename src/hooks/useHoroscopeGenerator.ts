import { useState, useCallback } from 'react';

import { ZodiacSign, Day, Mode, Cringe, Options, HoroscopeResult } from '../types';

export function useHoroscopeGenerator() {
  const [sign, setSign] = useState<ZodiacSign>('aries');
  const [day, setDay] = useState<Day>('today');
  const [mode, setMode] = useState<Mode>('official');
  const [cringe, setCringe] = useState<Cringe>(0);
  const [deterministic, setDeterministic] = useState<boolean>(false);
  const [result, setResult] = useState<HoroscopeResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Generate random seed for non-deterministic mode
  const generateRandomSeed = useCallback((): number => {
    return Math.floor(Math.random() * 1000000);
  }, []);

  // Generate deterministic seed based on sign, date, and cringe level
  const generateDeterministicSeed = useCallback(
    (options: Options): number => {
      const date = new Date();
      let dateString: string;

      switch (day) {
        case 'yesterday':
          dateString = new Date(date.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case 'tomorrow':
          dateString = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case 'today':
        default:
          dateString = date.toISOString().split('T')[0];
          break;
      }

      const seedString = `${options.sign}|${dateString}|${options.cringe}`;

      // Simple hash function to convert string to number
      let hash = 0;
      for (let i = 0; i < seedString.length; i++) {
        const char = seedString.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
      }

      return Math.abs(hash);
    },
    [day],
  );

  // Mock function for getting official horoscope (placeholder)
  const getOfficialHoroscope = useCallback(async (sign: string, day: Day) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock response - in real implementation this would call Aztro API
    // Using day parameter to vary the response
    const dayModifier = day === 'today' ? 'today' : day === 'tomorrow' ? 'tomorrow' : 'yesterday';
    return {
      text: `The stars align in your favor ${dayModifier}, ${sign}. Expect positive energy and new opportunities.`,
      luckyColor: '#10b981',
      luckyNumber: Math.floor(Math.random() * 99) + 1,
    };
  }, []);

  // Mock function for generating roast horoscope (placeholder)
  const generateRoastHoroscope = useCallback((options: Options & { seed: number }) => {
    const roastLevels = {
      0: `${options.sign}, today you'll feel as balanced as a yoga instructor on a tightrope. Spoiler: it's wobbly.`,
      1: `Oh ${options.sign}, the universe has plans for you today. Too bad it didn't consult your calendar first.`,
      2: `${options.sign}, today's forecast: 99% chance of overthinking with scattered periods of self-doubt.`,
      3: `Listen up ${options.sign}, the cosmos called - they want their drama back. You're hogging all of it.`,
    };

    return {
      text: roastLevels[options.cringe],
    };
  }, []);

  // Compose final result based on mode
  const composeResult = useCallback(
    (
      mode: Mode,
      official: string,
      roast: string,
      cringe: Cringe,
      luckyColor?: string,
      luckyNumber?: number,
    ): HoroscopeResult => {
      let text: string;
      let source: 'official' | 'roast' | 'mix';

      switch (mode) {
        case 'official': {
          text = official;
          source = 'official';
          break;
        }
        case 'roast': {
          text = roast;
          source = 'roast';
          break;
        }
        case 'mix': {
          // For mix mode, combine official and roast
          const officialSentences = official.split('.').filter((s) => s.trim());
          const roastSentences = roast.split('.').filter((s) => s.trim());

          text = `${officialSentences[0]?.trim()}. ${roastSentences[0]?.trim()}.`;

          // Add punchline for higher cringe levels
          if (cringe >= 2) {
            text += ` The stars are laughing. 🌟`;
          }

          source = 'mix';
          break;
        }
      }

      return {
        text,
        source,
        luckyColor,
        luckyNumber,
      };
    },
    [],
  );

  // Main generate function
  const generateHoroscope = useCallback(async () => {
    setIsLoading(true);

    try {
      const options: Options = {
        sign,
        day,
        mode,
        cringe,
        deterministic,
      };

      // Generate or use seed
      const seed = deterministic ? generateDeterministicSeed(options) : generateRandomSeed();

      options.seed = seed;

      // Get official horoscope
      const official = await getOfficialHoroscope(sign, day);

      // Generate roast horoscope
      const roast = generateRoastHoroscope({ ...options, seed });

      // Compose final result
      const composedResult = composeResult(
        mode,
        official.text,
        roast.text,
        cringe,
        official.luckyColor,
        official.luckyNumber,
      );

      setResult(composedResult);
    } catch (error) {
      console.error('Error generating horoscope:', error);
      setResult({
        text: 'The stars are having technical difficulties. Please try again later. 🛠️',
        source: 'official',
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    sign,
    day,
    mode,
    cringe,
    deterministic,
    generateDeterministicSeed,
    generateRandomSeed,
    getOfficialHoroscope,
    generateRoastHoroscope,
    composeResult,
  ]);

  // Refresh functions for partial updates
  const refreshEmoji = useCallback(() => {
    if (!result) return;

    const emojis = ['✨', '🌟', '⭐', '🔮', '🌙', '☀️', '🎭', '🎪', '🎨', '💫'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    setResult((prev) => {
      if (!prev) return null;

      // Replace any existing emoji with new random emoji
      let newText = prev.text;
      emojis.forEach((emoji) => {
        newText = newText.replace(new RegExp(emoji, 'g'), randomEmoji);
      });

      return {
        ...prev,
        text: newText,
      };
    });
  }, [result]);

  const refreshAdvice = useCallback(() => {
    // Placeholder for refreshing advice portion
    if (!result) return;

    const advices = [
      'Trust your instincts',
      'Embrace the chaos',
      'Question everything',
      'Dance like nobody is watching',
      'Breathe and let go',
    ];

    const randomAdvice = advices[Math.floor(Math.random() * advices.length)];

    setResult((prev) =>
      prev
        ? {
            ...prev,
            text: prev.text + ` Remember: ${randomAdvice}.`,
          }
        : null,
    );
  }, [result]);

  const refreshColor = useCallback(() => {
    if (!result) return;

    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setResult((prev) =>
      prev
        ? {
            ...prev,
            luckyColor: randomColor,
          }
        : null,
    );
  }, [result]);

  const exportImage = useCallback(() => {
    // Placeholder for image export functionality
    console.log('Exporting image...', result);
    alert('Image export feature coming soon! 📸');
  }, [result]);

  return {
    // State
    sign,
    day,
    mode,
    cringe,
    deterministic,
    result,
    isLoading,

    // Actions
    setSign,
    setDay,
    setMode,
    setCringe,
    setDeterministic,
    generateHoroscope,
    refreshEmoji,
    refreshAdvice,
    refreshColor,
    exportImage,
  };
}
