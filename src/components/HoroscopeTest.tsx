import { ReactNode, useState } from 'react';
import { useHoroscope } from '../hooks/useHoroscope';
import { generateRoast } from '../services/roastGenerator';
import { generateDeterministicSeed } from '../utils/prng';
import type { ZodiacSign, Day, Cringe } from '../types';

const HoroscopeTest = (): ReactNode => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>('aries');
  const [selectedDay, setSelectedDay] = useState<Day>('today');
  const [selectedCringe, setSelectedCringe] = useState<Cringe>(1);
  const { horoscope, loading, error, fetchHoroscope } = useHoroscope();
  const [roastResult, setRoastResult] = useState<string | null>(null);

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
          {loading ? 'Loading...' : 'Test API'}
        </button>

        <button 
          onClick={handleGenerateRoast}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Generate Roast
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
    </div>
  );
};

export default HoroscopeTest;
