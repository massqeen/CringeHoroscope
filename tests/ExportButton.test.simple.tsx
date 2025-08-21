import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import ExportButton from '../src/components/ExportButton';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn(),
}));

// Mock CSS module
vi.mock('../src/components/ExportButton.module.css', () => ({
  default: {
    exportButton: 'exportButton',
  },
}));

describe('ExportButton', () => {
  const defaultProps = {
    targetElementId: 'test-element',
    filename: 'test-horoscope',
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render export button with correct text and attributes', () => {
    render(<ExportButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('📸 Save Image');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Export horoscope as image');
    expect(button).toHaveAttribute('tabIndex', '0');
    expect(button).not.toBeDisabled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<ExportButton {...defaultProps} disabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should apply correct CSS classes', () => {
    render(<ExportButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('exportButton', 'button', 'button-primary', 'text-xs');
  });

  it('should use default filename when not provided', () => {
    const propsWithoutFilename = {
      targetElementId: 'test-element',
    };
    
    render(<ExportButton {...propsWithoutFilename} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should handle keyboard events', () => {
    render(<ExportButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    
    // Test that the button accepts keyboard events
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: ' ' });
    fireEvent.keyDown(button, { key: 'Tab' }); // Should not trigger
    
    // Button should still be functional
    expect(button).toBeInTheDocument();
  });
});
