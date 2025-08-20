import './styles/app.css';
import HoroscopeControls from './components/HoroscopeControls';
// import HoroscopeDisplay from './components/HoroscopeDisplay';
import { useHoroscopeGenerator } from './hooks/useHoroscopeGenerator';

function App() {
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
    exportImage
  } = useHoroscopeGenerator();

  return (
    <div className="app">
      <header className="header">
        <h1>🌟 Cringe Horoscope</h1>
        <p>Your daily dose of sarcastic stars ✨</p>
      </header>

      <main className="card max-w-2xl w-full">
        <div className="flex flex-col gap-lg">
          <div className="text-center">
            <h2 className="text-xl mb-md">Generate Your Sarcastic Horoscope</h2>
            <p className="text-secondary">
              Choose your zodiac sign, adjust the cringe level, and get ready for some stellar sarcasm!
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
            onGenerate={generateHoroscope}
            isLoading={isLoading}
          />

          {/*<HoroscopeDisplay*/}
          {/*  result={result}*/}
          {/*  onRefreshEmoji={refreshEmoji}*/}
          {/*  onRefreshAdvice={refreshAdvice}*/}
          {/*  onRefreshColor={refreshColor}*/}
          {/*  onExportImage={exportImage}*/}
          {/*  isLoading={isLoading}*/}
          {/*/>*/}
        </div>
      </main>

      <footer className="text-center text-secondary text-sm">
        <p>Built with React, TypeScript, and a healthy dose of sarcasm</p>
      </footer>
    </div>
  );
}

export default App;
