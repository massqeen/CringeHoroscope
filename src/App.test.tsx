import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('🌟 Cringe Horoscope')).toBeInTheDocument();
  });

  it('renders the app subtitle', () => {
    render(<App />);
    expect(screen.getByText('Your daily dose of sarcastic stars ✨')).toBeInTheDocument();
  });

  it('renders the generate horoscope section', () => {
    render(<App />);
    expect(screen.getByText('Generate Your Sarcastic Horoscope')).toBeInTheDocument();
  });

  it('renders the production/dev mode toggle', () => {
    render(<App />);
    expect(screen.getByText('Production')).toBeInTheDocument();
    expect(screen.getByText('Dev Mode')).toBeInTheDocument();
  });
});
