import { ReactNode, useState } from 'react';
import { useHoroscope } from '../hooks/useHoroscope';
import { generateRoast } from '../services/roastGenerator';
import { composeResult, getModeDescription } from '../services/horoscopeComposer';
import { generateDeterministicSeed } from '../utils/prng';
import type { ZodiacSign, Day, Cringe, Mode, HoroscopeResult } from '../types';

const HoroscopeTest = (): ReactNode => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>('aries');
  const [selectedDay, setSelectedDay] = useState<Day>('today');
  const [selectedCringe, setSelectedCringe] = useState<Cringe>(1);
  const [selectedMode, setSelectedMode] = useState<Mode>('mix');
  const { horoscope, loading, error, fetchHoroscope } = useHoroscope();
  const [roastResult, setRoastResult] = useState<string | null>(null);
  const [composedResult, setComposedResult] = useState<HoroscopeResult | null>(null);

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

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="cringe-select">Cringe Level:</label>
          <select 
            id="cringe-select"
            value={selectedCringe} 
            onChange={(e) => setSelectedCringe(parseInt(e.target.value) as Cringe)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value={0}>0 - Mild</option>
            <option value={1}>1 - Ironic</option>
            <option value={2}>2 - Sarcastic</option>
            <option value={3}>3 - Cringe Hard</option>
          </select>
        </div>

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
          <p><strong>Cringe Level {selectedCringe}:</strong> {roastResult}</p>
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
          <p><strong>Mode:</strong> {getModeDescription(selectedMode)}</p>
          <p><strong>Source:</strong> {composedResult.source}</p>
          <div style={{ 
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '5px',
            margin: '10px 0',
            border: '1px solid #ddd'
          }}>
            <p><strong>Text:</strong> {composedResult.text}</p>
          </div>
          {composedResult.luckyColor && (
            <p><strong>Lucky Color:</strong> {composedResult.luckyColor}</p>
          )}
          {composedResult.luckyNumber && (
            <p><strong>Lucky Number:</strong> {composedResult.luckyNumber}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HoroscopeTest;
