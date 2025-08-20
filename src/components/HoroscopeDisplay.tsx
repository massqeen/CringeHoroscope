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
  const { horoscope, loading, error, fetchHoroscope, clearHoroscope } = useHoroscope();
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

  // useEffect to clear data when sign or day changes
  useEffect(() => {
    // Clear all results when sign or day changes to force fresh data fetch
    setComposedResult(null);
    setRoastResult(null);
    setPendingGeneration(null);
    setLastApiCall(null);
    clearHoroscope(); // Clear horoscope data from the hook
  }, [sign, day, clearHoroscope]);

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

  // Function to determine if a color is light or dark
  const isLightColor = (color: string): boolean => {
    // Handle named colors
    const namedColors: Record<string, string> = {
      'white': '#ffffff',
      'black': '#000000',
      'red': '#ff0000',
      'green': '#008000',
      'blue': '#0000ff',
      'yellow': '#ffff00',
      'cyan': '#00ffff',
      'magenta': '#ff00ff',
      'silver': '#c0c0c0',
      'gray': '#808080',
      'grey': '#808080',
      'maroon': '#800000',
      'olive': '#808000',
      'lime': '#00ff00',
      'aqua': '#00ffff',
      'teal': '#008080',
      'navy': '#000080',
      'fuchsia': '#ff00ff',
      'purple': '#800080',
      'orange': '#ffa500',
      'pink': '#ffc0cb',
      // Additional API colors
      'bronze': '#cd7f32',
      'slate-gray': '#708090',
      'slate gray': '#708090',
      'slategray': '#708090',
      'lilac': '#c8a2c8',
      'obsidian': '#0f1419',
      'lavender': '#e6e6fa',
      'gold': '#ffd700'
    };

    let hex = color.toLowerCase();
    
    // Convert named color to hex
    if (namedColors[hex]) {
      hex = namedColors[hex];
    }
    
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // If not a valid hex, assume it's dark
    if (!/^[0-9a-f]{6}$/i.test(hex)) {
      return false;
    }
    
    // Calculate luminance
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance using WCAG formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return true if light (luminance > 0.5)
    return luminance > 0.5;
  };

  // Function to get appropriate text color for background
  const getTextColor = (backgroundColor: string): string => {
    return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
  };

  // Function to convert color names to valid CSS colors
  const getCssColor = (color: string): string => {
    // Handle named colors - return hex values for reliable CSS display
    const namedColors: Record<string, string> = {
      'white': '#ffffff',
      'black': '#000000',
      'red': '#ff0000',
      'green': '#008000',
      'blue': '#0000ff',
      'yellow': '#ffff00',
      'cyan': '#00ffff',
      'magenta': '#ff00ff',
      'silver': '#c0c0c0',
      'gray': '#808080',
      'grey': '#808080',
      'maroon': '#800000',
      'olive': '#808000',
      'lime': '#00ff00',
      'aqua': '#00ffff',
      'teal': '#008080',
      'navy': '#000080',
      'fuchsia': '#ff00ff',
      'purple': '#800080',
      'orange': '#ffa500',
      'pink': '#ffc0cb',
      // Additional API colors
      'bronze': '#cd7f32',
      'slate-gray': '#708090',
      'slate gray': '#708090',
      'slategray': '#708090',
      'lilac': '#c8a2c8',
      'obsidian': '#0f1419',
      'lavender': '#e6e6fa',
      'gold': '#ffd700'
    };

    const lowerColor = color.toLowerCase();
    
    // Return hex value if we have it, otherwise return the original color
    return namedColors[lowerColor] || color;
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
      {/* Generate Button */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <button 
          onClick={handleGenerateResult}
          disabled={loading || isLoading}
          className="button button-primary w-full text-lg py-4"
          style={{ 
            padding: '20px 40px', 
            fontSize: '20px',
            fontWeight: 'bold',
            minWidth: '280px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            cursor: loading || isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
        >
          {(loading || isLoading) ? (
            <>
              <span className="loading"></span>
              Consulting the cosmic forces...
            </>
          ) : (
            <>
              <span style={{ fontSize: '24px' }}>✨</span>
              {' '}Generate My Cosmic Roast{' '}
              <span style={{ fontSize: '24px' }}>🔥</span>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff5f5', 
          color: '#e53e3e', 
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid #fed7d7',
          textAlign: 'center',
          fontSize: '16px'
        }}>
          <strong>❌ Oops!</strong> {error}
        </div>
      )}

      {/* Final Composed Result - Production Style */}
      {composedResult && (
        <div style={{ 
          padding: '0',
          marginBottom: '20px'
        }}>
          {/* Main horoscope content */}
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '30px',
            borderRadius: '16px',
            marginBottom: '20px',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative background elements */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '100px',
              height: '100px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '60px',
              height: '60px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}></div>
            
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '25px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              zIndex: 1
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: '20px', 
                lineHeight: '1.7',
                color: '#2d3748',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                {composedResult.text}
              </p>
            </div>
          </div>
          
          {/* Lucky elements in a beautiful card */}
          {(composedResult.luckyColor || composedResult.luckyNumber) && (
            <div style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '25px',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative elements */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '40px',
                opacity: 0.3
              }}>🌟</div>
              
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '20px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                <h4 style={{ 
                  margin: '0 0 15px 0', 
                  color: '#2d3748',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  ✨ Your Lucky Elements ✨
                </h4>
                <div style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {composedResult.luckyColor && (
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      <span className="lucky-title">🎨 Lucky Color:</span>
                      <span style={{ 
                        padding: '8px 16px',
                        backgroundColor: getCssColor(composedResult.luckyColor),
                        borderRadius: '20px',
                        color: getTextColor(composedResult.luckyColor),
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textShadow: isLightColor(composedResult.luckyColor) 
                          ? '0 1px 2px rgba(255,255,255,0.3)' 
                          : '0 1px 2px rgba(0,0,0,0.3)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        border: isLightColor(composedResult.luckyColor) 
                          ? '1px solid rgba(0,0,0,0.1)' 
                          : 'none'
                      }}>
                        {composedResult.luckyColor}
                      </span>
                    </div>
                  )}
                  {composedResult.luckyNumber && (
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      <span className="lucky-title">🔢 Lucky Number:</span>
                      <span style={{ 
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        borderRadius: '20px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>
                        {composedResult.luckyNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HoroscopeDisplay;