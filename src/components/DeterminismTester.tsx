import React, { useState } from 'react';
import { generateDeterministicSeed, generateRandomSeed, mulberry32, PRNG } from '../utils/prng';
import { generateRoast } from '../services/roastGenerator';
import type { ZodiacSign, Cringe } from '../types';

export function DeterminismTester(): React.ReactElement {
  const [mode, setMode] = useState<'deterministic' | 'random'>('deterministic');
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>('aries');
  const [selectedDate, setSelectedDate] = useState<string>('2025-08-20');
  const [selectedCringe, setSelectedCringe] = useState<Cringe>(1);
  const [results, setResults] = useState<Array<{
    id: number;
    timestamp: string;
    mode: string;
    seed: number;
    seedSource: string;
    result: string;
  }>>([]);

  const zodiacSigns: ZodiacSign[] = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  const runTest = () => {
    let seed: number;
    let seedSource: string;
    
    if (mode === 'deterministic') {
      seed = generateDeterministicSeed(selectedSign, selectedDate, selectedCringe);
      seedSource = `${selectedSign}|${selectedDate}|${selectedCringe}`;
    } else {
      seed = generateRandomSeed();
      seedSource = 'crypto.getRandomValues()';
    }

    // Generate roast using the seed
    const roast = generateRoast({
      sign: selectedSign,
      day: 'today',
      cringe: selectedCringe,
      seed
    });

    const newResult = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      mode,
      seed,
      seedSource,
      result: roast.text
    };

    setResults(prev => [newResult, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const clearResults = () => {
    setResults([]);
  };

  const testConsistency = () => {
    // Generate multiple results with the same deterministic seed
    const seed = generateDeterministicSeed(selectedSign, selectedDate, selectedCringe);
    const seedSource = `${selectedSign}|${selectedDate}|${selectedCringe}`;
    
    const newResults: Array<{
      id: number;
      timestamp: string;
      mode: string;
      seed: number;
      seedSource: string;
      result: string;
    }> = [];
    
    for (let i = 0; i < 5; i++) {
      const roast = generateRoast({
        sign: selectedSign,
        day: 'today',
        cringe: selectedCringe,
        seed
      });

      newResults.push({
        id: Date.now() + i,
        timestamp: new Date().toLocaleTimeString(),
        mode: 'consistency-test',
        seed,
        seedSource: `${seedSource} (test ${i + 1})`,
        result: roast.text
      });
    }

    setResults(prev => [...newResults, ...prev.slice(0, 5)]);
  };

  const testPRNG = () => {
    // Test the raw PRNG functions
    const seed = generateDeterministicSeed(selectedSign, selectedDate, selectedCringe);
    
    // Test mulberry32 function
    const rng1 = mulberry32(seed);
    const sequence1 = Array.from({ length: 10 }, () => rng1().toFixed(6));
    
    // Test PRNG class
    const prng = new PRNG(seed);
    const sequence2 = Array.from({ length: 10 }, () => prng.next().toFixed(6));
    
    console.log('🎲 PRNG Testing Results:');
    console.log('Seed:', seed, `(from ${selectedSign}|${selectedDate}|${selectedCringe})`);
    console.log('Mulberry32 function sequence:', sequence1);
    console.log('PRNG class sequence:', sequence2);
    console.log('Sequences match:', JSON.stringify(sequence1) === JSON.stringify(sequence2));
    
    alert(`PRNG Test Complete!\nSeed: ${seed}\nSequences match: ${JSON.stringify(sequence1) === JSON.stringify(sequence2)}\nCheck console for details.`);
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #6f42c1', 
      borderRadius: '8px',
      backgroundColor: '#f8f7ff',
      marginBottom: '20px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#6f42c1' }}>
        🎲 Determinism & Randomness Tester
      </h3>
      
      {/* Mode Selection */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px', color: '#000000' }}>Mode:</label>
        <label style={{ marginRight: '15px', color: '#000000' }}>
          <input 
            type="radio" 
            value="deterministic" 
            checked={mode === 'deterministic'}
            onChange={(e) => setMode(e.target.value as 'deterministic' | 'random')}
            style={{ marginRight: '5px' }}
          />
          🔒 Deterministic (seed = sign|date|cringe)
        </label>
        <label style={{ color: '#000000' }}>
          <input 
            type="radio" 
            value="random" 
            checked={mode === 'random'}
            onChange={(e) => setMode(e.target.value as 'deterministic' | 'random')}
            style={{ marginRight: '5px' }}
          />
          🎲 Random (crypto.getRandomValues)
        </label>
      </div>

      {/* Parameters */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '10px',
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: '#ffffff',
        borderRadius: '5px',
        border: '1px solid #dee2e6'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#000000' }}>
            Zodiac Sign:
          </label>
          <select 
            value={selectedSign} 
            onChange={(e) => setSelectedSign(e.target.value as ZodiacSign)}
            style={{ width: '100%', padding: '5px' }}
          >
            {zodiacSigns.map(sign => (
              <option key={sign} value={sign}>
                {sign.charAt(0).toUpperCase() + sign.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#000000' }}>
            Date (YYYY-MM-DD):
          </label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#000000' }}>
            Cringe Level:
          </label>
          <select 
            value={selectedCringe} 
            onChange={(e) => setSelectedCringe(parseInt(e.target.value) as Cringe)}
            style={{ width: '100%', padding: '5px' }}
          >
            <option value={0}>0 - Mild</option>
            <option value={1}>1 - Ironic</option>
            <option value={2}>2 - Sarcastic</option>
            <option value={3}>3 - Cringe Hard</option>
          </select>
        </div>
      </div>

      {/* Seed Preview */}
      {mode === 'deterministic' && (
        <div style={{ 
          marginBottom: '15px',
          padding: '8px 12px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b8daff',
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'monospace',
          color: '#000000'
        }}>
          <strong>🔐 Deterministic Seed:</strong> {generateDeterministicSeed(selectedSign, selectedDate, selectedCringe)}
          <br />
          <strong>🧬 Seed Formula:</strong> hash("{selectedSign}|{selectedDate}|{selectedCringe}")
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runTest}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px',
            fontWeight: 'bold'
          }}
        >
          🚀 Generate Result
        </button>
        
        <button 
          onClick={testConsistency}
          disabled={mode !== 'deterministic'}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: mode === 'deterministic' ? '#28a745' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: mode === 'deterministic' ? 'pointer' : 'not-allowed',
            marginRight: '10px'
          }}
        >
          🔄 Test Consistency (5x)
        </button>
        
        <button 
          onClick={testPRNG}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          🧪 Test PRNG Functions
        </button>
        
        <button 
          onClick={clearResults}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🗑️ Clear Results
        </button>
      </div>

      {/* Results Display */}
      {results.length > 0 && (
        <div>
          <h4 style={{ margin: '0 0 10px 0', color: '#000000' }}>📊 Test Results:</h4>
          <div style={{ 
            maxHeight: '400px', 
            overflowY: 'auto',
            border: '1px solid #dee2e6',
            borderRadius: '5px'
          }}>
            {results.map((result, index) => (
              <div 
                key={result.id} 
                style={{ 
                  padding: '12px',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                  borderBottom: index < results.length - 1 ? '1px solid #dee2e6' : 'none'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{ fontSize: '12px', color: '#000000' }}>
                    <strong>#{index + 1}</strong> | {result.timestamp} | 
                    <span style={{ 
                      color: result.mode === 'deterministic' ? '#28a745' : 
                            result.mode === 'random' ? '#dc3545' : '#17a2b8',
                      fontWeight: 'bold'
                    }}>
                      {result.mode.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#000000' }}>
                    Seed: {result.seed}
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#000000', marginBottom: '5px' }}>
                  <strong>Source:</strong> {result.seedSource}
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.4', color: '#000000' }}>
                  {result.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div style={{ 
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#000000'
      }}>
        💡 <strong>Testing Tips:</strong>
        <br />• Deterministic mode should produce identical results with same parameters
        <br />• Random mode should produce different results each time
        <br />• Use "Test Consistency" to verify deterministic behavior
        <br />• Check browser console for detailed PRNG testing logs
      </div>
    </div>
  );
}
