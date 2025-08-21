import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import HoroscopeControls from '../src/components/HoroscopeControls';
import type { ZodiacSign, Day, Mode, Cringe } from '../src/types';

// Mock CSS modules
vi.mock('../src/components/HoroscopeControls.module.css', () => ({
  default: {
    slider: 'slider',
    cringeButton: 'cringeButton',
    toggle: 'toggle',
    toggleSlider: 'toggleSlider',
  },
}));

describe('HoroscopeControls', () => {
  const defaultProps = {
    sign: 'aries' as ZodiacSign,
    day: 'today' as Day,
    mode: 'mix' as Mode,
    cringe: 1 as Cringe,
    deterministic: false,
    onSignChange: vi.fn(),
    onDayChange: vi.fn(),
    onModeChange: vi.fn(),
    onCringeChange: vi.fn(),
    onDeterministicChange: vi.fn(),
  };

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render all zodiac sign buttons', () => {
    render(HoroscopeControls(defaultProps));

    const zodiacSigns = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];

    zodiacSigns.forEach(sign => {
      const button = screen.getByRole('button', { name: new RegExp(`select ${sign}`, 'i') });
      expect(button).toBeInTheDocument();
    });
  });

  it('should highlight the current zodiac sign', () => {
    render(HoroscopeControls({ ...defaultProps, sign: 'leo' }));

    const leoButton = screen.getByRole('button', { name: /select leo/i });
    expect(leoButton).toHaveClass('border-primary');
  });

  it('should call onSignChange when zodiac sign button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSignChange = vi.fn();
    
    render(HoroscopeControls({ ...defaultProps, onSignChange: mockOnSignChange }));

    const virgoButton = screen.getByRole('button', { name: /select virgo/i });
    await user.click(virgoButton);

    expect(mockOnSignChange).toHaveBeenCalledWith('virgo');
  });

  it('should handle zodiac sign button keyboard navigation', () => {
    const mockOnSignChange = vi.fn();
    
    render(HoroscopeControls({ ...defaultProps, onSignChange: mockOnSignChange }));

    const scorpioButton = screen.getByRole('button', { name: /select scorpio/i });
    fireEvent.keyDown(scorpioButton, { key: 'Enter', code: 'Enter' });

    expect(mockOnSignChange).toHaveBeenCalledWith('scorpio');
  });

  it('should handle zodiac sign button space key', () => {
    const mockOnSignChange = vi.fn();
    
    render(HoroscopeControls({ ...defaultProps, onSignChange: mockOnSignChange }));

    const aquariusButton = screen.getByRole('button', { name: /select aquarius/i });
    fireEvent.keyDown(aquariusButton, { key: ' ', code: 'Space' });

    expect(mockOnSignChange).toHaveBeenCalledWith('aquarius');
  });

  it('should render day selection dropdown with correct options', () => {
    render(HoroscopeControls(defaultProps));

    const daySelect = screen.getByRole('combobox', { name: /select day for horoscope/i });
    expect(daySelect).toBeInTheDocument();
    expect(daySelect).toHaveValue('today');

    expect(screen.getByRole('option', { name: /yesterday/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /today/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /tomorrow/i })).toBeInTheDocument();
  });

  it('should call onDayChange when day selection changes', async () => {
    const user = userEvent.setup();
    const mockOnDayChange = vi.fn();
    
    render(HoroscopeControls({ ...defaultProps, onDayChange: mockOnDayChange }));

    const daySelect = screen.getByRole('combobox', { name: /select day for horoscope/i });
    await user.selectOptions(daySelect, 'tomorrow');

    expect(mockOnDayChange).toHaveBeenCalledWith('tomorrow');
  });

  it('should render mode selection dropdown with correct options', () => {
    render(HoroscopeControls(defaultProps));

    const modeSelect = screen.getByRole('combobox', { name: /select horoscope mode/i });
    expect(modeSelect).toBeInTheDocument();
    expect(modeSelect).toHaveValue('mix');

    expect(screen.getByRole('option', { name: /mix/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /official/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /roast/i })).toBeInTheDocument();
  });

  it('should call onModeChange when mode selection changes', async () => {
    const user = userEvent.setup();
    const mockOnModeChange = vi.fn();
    
    render(HoroscopeControls({ ...defaultProps, onModeChange: mockOnModeChange }));

    const modeSelect = screen.getByRole('combobox', { name: /select horoscope mode/i });
    await user.selectOptions(modeSelect, 'roast');

    expect(mockOnModeChange).toHaveBeenCalledWith('roast');
  });

  it('should render cringe level slider with current value', () => {
    render(HoroscopeControls({ ...defaultProps, cringe: 2 }));

    const slider = screen.getByRole('slider', { name: /adjust cringe level/i });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveValue('2');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '3');
  });

  it('should display correct cringe level label and emoji', () => {
    const cringeData = [
      { value: 0, label: 'Gentle', emoji: '😊' },
      { value: 1, label: 'Ironic', emoji: '😏' },
      { value: 2, label: 'Sarcastic', emoji: '🙄' },
      { value: 3, label: 'Cringe Hard', emoji: '😈' },
    ];

    cringeData.forEach(({ value, label, emoji }) => {
      render(HoroscopeControls({ ...defaultProps, cringe: value as Cringe }));
      
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(emoji)).toBeInTheDocument();
      
      cleanup();
    });
  });

  it('should call onCringeChange when slider value changes', async () => {
    const user = userEvent.setup();
    const mockOnCringeChange = vi.fn();
    
    render(HoroscopeControls({ ...defaultProps, onCringeChange: mockOnCringeChange }));

    const slider = screen.getByRole('slider', { name: /adjust cringe level/i });
    // Use fireEvent.change for range inputs instead of user.clear and user.type
    fireEvent.change(slider, { target: { value: '3' } });

    expect(mockOnCringeChange).toHaveBeenCalledWith(3);
  });

  it('should render cringe level quick buttons', () => {
    render(HoroscopeControls(defaultProps));

    const gentleButton = screen.getByRole('button', { name: /set cringe level to gentle/i });
    const ironicButton = screen.getByRole('button', { name: /set cringe level to ironic/i });
    const sarcasticButton = screen.getByRole('button', { name: /set cringe level to sarcastic/i });
    const chaosButton = screen.getByRole('button', { name: /set cringe level to chaos/i });

    expect(gentleButton).toBeInTheDocument();
    expect(ironicButton).toBeInTheDocument();
    expect(sarcasticButton).toBeInTheDocument();
    expect(chaosButton).toBeInTheDocument();
  });

  it('should call onCringeChange when quick button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnCringeChange = vi.fn();
    
    render(HoroscopeControls({ ...defaultProps, onCringeChange: mockOnCringeChange }));

    const chaosButton = screen.getByRole('button', { name: /set cringe level to chaos/i });
    await user.click(chaosButton);

    expect(mockOnCringeChange).toHaveBeenCalledWith(3);
  });

  it('should handle cringe button keyboard navigation', () => {
    const mockOnCringeChange = vi.fn();
    
    render(HoroscopeControls({ ...defaultProps, onCringeChange: mockOnCringeChange }));

    const sarcasticButton = screen.getByRole('button', { name: /set cringe level to sarcastic/i });
    fireEvent.keyDown(sarcasticButton, { key: 'Enter', code: 'Enter' });

    expect(mockOnCringeChange).toHaveBeenCalledWith(2);
  });

  it('should handle cringe button space key', () => {
    const mockOnCringeChange = vi.fn();
    
    render(HoroscopeControls({ ...defaultProps, onCringeChange: mockOnCringeChange }));

    const gentleButton = screen.getByRole('button', { name: /set cringe level to gentle/i });
    fireEvent.keyDown(gentleButton, { key: ' ', code: 'Space' });

    expect(mockOnCringeChange).toHaveBeenCalledWith(0);
  });

  it('should render deterministic toggle', () => {
    render(HoroscopeControls(defaultProps));

    const toggle = screen.getByRole('checkbox', { name: /enable deterministic mode/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();

    expect(screen.getByText('🎯 Deterministic Mode')).toBeInTheDocument();
    expect(screen.getByText(/same settings = same result/i)).toBeInTheDocument();
  });

  it('should show deterministic toggle as checked when deterministic is true', () => {
    render(HoroscopeControls({ ...defaultProps, deterministic: true }));

    const toggle = screen.getByRole('checkbox', { name: /enable deterministic mode/i });
    expect(toggle).toBeChecked();
  });

  it('should call onDeterministicChange when toggle is clicked', async () => {
    const user = userEvent.setup();
    const mockOnDeterministicChange = vi.fn();
    
    render(HoroscopeControls({ ...defaultProps, onDeterministicChange: mockOnDeterministicChange }));

    const toggle = screen.getByRole('checkbox', { name: /enable deterministic mode/i });
    await user.click(toggle);

    expect(mockOnDeterministicChange).toHaveBeenCalledWith(true);
  });

  it('should render all section labels', () => {
    render(HoroscopeControls(defaultProps));

    expect(screen.getByText('Choose Your Zodiac Sign')).toBeInTheDocument();
    expect(screen.getByText('When do you need the cosmic roast?')).toBeInTheDocument();
    expect(screen.getByText('How much reality can you handle?')).toBeInTheDocument();
    expect(screen.getByText('Cringe Level')).toBeInTheDocument();
  });

  it('should display cringe level descriptions', () => {
    const descriptions = [
      { value: 0, desc: 'Soft and friendly' },
      { value: 1, desc: 'Subtle sarcasm' },
      { value: 2, desc: 'Sharp and witty' },
      { value: 3, desc: 'Maximum chaos' },
    ];

    descriptions.forEach(({ value, desc }) => {
      render(HoroscopeControls({ ...defaultProps, cringe: value as Cringe }));
      
      expect(screen.getByText(desc)).toBeInTheDocument();
      
      cleanup();
    });
  });

  it('should have proper accessibility attributes for all inputs', () => {
    render(HoroscopeControls(defaultProps));

    // Day selection
    const daySelect = screen.getByRole('combobox', { name: /select day for horoscope/i });
    expect(daySelect).toHaveAttribute('aria-label', 'Select day for horoscope');

    // Mode selection
    const modeSelect = screen.getByRole('combobox', { name: /select horoscope mode/i });
    expect(modeSelect).toHaveAttribute('aria-label', 'Select horoscope mode');

    // Cringe slider
    const slider = screen.getByRole('slider', { name: /adjust cringe level/i });
    expect(slider).toHaveAttribute('aria-label', 'Adjust cringe level from gentle to hard');

    // Deterministic toggle
    const toggle = screen.getByRole('checkbox', { name: /enable deterministic mode/i });
    expect(toggle).toHaveAttribute('aria-label', 'Enable deterministic mode for consistent results');
  });

  it('should not call callbacks for other keyboard keys', () => {
    const mockCallbacks = {
      onSignChange: vi.fn(),
      onCringeChange: vi.fn(),
    };
    
    render(HoroscopeControls({ ...defaultProps, ...mockCallbacks }));

    const ariesButton = screen.getByRole('button', { name: /select aries/i });
    const gentleButton = screen.getByRole('button', { name: /set cringe level to gentle/i });

    fireEvent.keyDown(ariesButton, { key: 'Tab', code: 'Tab' });
    fireEvent.keyDown(gentleButton, { key: 'Escape', code: 'Escape' });

    expect(mockCallbacks.onSignChange).not.toHaveBeenCalled();
    expect(mockCallbacks.onCringeChange).not.toHaveBeenCalled();
  });
});
