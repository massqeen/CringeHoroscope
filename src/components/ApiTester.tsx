import React, { useState } from 'react';

import { getOfficial } from '../services/aztroApi';
import type { ZodiacSign, Day, OfficialHoroscope } from '../types';

export function ApiTester(): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OfficialHoroscope | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiCalls, setApiCalls] = useState<
    Array<{
      timestamp: string;
      sign: ZodiacSign;
      day: Day;
      success: boolean;
      response?: OfficialHoroscope;
      error?: string;
    }>
  >([]);

  const testApi = async (sign: ZodiacSign, day: Day) => {
    setLoading(true);
    setError(null);

    const timestamp = new Date().toLocaleTimeString();
    console.log(`🔍 Making API call to Aztro API at ${timestamp}`);
    console.log(`📍 URL: https://aztro.sameerkumar.website/?sign=${sign}&day=${day}`);

    try {
      const response = await getOfficial(sign, day);
      const item = response[0];
      const officialData = {
        text: item.description,
        luckyColor: item.color,
        luckyNumber: item?.lucky_number ?? 0,
      };

      console.log('✅ API Response received:', response);

      setResult(officialData);
      setApiCalls((prev) => [
        ...prev,
        {
          timestamp,
          sign,
          day,
          success: true,
          response: officialData,
        },
      ]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ API Error:', errorMsg);

      setError(errorMsg);
      setApiCalls((prev) => [
        ...prev,
        {
          timestamp,
          sign,
          day,
          success: false,
          error: errorMsg,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        border: '2px solid #007bff',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        marginBottom: '20px',
      }}
    >
      <h3 style={{ margin: '0 0 15px 0', color: '#007bff' }}>🔬 Aztro API Tester</h3>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={() => testApi('aries', 'today')}
          disabled={loading}
          style={{
            padding: '8px 15px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px',
          }}
        >
          {loading ? 'Calling API...' : 'Test Aries Today'}
        </button>

        <button
          onClick={() => testApi('scorpio', 'tomorrow')}
          disabled={loading}
          style={{
            padding: '8px 15px',
            backgroundColor: loading ? '#ccc' : '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px',
          }}
        >
          {loading ? 'Calling API...' : 'Test Scorpio Tomorrow'}
        </button>

        <button
          onClick={() => setApiCalls([])}
          style={{
            padding: '8px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Clear Log
        </button>
      </div>

      {/* API Call Log */}
      {apiCalls.length > 0 && (
        <div
          style={{
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#000',
            color: '#0f0',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            📊 API Call Log ({apiCalls.length} calls):
          </div>
          {apiCalls.map((call, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              <span style={{ color: call.success ? '#0f0' : '#f00' }}>
                {call.success ? '✅' : '❌'}
              </span>{' '}
              <span style={{ color: '#fff' }}>{call.timestamp}</span>{' '}
              <span style={{ color: '#ff0' }}>{call.sign}</span>{' '}
              <span style={{ color: '#0ff' }}>{call.day}</span>
              {call.success ? (
                <span style={{ color: '#0f0' }}>
                  {' '}
                  → Success ({call.response?.text?.substring(0, 30)}...)
                </span>
              ) : (
                <span style={{ color: '#f00' }}> → Error: {call.error}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Current Result */}
      {result && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', color: '#155724' }}>✅ Latest API Response:</h4>
          <div style={{ fontSize: '14px', color: '#155724' }}>
            <strong>Text:</strong> {result.text}
          </div>
          <div style={{ fontSize: '12px', color: '#155724', marginTop: '5px' }}>
            <strong>Lucky Color:</strong> {result.luckyColor} |<strong> Lucky Number:</strong>{' '}
            {result.luckyNumber}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
          }}
        >
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      <div style={{ fontSize: '12px', color: '#6c757d', fontStyle: 'italic' }}>
        💡 Check browser DevTools Network tab to see HTTP requests to Aztro API
      </div>
    </div>
  );
}
