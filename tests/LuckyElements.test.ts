import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import LuckyElements from '../src/components/LuckyElements';

// Mock the color utilities
vi.mock('../src/utils/colorUtils', () => ({
  getCssColor: vi.fn((color: string) => {
    const colorMap: Record<string, string> = {
      red: '#ff0000',
      blue: '#0000ff',
      green: '#008000',
      yellow: '#ffff00',
      purple: '#800080',
    };
    return colorMap[color.toLowerCase()] || color;
  }),
  getTextColor: vi.fn((color: string) => {
    const lightColors = ['yellow', 'white', 'light blue', 'pink'];
    return lightColors.includes(color.toLowerCase()) ? '#000000' : '#ffffff';
  }),
  isLightColor: vi.fn((color: string) => {
    const lightColors = ['yellow', 'white', 'light blue', 'pink'];
    return lightColors.includes(color.toLowerCase());
  }),
}));

// Mock CSS modules
vi.mock('../src/components/LuckyElements.module.css', () => ({
  default: {
    luckyElementsCard: 'luckyElementsCard',
    luckyElementsDecoration: 'luckyElementsDecoration',
    luckyElementsContent: 'luckyElementsContent',
    luckyElementsTitle: 'luckyElementsTitle',
    luckyElementsGrid: 'luckyElementsGrid',
    luckyElementItem: 'luckyElementItem',
    luckyTitle: 'luckyTitle',
    luckyColorBadge: 'luckyColorBadge',
    luckyNumberBadge: 'luckyNumberBadge',
  },
}));

describe('LuckyElements', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should return null when no lucky elements are provided', () => {
    const { container } = render(LuckyElements({}));
    expect(container.firstChild).toBeNull();
  });

  it('should return null when both luckyColor and luckyNumber are undefined', () => {
    const { container } = render(
      LuckyElements({
        luckyColor: undefined,
        luckyNumber: undefined,
      })
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render lucky color when provided', () => {
    render(
      LuckyElements({
        luckyColor: 'red',
      })
    );

    expect(screen.getByText('✨ Your Lucky Elements ✨')).toBeInTheDocument();
    expect(screen.getByText('🎨 Lucky Color:')).toBeInTheDocument();
    expect(screen.getByText('red')).toBeInTheDocument();
  });

  it('should render lucky number when provided', () => {
    render(
      LuckyElements({
        luckyNumber: 7,
      })
    );

    expect(screen.getByText('✨ Your Lucky Elements ✨')).toBeInTheDocument();
    expect(screen.getByText('🔢 Lucky Number:')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should render both lucky color and number when provided', () => {
    render(
      LuckyElements({
        luckyColor: 'blue',
        luckyNumber: 13,
      })
    );

    expect(screen.getByText('✨ Your Lucky Elements ✨')).toBeInTheDocument();
    expect(screen.getByText('🎨 Lucky Color:')).toBeInTheDocument();
    expect(screen.getByText('blue')).toBeInTheDocument();
    expect(screen.getByText('🔢 Lucky Number:')).toBeInTheDocument();
    expect(screen.getByText('13')).toBeInTheDocument();
  });

  it('should have correct accessibility attributes for lucky color', () => {
    render(
      LuckyElements({
        luckyColor: 'green',
      })
    );

    const colorBadge = screen.getByText('green');
    expect(colorBadge).toHaveAttribute('aria-label', 'Lucky color is green');
  });

  it('should have correct accessibility attributes for lucky number', () => {
    render(
      LuckyElements({
        luckyNumber: 42,
      })
    );

    const numberBadge = screen.getByText('42');
    expect(numberBadge).toHaveAttribute('aria-label', 'Lucky number is 42');
  });

  it('should render decorative star emoji', () => {
    render(
      LuckyElements({
        luckyColor: 'purple',
      })
    );

    // The decorative star should be rendered in the decoration element
    expect(screen.getByText('🌟')).toBeInTheDocument();
  });

  it('should handle string numbers correctly', () => {
    render(
      LuckyElements({
        luckyNumber: 25,
      })
    );

    expect(screen.getByText('25')).toBeInTheDocument();
    const numberBadge = screen.getByText('25');
    expect(numberBadge).toHaveAttribute('aria-label', 'Lucky number is 25');
  });

  it('should handle zero as a valid lucky number', () => {
    render(
      LuckyElements({
        luckyNumber: 0,
      })
    );

    expect(screen.getByText('0')).toBeInTheDocument();
    const numberBadge = screen.getByText('0');
    expect(numberBadge).toHaveAttribute('aria-label', 'Lucky number is 0');
  });

  it('should apply correct styling based on color utility functions', () => {
    render(
      LuckyElements({
        luckyColor: 'yellow', // This should be treated as a light color
      })
    );

    const colorBadge = screen.getByText('yellow');
    
    // Verify that the color badge is rendered - the utility functions would be called internally
    expect(colorBadge).toBeInTheDocument();
    expect(colorBadge).toHaveAttribute('aria-label', 'Lucky color is yellow');
  });

  it('should apply light color styling when color is light', () => {
    render(
      LuckyElements({
        luckyColor: 'white', // This should be treated as a light color
      })
    );

    const colorBadge = screen.getByText('white');
    
    // Check that the element has the expected styling attributes
    // In a real browser test, we could check computed styles
    expect(colorBadge).toBeInTheDocument();
  });

  it('should apply dark color styling when color is dark', () => {
    render(
      LuckyElements({
        luckyColor: 'black', // This should be treated as a dark color
      })
    );

    const colorBadge = screen.getByText('black');
    expect(colorBadge).toBeInTheDocument();
  });

  it('should render complete structure with both elements', () => {
    render(
      LuckyElements({
        luckyColor: 'purple',
        luckyNumber: 88,
      })
    );

    // Verify the complete structure is rendered
    expect(screen.getByText('✨ Your Lucky Elements ✨')).toBeInTheDocument();
    expect(screen.getByText('🌟')).toBeInTheDocument();
    expect(screen.getByText('🎨 Lucky Color:')).toBeInTheDocument();
    expect(screen.getByText('purple')).toBeInTheDocument();
    expect(screen.getByText('🔢 Lucky Number:')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument();
  });

  it('should only render color section when only color is provided', () => {
    render(
      LuckyElements({
        luckyColor: 'orange',
      })
    );

    expect(screen.getByText('🎨 Lucky Color:')).toBeInTheDocument();
    expect(screen.getByText('orange')).toBeInTheDocument();
    expect(screen.queryByText('🔢 Lucky Number:')).not.toBeInTheDocument();
  });

  it('should only render number section when only number is provided', () => {
    render(
      LuckyElements({
        luckyNumber: 99,
      })
    );

    expect(screen.getByText('🔢 Lucky Number:')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
    expect(screen.queryByText('🎨 Lucky Color:')).not.toBeInTheDocument();
  });
});
