export const BACKGROUND_TYPES = {
  TRANSPARENT: 'transparent',
  COLOR: 'color',
  IMAGE: 'image'
} as const;

export const BACKGROUND_COLORS = {
  TRANSPARENT_PATTERN: 'repeating-conic-gradient(rgba(255, 255, 255, 0.8) 0% 25%, rgba(0, 0, 0, 0.1) 0% 50%)',
  BLACK: 'rgba(0, 0, 0, 1)',
  GRAY: 'rgba(128, 128, 128, 1)',
  WHITE: 'rgba(255, 255, 255, 1)',
  WHEAT: 'rgba(245, 222, 179, 1)',
  IMAGE_PLACEHOLDER: 'rgba(255, 255, 255, 0.1)'
} as const; 