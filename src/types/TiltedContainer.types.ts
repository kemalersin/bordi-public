import { DraggableEvent } from 'react-draggable';

export interface TiltedContainerProps {
  children: React.ReactNode;
  rotation: number;
  zIndex: number;
  x: number;
  y: number;
  isDisabled?: boolean;
  isDragOverTrash?: boolean;
  isResizing?: boolean;
  /** @default true */
  isVisible?: boolean;
  /** @default false */
  isLocked?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onDragStart?: () => void;
  onDrag: (position: { x: number; y: number; }) => void;
  onDragStop?: (e: DraggableEvent, position: { x: number; y: number }) => void;
} 