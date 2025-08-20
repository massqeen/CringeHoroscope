import { ReactNode, useState } from 'react';
import { useHoroscope } from '../hooks/useHoroscope';
import { generateRoast, getCringeMapping } from '../services/roastGenerator';
import { composeResult, getModeDescription } from '../services/horoscopeComposer';
import { generateDeterministicSeed } from '../utils/prng';
import CringeSlider from './CringeSlider';
import type { ZodiacSign, Day, Cringe, Mode, HoroscopeResult } from '../types';

const HoroscopeTest = (): ReactNode => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>('aries');
  const [selectedDay, setSelectedDay] = useState<Day>('today');
  const [selectedCringe, setSelectedCringe] = useState<Cringe>(1);
  const [selectedMode, setSelectedMode] = useState<Mode>('mix');
  const { horoscope, loading, error, fetchHoroscope } = useHoroscope();
  const [roastResult, setRoastResult] = useState<string | null>(null);
  const [composedResult, setComposedResult] = useState<HoroscopeResult | null>(null);

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

  const handleFetchHoroscope = (): void => {
    fetchHoroscope(selectedSign, selectedDay);
  };

  const handleGenerateRoast = (): void => {
    const today = new Date();
    const dateString = today.toISOString().slice(0, 10); // YYYY-MM-DD
    const seed = generateDeterministicSeed(selectedSign, dateString, selectedCringe);
    
    const roast = generateRoast({
      sign: selectedSign,
      day: selectedDay,
      cringe: selectedCringe,
      seed
    });
    
    setRoastResult(roast.text);
  };

  const handleComposeResult = (): void => {
    if (!horoscope) {
      alert('Please fetch official horoscope first!');
      return;
    }

    const today = new Date();
    const dateString = today.toISOString().slice(0, 10);
    const seed = generateDeterministicSeed(selectedSign, dateString, selectedCringe);
    
    // Generate roast
    const roast = generateRoast({
      sign: selectedSign,
      day: selectedDay,
      cringe: selectedCringe,
      seed
    });
    
    // Compose result
    const result = composeResult({
      mode: selectedMode,
      official: horoscope,
      roast,
      cringe: selectedCringe,
      seed
    });
    
    setComposedResult(result);
  };

  const zodiacSigns: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 tabIndex={0}>🔮 API Test Component</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="zodiac-select">Zodiac Sign:</label>
          <select 
            id="zodiac-select"
            value={selectedSign} 
            onChange={(e) => setSelectedSign(e.target.value as ZodiacSign)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            {zodiacSigns.map(sign => (
              <option key={sign} value={sign}>
                {sign.charAt(0).toUpperCase() + sign.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="day-select">Day:</label>
          <select 
            id="day-select"
            value={selectedDay} 
            onChange={(e) => setSelectedDay(e.target.value as Day)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
          </select>
        </div>

        <CringeSlider 
          value={selectedCringe}
          onChange={setSelectedCringe}
          disabled={loading}
        />

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="mode-select">Composition Mode:</label>
          <select 
            id="mode-select"
            value={selectedMode} 
            onChange={(e) => setSelectedMode(e.target.value as Mode)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="official">Official Only</option>
            <option value="roast">Roast Only</option>
            <option value="mix">Mix (Official + Roast)</option>
          </select>
        </div>

        <button 
          onClick={handleFetchHoroscope} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Loading...' : 'Fetch Official'}
        </button>

        <button 
          onClick={handleGenerateRoast}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Generate Roast
        </button>

        <button 
          onClick={handleComposeResult}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Compose Final
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {horoscope && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '5px',
          border: '1px solid #dee2e6',
          marginBottom: '20px'
        }}>
          <h3>Official API Response:</h3>
          <p><strong>Text:</strong> {horoscope.text}</p>
          {horoscope.luckyColor && (
            <p><strong>Lucky Color:</strong> {horoscope.luckyColor}</p>
          )}
          {horoscope.luckyNumber && (
            <p><strong>Lucky Number:</strong> {horoscope.luckyNumber}</p>
          )}
        </div>
      )}

      {roastResult && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '5px',
          border: '1px solid #ffeaa7',
          marginBottom: '20px'
        }}>
          <h3>Roast Generator Result:</h3>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '15px',
            gap: '10px'
          }}>
            <span style={{ fontWeight: 'bold' }}>Cringe Level {selectedCringe}:</span>
            <span style={{ 
              padding: '4px 8px',
              backgroundColor: getCringeColor(selectedCringe),
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {getCringeLabel(selectedCringe)} {getCringeEmoji(selectedCringe)}
            </span>
          </div>
          
          {/* Show mapping details */}
          <div style={{ 
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: `${getCringeColor(selectedCringe)}15`,
            borderRadius: '5px',
            border: `1px solid ${getCringeColor(selectedCringe)}30`
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
              📊 Content Pool & Transforms for Level {selectedCringe}:
            </div>
            {(() => {
              const mapping = getCringeMapping(selectedCringe);
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
            <p style={{ margin: 0 }}>{roastResult}</p>
          </div>
        </div>
      )}

      {composedResult && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#d1ecf1', 
          borderRadius: '5px',
          border: '1px solid #bee5eb',
          marginBottom: '20px'
        }}>
          <h3>Final Composed Result:</h3>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div>
              <strong>Mode:</strong> {getModeDescription(selectedMode)}
            </div>
            <div>
              <strong>Source:</strong> {composedResult.source}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px'
            }}>
              <strong>Cringe:</strong>
              <span style={{ 
                padding: '4px 8px',
                backgroundColor: getCringeColor(selectedCringe),
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {selectedCringe} - {getCringeLabel(selectedCringe)} {getCringeEmoji(selectedCringe)}
              </span>
            </div>
          </div>
          <div style={{ 
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '5px',
            margin: '10px 0',
            border: '1px solid #ddd'
          }}>
            <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.5' }}>
              <strong>Text:</strong> {composedResult.text}
            </p>
          </div>
          {(composedResult.luckyColor || composedResult.luckyNumber) && (
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #dee2e6'
            }}>
              {composedResult.luckyColor && (
                <p style={{ margin: '0 0 5px 0' }}>
                  <strong>Lucky Color:</strong> 
                  <span style={{ 
                    marginLeft: '8px',
                    padding: '2px 8px',
                    backgroundColor: composedResult.luckyColor,
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    {composedResult.luckyColor}
                  </span>
                </p>
              )}
              {composedResult.luckyNumber && (
                <p style={{ margin: 0 }}>
                  <strong>Lucky Number:</strong> 
                  <span style={{ 
                    marginLeft: '8px',
                    padding: '2px 8px',
                    backgroundColor: '#007bff',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {composedResult.luckyNumber}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HoroscopeTest;
