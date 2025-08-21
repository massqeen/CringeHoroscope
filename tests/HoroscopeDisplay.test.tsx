import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import HoroscopeDisplay from '../src/components/HoroscopeDisplay';
import type { ZodiacSign, Day, Mode, Cringe } from '../src/types';

// Mock all the dependencies with simple implementations
vi.mock('../src/hooks/useHoroscope', () => ({
  useHoroscope: () => ({
    horoscope: null,
    loading: false,
    error: null,
    fetchHoroscope: vi.fn(),
    clearHoroscope: vi.fn(),
  }),
}));

vi.mock('../src/services/roastGenerator', () => ({
  generateRoast: vi.fn(() => ({ text: 'Mock roast' })),
}));

vi.mock('../src/services/horoscopeComposer', () => ({
  composeResult: vi.fn(() => ({ text: 'Mock result', source: 'roast' })),
}));

vi.mock('../src/utils/prng', () => ({
  generateDeterministicSeed: vi.fn(() => 12345),
}));

vi.mock('../src/components/GenerateButton', () => ({
  default: () => null,
}));

vi.mock('../src/components/LuckyElements', () => ({
  default: () => null,
}));

vi.mock('../src/components/HoroscopeDisplay.module.css', () => ({
  default: {},
}));

describe('HoroscopeDisplay', () => {
  const defaultProps = {
    sign: 'aries' as ZodiacSign,
    day: 'today' as Day,
    mode: 'roast' as Mode,
    cringe: 1 as Cringe,
    deterministic: true,
  };

  afterEach(() => {
    cleanup();
  });

  it('should render without crashing', () => {
    expect(() => {
      render(<HoroscopeDisplay {...defaultProps} />);
    }).not.toThrow();
  });

  it('should handle different modes', () => {
    expect(() => {
      render(<HoroscopeDisplay {...defaultProps} mode="official" />);
      render(<HoroscopeDisplay {...defaultProps} mode="mix" />);
      render(<HoroscopeDisplay {...defaultProps} mode="roast" />);
    }).not.toThrow();
  });

  it('should handle different deterministic settings', () => {
    expect(() => {
      render(<HoroscopeDisplay {...defaultProps} deterministic={true} />);
      render(<HoroscopeDisplay {...defaultProps} deterministic={false} />);
    }).not.toThrow();
  });

  it('should handle loading state', () => {
    expect(() => {
      render(<HoroscopeDisplay {...defaultProps} isLoading={true} />);
    }).not.toThrow();
  });
});
