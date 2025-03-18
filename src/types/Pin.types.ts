import { Position } from './Common.types';

export interface PinData {
  id: string;
  parentId: number;
  parentType: 'note' | 'media';
  x: number; // Piksel cinsinden
  y: number; // Piksel cinsinden
  rotation: number;
}

export interface PinProps {
  pin: PinData;
  position: Position;
  isActive?: boolean;
  zIndex?: number;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onRemove: () => void;
} 