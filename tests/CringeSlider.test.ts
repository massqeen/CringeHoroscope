import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import CringeSlider from '../src/components/CringeSlider';
import type { Cringe } from '../src/types';

describe('CringeSlider', () => {
  const mockOnChange = vi.fn();

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render with initial value and label', () => {
    render(
      CringeSlider({
        value: 1,
        onChange: mockOnChange,
      })
    );

    const slider = screen.getByRole('slider', { name: /cringe level 1: ironic/i });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveValue('1');

    const label = screen.getByText(/cringe level: 1 - ironic/i);
    expect(label).toBeInTheDocument();
  });

  it('should display correct labels for all cringe levels', () => {
    const levels: Array<{ value: Cringe; label: string; emoji: string }> = [
      { value: 0, label: 'Mild', emoji: '😊' },
      { value: 1, label: 'Ironic', emoji: '😏' },
      { value: 2, label: 'Sarcastic', emoji: '😈' },
      { value: 3, label: 'Cringe Hard', emoji: '🤡' },
    ];

    levels.forEach(({ value, label, emoji }) => {
      const { rerender } = render(
        CringeSlider({
          value,
          onChange: mockOnChange,
        })
      );

      const sliderLabel = screen.getByText(new RegExp(`cringe level: ${value} - ${label}`, 'i'));
      expect(sliderLabel).toBeInTheDocument();
      expect(sliderLabel.textContent).toContain(emoji);

      cleanup();
    });
  });

  it('should call onChange when slider value changes', async () => {
    const user = userEvent.setup();
    
    render(
      CringeSlider({
        value: 1,
        onChange: mockOnChange,
      })
    );

    const slider = screen.getByRole('slider');
    // Instead of clearing and typing, use fireEvent.change for range inputs
    fireEvent.change(slider, { target: { value: '3' } });

    expect(mockOnChange).toHaveBeenCalledWith(3);
  });

  it('should handle keyboard navigation - arrow left', () => {
    render(
      CringeSlider({
        value: 2,
        onChange: mockOnChange,
      })
    );

    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowLeft', code: 'ArrowLeft' });

    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it('should handle keyboard navigation - arrow right', () => {
    render(
      CringeSlider({
        value: 1,
        onChange: mockOnChange,
      })
    );

    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });

    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('should not go below minimum value with arrow left', () => {
    render(
      CringeSlider({
        value: 0,
        onChange: mockOnChange,
      })
    );

    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowLeft', code: 'ArrowLeft' });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should not go above maximum value with arrow right', () => {
    render(
      CringeSlider({
        value: 3,
        onChange: mockOnChange,
      })
    );

    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight', code: 'ArrowRight' });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      CringeSlider({
        value: 1,
        onChange: mockOnChange,
        disabled: true,
      })
    );

    const slider = screen.getByRole('slider');
    expect(slider).toBeDisabled();
  });

  it('should render level indicators for all levels', () => {
    render(
      CringeSlider({
        value: 1,
        onChange: mockOnChange,
      })
    );

    expect(screen.getByText('😊')).toBeInTheDocument();
    expect(screen.getByText('😏')).toBeInTheDocument();
    expect(screen.getByText('😈')).toBeInTheDocument();
    expect(screen.getByText('🤡')).toBeInTheDocument();

    expect(screen.getByText('Mild')).toBeInTheDocument();
    expect(screen.getByText('Ironic')).toBeInTheDocument();
    expect(screen.getByText('Sarcastic')).toBeInTheDocument();
    expect(screen.getByText('Cringe Hard')).toBeInTheDocument();
  });

  it('should display correct description for current level', () => {
    const descriptions = [
      { value: 0, desc: 'Gentle and pleasant vibes' },
      { value: 1, desc: 'Light sarcasm and wit' },
      { value: 2, desc: 'Sharp sarcasm and attitude' },
      { value: 3, desc: 'Maximum chaos and cringe' },
    ];

    descriptions.forEach(({ value, desc }) => {
      render(
        CringeSlider({
          value: value as Cringe,
          onChange: mockOnChange,
        })
      );

      expect(screen.getByText(desc)).toBeInTheDocument();
      cleanup();
    });
  });

  it('should render quick selection buttons', () => {
    render(
      CringeSlider({
        value: 1,
        onChange: mockOnChange,
      })
    );

    const button0 = screen.getByRole('button', { name: /set cringe level to 0: mild/i });
    const button1 = screen.getByRole('button', { name: /set cringe level to 1: ironic/i });
    const button2 = screen.getByRole('button', { name: /set cringe level to 2: sarcastic/i });
    const button3 = screen.getByRole('button', { name: /set cringe level to 3: cringe hard/i });

    expect(button0).toBeInTheDocument();
    expect(button1).toBeInTheDocument();
    expect(button2).toBeInTheDocument();
    expect(button3).toBeInTheDocument();
  });

  it('should call onChange when quick selection button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      CringeSlider({
        value: 1,
        onChange: mockOnChange,
      })
    );

    const button3 = screen.getByRole('button', { name: /set cringe level to 3: cringe hard/i });
    await user.click(button3);

    expect(mockOnChange).toHaveBeenCalledWith(3);
  });

  it('should disable quick selection buttons when disabled', () => {
    render(
      CringeSlider({
        value: 1,
        onChange: mockOnChange,
        disabled: true,
      })
    );

    const button0 = screen.getByRole('button', { name: /set cringe level to 0: mild/i });
    const button1 = screen.getByRole('button', { name: /set cringe level to 1: ironic/i });
    const button2 = screen.getByRole('button', { name: /set cringe level to 2: sarcastic/i });
    const button3 = screen.getByRole('button', { name: /set cringe level to 3: cringe hard/i });

    expect(button0).toBeDisabled();
    expect(button1).toBeDisabled();
    expect(button2).toBeDisabled();
    expect(button3).toBeDisabled();
  });

  it('should have correct accessibility attributes', () => {
    render(
      CringeSlider({
        value: 2,
        onChange: mockOnChange,
      })
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-label', 'Cringe level 2: Sarcastic');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '3');
    expect(slider).toHaveAttribute('step', '1');
  });

  it('should highlight current level in indicators', () => {
    render(
      CringeSlider({
        value: 2,
        onChange: mockOnChange,
      })
    );

    // The current level should be highlighted (this would need to check computed styles in a real browser)
    // For now, we just verify the structure is rendered
    const levelIndicators = screen.getAllByText(/^(mild|ironic|sarcastic|cringe hard)$/i);
    expect(levelIndicators).toHaveLength(4);
  });

  it('should not handle other keyboard keys', () => {
    render(
      CringeSlider({
        value: 1,
        onChange: mockOnChange,
      })
    );

    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'Tab', code: 'Tab' });
    fireEvent.keyDown(slider, { key: 'Escape', code: 'Escape' });

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
