import { ZodiacSign, Day, Mode, Cringe, ZODIAC_SIGNS, CRINGE_LABELS } from '../types';
import styles from './HoroscopeControls.module.css';

interface HoroscopeControlsProps {
  sign: ZodiacSign;
  day: Day;
  mode: Mode;
  cringe: Cringe;
  deterministic: boolean;
  onSignChange: (sign: ZodiacSign) => void;
  onDayChange: (day: Day) => void;
  onModeChange: (mode: Mode) => void;
  onCringeChange: (cringe: Cringe) => void;
  onDeterministicChange: (deterministic: boolean) => void;
}

const ZODIAC_EMOJIS: Record<ZodiacSign, string> = {
  aries: '♈',
  taurus: '♉',
  gemini: '♊',
  cancer: '♋',
  leo: '♌',
  virgo: '♍',
  libra: '♎',
  scorpio: '♏',
  sagittarius: '♐',
  capricorn: '♑',
  aquarius: '♒',
  pisces: '♓',
};

const CRINGE_DESCRIPTIONS = {
  0: { label: 'Gentle', emoji: '😊', desc: 'Soft and friendly' },
  1: { label: 'Ironic', emoji: '😏', desc: 'Subtle sarcasm' },
  2: { label: 'Sarcastic', emoji: '🙄', desc: 'Sharp and witty' },
  3: { label: 'Cringe Hard', emoji: '😈', desc: 'Maximum chaos' },
} as const;

export default function HoroscopeControls({
  sign,
  day,
  mode,
  cringe,
  deterministic,
  onSignChange,
  onDayChange,
  onModeChange,
  onCringeChange,
  onDeterministicChange,
}: HoroscopeControlsProps) {
  const handleSignChange = (newSign: ZodiacSign) => {
    onSignChange(newSign);
  };

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onDayChange(event.target.value as Day);
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onModeChange(event.target.value as Mode);
  };

  const handleCringeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onCringeChange(parseInt(event.target.value) as Cringe);
  };

  const handleDeterministicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDeterministicChange(event.target.checked);
  };

  const handleSignKeyDown = (targetSign: ZodiacSign) => (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSignChange(targetSign);
    }
  };

  const currentCringeInfo = CRINGE_DESCRIPTIONS[cringe];

  return (
    <div className="flex flex-col gap-lg">
      {/* Zodiac Sign Selection with Grid */}
      <div className="flex flex-col gap-sm">
        <label className="text-sm font-medium text-secondary">Choose Your Zodiac Sign</label>
        <div className="grid grid-cols-4 gap-sm">
          {ZODIAC_SIGNS.map((zodiacSign) => (
            <button
              key={zodiacSign}
              type="button"
              onClick={() => handleSignChange(zodiacSign)}
              onKeyDown={handleSignKeyDown(zodiacSign)}
              className={`
                button flex flex-col items-center p-3 rounded-lg border transition-all
                ${
                  sign === zodiacSign
                    ? 'border-primary bg-primary bg-opacity-20 text-primary'
                    : 'border-border bg-background-card hover:border-primary hover:bg-primary hover:bg-opacity-10'
                }
              `}
              style={{ cursor: 'pointer' }}
              aria-label={`Select ${zodiacSign} zodiac sign`}
              tabIndex={0}
            >
              <span className="text-2xl mb-xs">{ZODIAC_EMOJIS[zodiacSign]}</span>
              <span className="text-xs capitalize font-medium">{zodiacSign}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Day Selection */}
      <div className="flex flex-col gap-sm">
        <label htmlFor="day-selection" className="text-sm font-medium text-secondary">
          When do you need the cosmic roast?
        </label>
        <select
          id="day-selection"
          value={day}
          onChange={handleDayChange}
          className="select"
          aria-label="Select day for horoscope"
        >
          <option value="yesterday">🌆 Yesterday</option>
          <option value="today">🌅 Today</option>
          <option value="tomorrow">🌄 Tomorrow</option>
        </select>
      </div>

      {/* Mode Selection */}
      <div className="flex flex-col gap-sm">
        <label htmlFor="mode-selection" className="text-sm font-medium text-secondary">
          How much reality can you handle?
        </label>
        <select
          id="mode-selection"
          value={mode}
          onChange={handleModeChange}
          className="select"
          aria-label="Select horoscope mode"
        >
          <option value="mix">🎭 Mix (Best of both worlds)</option>
          <option value="official">✨ Official (Pure cosmic wisdom)</option>
          <option value="roast">🔥 Roast (Maximum damage)</option>
        </select>
      </div>

      {/* Cringe Level Slider */}
      <div className="slider-container">
        <div className="flex items-center justify-between mb-sm">
          <label htmlFor="cringe-slider" className="text-sm font-medium text-secondary">
            Cringe Level
          </label>
          <div className="flex items-center gap-sm text-sm">
            <span className="text-lg">{currentCringeInfo.emoji}</span>
            <span className="font-medium text-primary">{currentCringeInfo.label}</span>
          </div>
        </div>

        <input
          id="cringe-slider"
          type="range"
          min="0"
          max="3"
          value={cringe}
          onChange={handleCringeChange}
          className={styles.slider}
          aria-label="Adjust cringe level from gentle to hard"
        />

        <div className="flex justify-between text-xs text-secondary mt-xs">
          <span
            onClick={() => onCringeChange(0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCringeChange(0);
              }
            }}
            className={`${styles.cringeButton} ${cringe === 0 ? 'text-primary' : 'text-secondary'}`}
            aria-label="Set cringe level to gentle"
            tabIndex={0}
            role="button"
          >
            😊 Gentle
          </span>

          <span
            onClick={() => onCringeChange(1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCringeChange(1);
              }
            }}
            className={`${styles.cringeButton} ${cringe === 1 ? 'text-primary' : 'text-secondary'}`}
            aria-label="Set cringe level to ironic"
            tabIndex={0}
            role="button"
          >
            😏 Ironic
          </span>

          <span
            onClick={() => onCringeChange(2)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCringeChange(2);
              }
            }}
            className={`${styles.cringeButton} ${cringe === 2 ? 'text-primary' : 'text-secondary'}`}
            aria-label="Set cringe level to sarcastic"
            tabIndex={0}
            role="button"
          >
            🙄 Sarcastic
          </span>

          <span
            onClick={() => onCringeChange(3)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCringeChange(3);
              }
            }}
            className={`${styles.cringeButton} ${cringe === 3 ? 'text-primary' : 'text-secondary'}`}
            aria-label="Set cringe level to chaos"
            tabIndex={0}
            role="button"
          >
            😈 Chaos
          </span>
        </div>

        <p className="text-xs text-secondary text-center mt-xs">{currentCringeInfo.desc}</p>
      </div>

      {/* Deterministic Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-background-card border border-border">
        <div className="flex flex-col">
          <label htmlFor="deterministic-toggle" className="text-sm font-medium text-secondary">
            🎯 Deterministic Mode
          </label>
          <p className="text-xs text-secondary">
            Same settings = same result (perfect for sharing)
          </p>
        </div>
        <label className={styles.toggle}>
          <input
            id="deterministic-toggle"
            type="checkbox"
            checked={deterministic}
            onChange={handleDeterministicChange}
            aria-label="Enable deterministic mode for consistent results"
          />
          <span className={styles.toggleSlider}></span>
        </label>
      </div>
    </div>
  );
}
