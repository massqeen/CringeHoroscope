import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import GenerateButton from '../src/components/GenerateButton';

// Mock CSS modules
vi.mock('../src/components/GenerateButton.module.css', () => ({
  default: {
    generateButtonContainer: 'generateButtonContainer',
    generateButton: 'generateButton',
  },
}));

describe('GenerateButton', () => {
  const mockOnGenerate = vi.fn();

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render button with correct text when not loading', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: false,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Generate My Cosmic Roast');
    expect(button).not.toBeDisabled();
  });

  it('should render loading state correctly', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: true,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Consulting the cosmic forces...');
    expect(button).toBeDisabled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: false,
        disabled: true,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    expect(button).toBeDisabled();
  });

  it('should be disabled when both loading and disabled are true', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: true,
        disabled: true,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    expect(button).toBeDisabled();
  });

  it('should call onGenerate when clicked', async () => {
    const user = userEvent.setup();
    
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: false,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    await user.click(button);

    expect(mockOnGenerate).toHaveBeenCalledOnce();
  });

  it('should not call onGenerate when disabled', async () => {
    const user = userEvent.setup();
    
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: false,
        disabled: true,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    await user.click(button);

    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it('should not call onGenerate when loading', async () => {
    const user = userEvent.setup();
    
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: true,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    await user.click(button);

    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it('should handle keyboard interactions - Enter key', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: false,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

    expect(mockOnGenerate).toHaveBeenCalledOnce();
  });

  it('should handle keyboard interactions - Space key', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: false,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });

    expect(mockOnGenerate).toHaveBeenCalledOnce();
  });

  it('should not handle other keyboard keys', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: false,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    fireEvent.keyDown(button, { key: 'Tab', code: 'Tab' });

    expect(mockOnGenerate).not.toHaveBeenCalled();
  });

  it('should have correct accessibility attributes', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: false,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    expect(button).toHaveAttribute('aria-label', 'Generate your sarcastic horoscope');
    expect(button).toHaveAttribute('tabindex', '0');
  });

  it('should have correct cursor style when disabled', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: false,
        disabled: true,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    expect(button).toHaveStyle({ cursor: 'not-allowed' });
  });

  it('should have correct cursor style when loading', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: true,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    expect(button).toHaveStyle({ cursor: 'not-allowed' });
  });

  it('should have correct cursor style when enabled', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: false,
        disabled: false,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    expect(button).toHaveStyle({ cursor: 'pointer' });
  });

  it('should render loading spinner when loading', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: true,
      })
    );

    const loadingSpinner = screen.getByText('', { selector: '.loading' });
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('should render emojis in normal state', () => {
    render(
      GenerateButton({
        onGenerate: mockOnGenerate,
        isLoading: false,
      })
    );

    const button = screen.getByRole('button', { name: /generate your sarcastic horoscope/i });
    expect(button.textContent).toContain('✨');
    expect(button.textContent).toContain('🔥');
  });
});
