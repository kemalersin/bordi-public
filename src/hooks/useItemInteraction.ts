import { DraggedItem, HoveredItem } from '../types/Common.types';

interface InteractionHandlers {
  onMouseEnter: (id: number, type: 'note' | 'media') => void;
  onMouseLeave: () => void;
  onDragStart: (id: number, type: 'note' | 'media') => void;
  onDrag: (id: number, type: 'note' | 'media', position: { x: number; y: number }) => void;
  onDragStop: (e: any, position: { x: number; y: number }) => Promise<void> | void;
}

export const useItemInteraction = (
  itemId: number,
  itemType: 'note' | 'media',
  draggedItemInfo: DraggedItem | null,
  isDragOverTrash: boolean,
  handlers: InteractionHandlers
) => {
  return {
    isDragOverTrash: draggedItemInfo?.id === itemId && isDragOverTrash,
    isDragging: draggedItemInfo?.id === itemId,
    onMouseEnter: () => handlers.onMouseEnter(itemId, itemType),
    onMouseLeave: handlers.onMouseLeave,
    onDragStart: () => handlers.onDragStart(itemId, itemType),
    onDrag: (position: { x: number, y: number }) => handlers.onDrag(itemId, itemType, position),
    onDragStop: handlers.onDragStop
  };
}; 