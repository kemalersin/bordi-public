import { PinData } from './Pin.types';

export interface RopeSegment {
  id: string;
  startPin: PinData;
  endPin: PinData;
  points: { x: number; y: number; vx?: number; vy?: number }[];
  color: string;
  zIndex?: number;
}

export interface ConnectionLineProps {
  rope: RopeSegment;
  zIndex?: number;
} 