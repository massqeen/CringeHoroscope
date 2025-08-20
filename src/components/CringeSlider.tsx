import { ReactNode } from 'react';
import type { Cringe } from '../types';

interface CringeSliderProps {
  value: Cringe;
  onChange: (value: Cringe) => void;
  disabled?: boolean;
}

const CringeSlider = ({ value, onChange, disabled = false }: CringeSliderProps): ReactNode => {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(event.target.value) as Cringe;
    onChange(newValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowLeft' && value > 0) {
      onChange((value - 1) as Cringe);
    } else if (event.key === 'ArrowRight' && value < 3) {
      onChange((value + 1) as Cringe);
    }
  };

  const getCringeLabel = (level: Cringe): string => {
    switch (level) {
      case 0: return 'Mild';
      case 1: return 'Ironic';
      case 2: return 'Sarcastic';
      case 3: return 'Cringe Hard';
      default: return 'Unknown';
    }
  };

  const getCringeDescription = (level: Cringe): string => {
    switch (level) {
      case 0: return 'Gentle and pleasant vibes';
      case 1: return 'Light sarcasm and wit';
      case 2: return 'Sharp sarcasm and attitude';
      case 3: return 'Maximum chaos and cringe';
      default: return '';
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

  return (
    <div style={{ marginBottom: '20px' }}>
      <label 
        htmlFor="cringe-slider" 
        style={{ 
          display: 'block', 
          marginBottom: '10px', 
          fontWeight: 'bold',
          fontSize: '16px'
        }}
      >
        Cringe Level: {value} - {getCringeLabel(value)} {getCringeEmoji(value)}
      </label>
      
      <div style={{ position: 'relative', marginBottom: '15px' }}>
        <input
          id="cringe-slider"
          type="range"
          min="0"
          max="3"
          step="1"
          value={value}
          onChange={handleSliderChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label={`Cringe level ${value}: ${getCringeLabel(value)}`}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '5px',
            background: `linear-gradient(to right, 
              #28a745 0%, #28a745 25%, 
              #ffc107 25%, #ffc107 50%, 
              #fd7e14 50%, #fd7e14 75%, 
              #dc3545 75%, #dc3545 100%)`,
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            WebkitAppearance: 'none',
            appearance: 'none'
          }}
        />
        
        {/* Custom slider thumb styling */}
        <style>
          {`
            #cringe-slider::-webkit-slider-thumb {
              appearance: none;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: ${getCringeColor(value)};
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              cursor: ${disabled ? 'not-allowed' : 'pointer'};
              transition: all 0.2s ease;
            }
            
            #cringe-slider::-webkit-slider-thumb:hover {
              transform: ${disabled ? 'none' : 'scale(1.1)'};
              box-shadow: ${disabled ? '0 2px 6px rgba(0,0,0,0.3)' : '0 4px 8px rgba(0,0,0,0.4)'};
            }
            
            #cringe-slider::-moz-range-thumb {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: ${getCringeColor(value)};
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              cursor: ${disabled ? 'not-allowed' : 'pointer'};
              transition: all 0.2s ease;
            }
          `}
        </style>
      </div>

      {/* Level indicators */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '10px',
        fontSize: '12px',
        color: '#666'
      }}>
        {[0, 1, 2, 3].map((level) => (
          <div 
            key={level}
            style={{ 
              textAlign: 'center',
              opacity: value === level ? 1 : 0.6,
              fontWeight: value === level ? 'bold' : 'normal',
              color: value === level ? getCringeColor(level as Cringe) : '#666'
            }}
          >
            <div>{getCringeEmoji(level as Cringe)}</div>
            <div>{getCringeLabel(level as Cringe)}</div>
          </div>
        ))}
      </div>

      {/* Current level description */}
      <div style={{ 
        padding: '10px', 
        backgroundColor: `${getCringeColor(value)}15`, 
        border: `1px solid ${getCringeColor(value)}40`,
        borderRadius: '5px',
        fontSize: '14px',
        color: '#333',
        textAlign: 'center'
      }}>
        <strong>{getCringeDescription(value)}</strong>
      </div>

      {/* Quick selection buttons */}
      <div style={{ 
        marginTop: '10px', 
        display: 'flex', 
        gap: '5px', 
        justifyContent: 'center' 
      }}>
        {[0, 1, 2, 3].map((level) => (
          <button
            key={level}
            onClick={() => onChange(level as Cringe)}
            disabled={disabled}
            tabIndex={0}
            aria-label={`Set cringe level to ${level}: ${getCringeLabel(level as Cringe)}`}
            style={{
              padding: '8px 12px',
              border: value === level ? `2px solid ${getCringeColor(level as Cringe)}` : '1px solid #ddd',
              borderRadius: '20px',
              backgroundColor: value === level ? `${getCringeColor(level as Cringe)}20` : 'white',
              color: value === level ? getCringeColor(level as Cringe) : '#666',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: value === level ? 'bold' : 'normal',
              opacity: disabled ? 0.5 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {level} {getCringeEmoji(level as Cringe)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CringeSlider;
