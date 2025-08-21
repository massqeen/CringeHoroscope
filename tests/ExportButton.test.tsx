import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import ExportButton from '../src/components/ExportButton';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn(() =>
    Promise.resolve({
      toDataURL: vi.fn(() => 'data:image/png;base64,mock-image-data'),
      toBlob: vi.fn((callback) => callback(new Blob(['mock'], { type: 'image/png' }))),
    }),
  ),
}));

// Mock CSS module
vi.mock('../src/components/ExportButton.module.css', () => ({
  default: {
    exportButton: 'exportButton',
    exporting: 'exporting',
  },
}));

// Mock window.alert
const mockAlert = vi.fn();
Object.defineProperty(window, 'alert', {
  value: mockAlert,
  writable: true,
});

// Mock URL methods
Object.defineProperty(URL, 'createObjectURL', {
  value: vi.fn(() => 'mock-url'),
  writable: true,
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: vi.fn(),
  writable: true,
});

describe('ExportButton', () => {
  const defaultProps = {
    targetElementId: 'test-element',
    filename: 'test-horoscope',
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAlert.mockClear();

    // Create test element in DOM
    const testElement = document.createElement('div');
    testElement.id = 'test-element';
    testElement.innerHTML = '<p>Test content</p>';
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    cleanup();

    // Clean up test element
    const testElement = document.getElementById('test-element');
    if (testElement) {
      testElement.remove();
    }
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
    expect(button).toHaveClass('exportButton');
  });

  it('should use default filename when not provided', () => {
    const propsWithoutFilename = {
      targetElementId: 'test-element',
    };

    render(<ExportButton {...propsWithoutFilename} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should handle keyboard events without triggering export for non-trigger keys', () => {
    render(<ExportButton {...defaultProps} />);

    const button = screen.getByRole('button');

    // Test that non-trigger keys don't cause issues
    fireEvent.keyDown(button, { key: 'Tab' });
    fireEvent.keyDown(button, { key: 'Escape' });

    // Button should still be functional
    expect(button).toBeInTheDocument();
    expect(mockAlert).not.toHaveBeenCalled();
  });
});
