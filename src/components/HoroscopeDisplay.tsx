import { ReactNode, useState, useEffect } from 'react';
import { useHoroscope } from '../hooks/useHoroscope';
import { generateRoast } from '../services/roastGenerator';
import { composeResult } from '../services/horoscopeComposer';
import { generateDeterministicSeed } from '../utils/prng';
import GenerateButton from './GenerateButton';
import LuckyElements from './LuckyElements';
import ExportButton from './ExportButton';
import styles from './HoroscopeDisplay.module.css';
import type { ZodiacSign, Day, Cringe, Mode, HoroscopeResult } from '../types';

interface HoroscopeDisplayProps {
  sign: ZodiacSign;
  day: Day;
  mode: Mode;
  cringe: Cringe;
  deterministic: boolean;
  onGenerate?: () => void;
  isLoading?: boolean;
}

const HoroscopeDisplay = ({
  sign,
  day,
  mode,
  cringe,
  deterministic,
  onGenerate,
  isLoading = false,
}: HoroscopeDisplayProps): ReactNode => {
  const { horoscope, loading, error, fetchHoroscope, clearHoroscope } = useHoroscope();
  const [composedResult, setComposedResult] = useState<HoroscopeResult | null>(null);

  // State to track pending generation after API call
  const [pendingGeneration, setPendingGeneration] = useState<{
    mode: Mode;
    cringe: Cringe;
    seed: number;
    roastResult: string;
  } | null>(null);

  // useEffect to complete generation when horoscope data becomes available
  useEffect(() => {
    if (horoscope && pendingGeneration) {
      console.log('🎯 Horoscope data available, completing generation...');

      try {
        // Compose final result
        let result;
        if (pendingGeneration.mode === 'roast') {
          result = composeResult({
            mode: pendingGeneration.mode,
            official: { text: '', luckyColor: undefined, luckyNumber: undefined },
            roast: { text: pendingGeneration.roastResult },
            cringe: pendingGeneration.cringe,
            seed: pendingGeneration.seed,
          });
        } else {
          result = composeResult({
            mode: pendingGeneration.mode,
            official: horoscope,
            roast: { text: pendingGeneration.roastResult },
            cringe: pendingGeneration.cringe,
            seed: pendingGeneration.seed,
          });
        }

        console.log('🎯 Final result composed:', result);
        setComposedResult(result);

        // Clear pending generation
        setPendingGeneration(null);

        // Call parent callback if provided
        if (onGenerate) {
          onGenerate();
        }
      } catch (error) {
        console.error('❌ Error composing result:', error);
        alert(
          'Error composing horoscope result: ' +
            (error instanceof Error ? error.message : 'Unknown error'),
        );
        setPendingGeneration(null);
      }
    }
  }, [horoscope, pendingGeneration, onGenerate]);

  // useEffect to clear data when sign or day changes
  useEffect(() => {
    // Clear all results when sign or day changes to force fresh data fetch
    setComposedResult(null);
    setPendingGeneration(null);
    clearHoroscope(); // Clear horoscope data from the hook
  }, [sign, day, clearHoroscope]);

  const handleGenerateResult = async (): Promise<void> => {
    const today = new Date();
    const dateString = today.toISOString().slice(0, 10);
    const seed = deterministic ? generateDeterministicSeed(sign, dateString, cringe) : Date.now();

    try {
      // Generate roast first (always needed)
      const roast = generateRoast({
        sign,
        day,
        cringe,
        seed,
      });

      console.log('🔥 Roast generated:', roast.text);

      // Handle different modes
      if (mode === 'roast') {
        // For roast mode, compose immediately (no API call needed)
        const result = composeResult({
          mode,
          official: { text: '', luckyColor: undefined, luckyNumber: undefined },
          roast,
          cringe,
          seed,
        });

        console.log('🎯 Final result composed (roast only):', result);
        setComposedResult(result);

        if (onGenerate) {
          onGenerate();
        }
      } else {
        // For official or mix modes, we need official data
        if (!horoscope) {
          console.log('🔍 Fetching official data for', mode, 'mode...');

          // Set pending generation state
          setPendingGeneration({
            mode,
            cringe,
            seed,
            roastResult: roast.text,
          });

          // Fetch horoscope data (useEffect will complete the generation)
          await fetchHoroscope(sign, day);
        } else {
          // We already have horoscope data, compose immediately
          const result = composeResult({
            mode,
            official: horoscope,
            roast,
            cringe,
            seed,
          });

          console.log('🎯 Final result composed (with existing data):', result);
          setComposedResult(result);

          if (onGenerate) {
            onGenerate();
          }
        }
      }
    } catch (error) {
      console.error('❌ Error generating result:', error);
      alert(
        'Error generating horoscope result: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
      setPendingGeneration(null);
    }
  };

  return (
    <div className="horoscope-display">
      <GenerateButton
        onGenerate={handleGenerateResult}
        isLoading={loading || isLoading}
        disabled={false}
      />

      {/* Error Display */}
      {error && (
        <div className={styles.errorDisplay}>
          <strong>❌ Oops!</strong> {error}
        </div>
      )}

      {/* Final Composed Result - Production Style */}
      {composedResult && (
        <>
          <div id="horoscope-export-content" className={styles.horoscopeResultContainer}>
            {/* Main horoscope content */}
            <div className={styles.horoscopeMainCard}>
              {/* Decorative background elements */}
              <div className={styles.horoscopeDecoration1}></div>
              <div className={styles.horoscopeDecoration2}></div>

              <div className={styles.horoscopeTextContainer}>
                <p className={styles.horoscopeTextContent}>{composedResult.text}</p>
              </div>
            </div>

            <LuckyElements
              luckyColor={composedResult.luckyColor}
              luckyNumber={composedResult.luckyNumber}
            />
          </div>

          {/* Export Button - Outside the export content area */}
          <div className={styles.exportButtonContainer}>
            <ExportButton targetElementId="horoscope-export-content" filename="cringe-horoscope" />
          </div>
        </>
      )}
    </div>
  );
};

export default HoroscopeDisplay;
