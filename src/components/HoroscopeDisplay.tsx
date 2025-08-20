import { ReactNode, useState, useEffect } from 'react';
import { useHoroscope } from '../hooks/useHoroscope';
import { getOfficial } from '../services/aztroApi';
import { generateRoast, getCringeMapping } from '../services/roastGenerator';
import { composeResult, getModeDescription } from '../services/horoscopeComposer';
import { generateDeterministicSeed } from '../utils/prng';
import CringeSlider from './CringeSlider';
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
  isLoading = false 
}: HoroscopeDisplayProps): ReactNode => {
  const { horoscope, loading, error, fetchHoroscope } = useHoroscope();
  const [roastResult, setRoastResult] = useState<string | null>(null);
  const [composedResult, setComposedResult] = useState<HoroscopeResult | null>(null);
  const [lastApiCall, setLastApiCall] = useState<{ timestamp: string; mode: string } | null>(null);
  
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
            seed: pendingGeneration.seed
          });
        } else {
          result = composeResult({
            mode: pendingGeneration.mode,
            official: horoscope,
            roast: { text: pendingGeneration.roastResult },
            cringe: pendingGeneration.cringe,
            seed: pendingGeneration.seed
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
        alert('Error composing horoscope result: ' + (error instanceof Error ? error.message : 'Unknown error'));
        setPendingGeneration(null);
      }
    }
  }, [horoscope, pendingGeneration, onGenerate]);

  // Helper functions for cringe level display
  const getCringeLabel = (level: Cringe): string => {
    switch (level) {
      case 0: return 'Mild';
      case 1: return 'Ironic';
      case 2: return 'Sarcastic';
      case 3: return 'Cringe Hard';
      default: return 'Unknown';
    }
  };

  const getCringeColor = (level: Cringe): string => {
    switch (level) {
      case 0: return '#28a745'; // Green
      case 1: return '#ffc107'; // Yellow
      case 2: return '#fd7e14'; // Orange
      case 3: return '#dc3545'; // Red
      default: return '#6c757d';
    }
  };

  const getCringeEmoji = (level: Cringe): string => {
    switch (level) {
      case 0: return '😊';
      case 1: return '😏';
      case 2: return '😈';
      case 3: return '🤡';
      default: return '🤔';
    }
  };

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
        seed
      });
      
      console.log('🔥 Roast generated:', roast.text);
      setRoastResult(roast.text);
      
      // Handle different modes
      if (mode === 'roast') {
        // For roast mode, compose immediately (no API call needed)
        const result = composeResult({
          mode,
          official: { text: '', luckyColor: undefined, luckyNumber: undefined },
          roast,
          cringe,
          seed
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
          const timestamp = new Date().toLocaleTimeString();
          setLastApiCall({ timestamp, mode });
          
          // Set pending generation state
          setPendingGeneration({
            mode,
            cringe,
            seed,
            roastResult: roast.text
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
            seed
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
      alert('Error generating horoscope result: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setPendingGeneration(null);
    }
  };

  return (
    <div className="horoscope-display">
      {/* Mode Description */}
      <div style={{ 
        marginBottom: '15px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
          🎯 Current Settings: {getModeDescription(mode)}
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <strong>Sign:</strong> {sign.charAt(0).toUpperCase() + sign.slice(1)} • 
          <strong> Day:</strong> {day} • 
          <strong> Cringe:</strong> {cringe} ({getCringeLabel(cringe)}) • 
          <strong> Mode:</strong> {deterministic ? 'Deterministic' : 'Random'}
        </div>
        <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
          {mode === 'official' && '• Will fetch fresh data from Aztro API'}
          {mode === 'roast' && '• Will generate roast content locally (no API call)'}
          {mode === 'mix' && '• Will fetch Aztro API data + generate roast, then mix them'}
        </div>
      </div>

      {/* Generate Button */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={handleGenerateResult}
          disabled={loading || isLoading}
          className="button button-primary w-full text-lg py-4"
          style={{ 
            padding: '15px 30px', 
            fontSize: '18px',
            fontWeight: 'bold',
            minWidth: '200px'
          }}
        >
          {(loading || isLoading) ? (
            <>
              <span className="loading"></span>
              Consulting the sarcastic stars...
            </>
          ) : (
            <>
              <span className="text-xl">✨</span>
              Generate My Cosmic Roast
              <span className="text-xl">🔥</span>
            </>
          )}
        </button>
      </div>

      {/* API Call Status */}
      {lastApiCall && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          borderRadius: '5px',
          marginBottom: '15px',
          border: '1px solid #c3e6cb'
        }}>
          🌐 <strong>API Call Made:</strong> {lastApiCall.timestamp} for {lastApiCall.mode} mode
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {/* Official API Response */}
      {horoscope && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>
            📡 Official API Response
          </h3>
          <div style={{ 
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            marginBottom: '10px'
          }}>
            <p style={{ margin: 0, lineHeight: '1.5' }}>
              <strong>Text:</strong> {horoscope.text}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {horoscope.luckyColor && (
              <div style={{ fontSize: '14px' }}>
                <strong>Lucky Color:</strong> 
                <span style={{ 
                  marginLeft: '8px',
                  padding: '4px 12px',
                  backgroundColor: horoscope.luckyColor,
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {horoscope.luckyColor}
                </span>
              </div>
            )}
            {horoscope.luckyNumber && (
              <div style={{ fontSize: '14px' }}>
                <strong>Lucky Number:</strong> 
                <span style={{ 
                  marginLeft: '8px',
                  padding: '4px 12px',
                  backgroundColor: '#007bff',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {horoscope.luckyNumber}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Roast Generator Result */}
      {roastResult && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          border: '1px solid #ffeaa7',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#856404' }}>
            🔥 Roast Generator Result
          </h3>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '15px',
            gap: '10px'
          }}>
            <span style={{ fontWeight: 'bold' }}>Cringe Level {cringe}:</span>
            <span style={{ 
              padding: '4px 12px',
              backgroundColor: getCringeColor(cringe),
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {getCringeLabel(cringe)} {getCringeEmoji(cringe)}
            </span>
          </div>
          
          {/* Content Pool & Transforms Info */}
          <div style={{ 
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: `${getCringeColor(cringe)}15`,
            borderRadius: '5px',
            border: `1px solid ${getCringeColor(cringe)}30`
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
              📊 Content Pool & Transforms for Level {cringe}:
            </div>
            {(() => {
              const mapping = getCringeMapping(cringe);
              return (
                <div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '6px' }}>
                    <span>Moods: {mapping.availableOptions.moods.length}</span> • 
                    <span> Work: {mapping.availableOptions.workSituations.length}</span> • 
                    <span> Love: {mapping.availableOptions.loveSituations.length}</span> • 
                    <span> Tips: {mapping.availableOptions.tips.length}</span> • 
                    <span> Emojis: {mapping.availableOptions.emojis.length}</span>
                    {mapping.availableOptions.punchlines && (
                      <span> • Punchlines: {mapping.availableOptions.punchlines.length}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '10px', color: '#888', fontStyle: 'italic' }}>
                    Transforms: {mapping.transformFeatures.slice(0, 2).join(' • ')}
                  </div>
                </div>
              );
            })()}
          </div>

          <div style={{ 
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}>
            <p style={{ margin: 0, lineHeight: '1.5' }}>{roastResult}</p>
          </div>
        </div>
      )}

      {/* Final Composed Result */}
      {composedResult && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#d1ecf1', 
          borderRadius: '8px',
          border: '1px solid #bee5eb',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#0c5460' }}>
            ✨ Final Horoscope Result
          </h3>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div style={{ fontSize: '14px' }}>
              <strong>Mode:</strong> {getModeDescription(mode)}
            </div>
            <div style={{ fontSize: '14px' }}>
              <strong>Source:</strong> {composedResult.source}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px'
            }}>
              <strong>Cringe:</strong>
              <span style={{ 
                padding: '4px 12px',
                backgroundColor: getCringeColor(cringe),
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {cringe} - {getCringeLabel(cringe)} {getCringeEmoji(cringe)}
              </span>
            </div>
          </div>
          
          <div style={{ 
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            margin: '10px 0',
            border: '1px solid #ddd',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: '18px', 
              lineHeight: '1.6',
              color: '#2c3e50'
            }}>
              {composedResult.text}
            </p>
          </div>
          
          {(composedResult.luckyColor || composedResult.luckyNumber) && (
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {composedResult.luckyColor && (
                  <div style={{ fontSize: '14px' }}>
                    <strong>🎨 Lucky Color:</strong> 
                    <span style={{ 
                      marginLeft: '8px',
                      padding: '4px 12px',
                      backgroundColor: composedResult.luckyColor,
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {composedResult.luckyColor}
                    </span>
                  </div>
                )}
                {composedResult.luckyNumber && (
                  <div style={{ fontSize: '14px' }}>
                    <strong>🔢 Lucky Number:</strong> 
                    <span style={{ 
                      marginLeft: '8px',
                      padding: '4px 12px',
                      backgroundColor: '#007bff',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {composedResult.luckyNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HoroscopeDisplay;