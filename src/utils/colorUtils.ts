// Color utility functions for handling named colors and text contrast

// Named colors mapping to hex values for consistent CSS display
const NAMED_COLORS: Record<string, string> = {
  white: '#ffffff',
  black: '#000000',
  red: '#ff0000',
  green: '#008000',
  blue: '#0000ff',
  yellow: '#ffff00',
  cyan: '#00ffff',
  magenta: '#ff00ff',
  silver: '#c0c0c0',
  gray: '#808080',
  grey: '#808080',
  maroon: '#800000',
  olive: '#808000',
  lime: '#00ff00',
  aqua: '#00ffff',
  teal: '#008080',
  navy: '#000080',
  fuchsia: '#ff00ff',
  purple: '#800080',
  orange: '#ffa500',
  pink: '#ffc0cb',
  // Additional API colors
  bronze: '#cd7f32',
  'slate-gray': '#708090',
  'slate gray': '#708090',
  slategray: '#708090',
  lilac: '#c8a2c8',
  obsidian: '#0f1419',
  lavender: '#e6e6fa',
  gold: '#ffd700',
  // Fixed background colors
  'navy-blue': '#000080',
  amber: '#ffbf00',
  'jade-green': '#00a86b',
  mahogany: '#c04000',
  amethyst: '#9966cc',
  'sea green': '#2e8b57',
  brown: '#a52a2a',
};

/**
 * Determines if a color is considered light or dark based on its luminance
 * Uses WCAG formula for relative luminance calculation
 */
export const isLightColor = (color: string): boolean => {
  let hex = color.toLowerCase();

  // Convert named color to hex
  if (NAMED_COLORS[hex]) {
    hex = NAMED_COLORS[hex];
  }

  // Remove # if present
  hex = hex.replace('#', '');

  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // If not a valid hex, assume it's dark
  if (!/^[0-9a-f]{6}$/i.test(hex)) {
    return false;
  }

  // Calculate luminance
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance using WCAG formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if light (luminance > 0.5)
  return luminance > 0.5;
};

/**
 * Returns appropriate text color (black or white) for optimal contrast
 * against the provided background color
 */
export const getTextColor = (backgroundColor: string): string => {
  const lowerColor = backgroundColor.toLowerCase();

  // If it's an unknown color, return black text (since unknown colors display as white)
  if (!NAMED_COLORS[lowerColor] && !backgroundColor.startsWith('#')) {
    return '#000000';
  }

  // For known colors or hex colors, use the light/dark calculation
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
};

/**
 * Converts color names to valid CSS hex colors
 * Returns hex value for known colors, white for unknown colors
 */
export const getCssColor = (color: string): string => {
  const lowerColor = color.toLowerCase();

  // Return hex value if we have it, otherwise return white for unknown colors
  return NAMED_COLORS[lowerColor] || '#ffffff';
};
