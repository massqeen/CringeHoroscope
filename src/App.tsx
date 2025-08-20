import { useState } from 'react';
import './styles/app.css';
import HoroscopeControls from './components/HoroscopeControls';
import HoroscopeDisplay from './components/HoroscopeDisplay';
import { useHoroscopeGenerator } from './hooks/useHoroscopeGenerator';
import { ApiTester } from './components/ApiTester';
import { DeterminismTester } from './components/DeterminismTester';
import BackendTester from './components/BackendTester';

function App() {
  const [showDevMode, setShowDevMode] = useState(false);
  const {
    sign,
    day,
    mode,
    cringe,
    deterministic,
    result,
    isLoading,
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
  } = useHoroscopeGenerator();

  return (
    <div className="app">
      <header className="header">
        <h1>🌟 Cringe Horoscope</h1>
        <p>Your daily dose of sarcastic stars ✨</p>
        
        {/* Development Mode Toggle */}
        <div style={{ 
          marginTop: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '12px', color: '#d1d5db' }}>Production</span>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={showDevMode} 
              onChange={(e) => setShowDevMode(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
          <span style={{ fontSize: '12px', color: '#d1d5db' }}>Dev Mode</span>
        </div>
      </header>

      <main className="card max-w-2xl w-full">
        <div className="flex flex-col gap-lg">
          {!showDevMode ? (
            // Production UI
            <>
              <div className="text-center">
                <h2 className="text-xl mb-md">Generate Your Sarcastic Horoscope</h2>
                <p className="text-secondary">
                  Choose your zodiac sign, adjust the cringe level, and get ready for some stellar
                  sarcasm!
                </p>
              </div>

              <HoroscopeControls
                sign={sign}
                day={day}
                mode={mode}
                cringe={cringe}
                deterministic={deterministic}
                onSignChange={setSign}
                onDayChange={setDay}
                onModeChange={setMode}
                onCringeChange={setCringe}
                onDeterministicChange={setDeterministic}
              />

              <HoroscopeDisplay
                sign={sign}
                day={day}
                mode={mode}
                cringe={cringe}
                deterministic={deterministic}
                onGenerate={generateHoroscope}
                isLoading={isLoading}
              />
            </>
          ) : (
            // Development/Testing UI
            <>
              <div className="text-center">
                <h2 className="text-xl mb-md">🛠️ Development & Testing Mode</h2>
                <p className="text-secondary">
                  Backend testing components for API integration, determinism, and content generation
                </p>
              </div>

              <ApiTester />
              <DeterminismTester />
              <BackendTester />
            </>
          )}
        </div>
      </main>

      <footer className="text-center text-secondary text-sm">
        <p>Built with React, TypeScript, and a healthy dose of sarcasm</p>
      </footer>
    </div>
  );
}

export default App;
