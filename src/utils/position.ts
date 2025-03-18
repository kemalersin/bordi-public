import { ELEMENT_DEFAULT_POSITION } from "../constants/positions";

export const calculateRandomPosition = (
  items: Array<{ x: number; y: number }>,
  defaultPosition: { x: number; y: number } = ELEMENT_DEFAULT_POSITION
) => {
  let avgX = defaultPosition.x;
  let avgY = defaultPosition.y;

  if (items.length > 0) {
    avgX = items.reduce((sum, item) => sum + item.x, 0) / items.length;
    avgY = items.reduce((sum, item) => sum + item.y, 0) / items.length;
  }

  const randomOffset = () => Math.random() * 100;

  return {
    x: avgX + randomOffset(),
    y: avgY + randomOffset(),
    rotation: (Math.random() * 4) - 2 // -2 ile +2 derece arası
  };
}; 