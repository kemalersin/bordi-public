import { useState, useCallback, useEffect } from 'react';
import { NoteData } from '../types/Note.types';
import { MediaData } from '../types/MediaFrame.types';

interface ResizeState {
  isResizing: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  currentWidth: number;
  currentHeight: number;
  resizeDirection: ResizeDirection | null;
}

type ResizeDirection = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';

interface UseResizeProps {
  itemId: number;
  itemType: 'note' | 'media';
  initialWidth: number;
  initialHeight: number;
  minWidth?: number;
  minHeight?: number;
  onResize?: (width: number, height: number) => void;
  onResizeComplete?: (width: number, height: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
}

export function useResize({
  itemId,
  itemType,
  initialWidth,
  initialHeight,
  minWidth = 100,
  minHeight = 100,
  onResize,
  onResizeComplete,
  onResizeStart,
  onResizeEnd
}: UseResizeProps) {
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidth: initialWidth,
    startHeight: initialHeight,
    currentWidth: initialWidth,
    currentHeight: initialHeight,
    resizeDirection: null
  });

  // initialWidth veya initialHeight değiştiğinde state'i güncelle
  useEffect(() => {
    if (!resizeState.isResizing) {
      setResizeState(prev => ({
        ...prev,
        startWidth: initialWidth,
        startHeight: initialHeight,
        currentWidth: initialWidth,
        currentHeight: initialHeight
      }));
    }
  }, [initialWidth, initialHeight, resizeState.isResizing]);

  // Boyutlandırma başlatma
  const handleResizeStart = useCallback((
    e: React.MouseEvent, 
    direction: ResizeDirection
  ) => {
    e.stopPropagation();
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    setResizeState(prev => ({
      ...prev,
      isResizing: true,
      startX,
      startY,
      startWidth: prev.currentWidth,
      startHeight: prev.currentHeight,
      resizeDirection: direction
    }));
    
    // Boyutlandırma başladığında callback'i çağır
    if (onResizeStart) {
      onResizeStart();
    }
    
    // Global mouse event'leri ekle
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [onResizeStart]);

  // Boyutlandırma hareketi
  const handleResizeMove = useCallback((e: MouseEvent) => {
    setResizeState(prev => {
      if (!prev.isResizing) return prev;
      
      const deltaX = e.clientX - prev.startX;
      const deltaY = e.clientY - prev.startY;
      
      // Sadece minimum boyut kontrolü yap
      const newWidth = Math.max(minWidth, prev.startWidth + deltaX);
      const newHeight = Math.max(minHeight, prev.startHeight + deltaY);
      
      // Boyut değişikliğini callback ile bildir
      if (onResize) {
        onResize(newWidth, newHeight);
      }
      
      return {
        ...prev,
        currentWidth: newWidth,
        currentHeight: newHeight
      };
    });
  }, [minWidth, minHeight, onResize]);

  // Boyutlandırma bitişi
  const handleResizeEnd = useCallback(() => {
    setResizeState(prev => {
      // Boyutlandırma tamamlandığında callback'i çağır
      if (prev.isResizing) {
        if (onResizeComplete) {
          onResizeComplete(prev.currentWidth, prev.currentHeight);
        }
        if (onResizeEnd) {
          onResizeEnd();
        }
      }
      
      return {
        ...prev,
        isResizing: false,
        resizeDirection: null
      };
    });
    
    // Global mouse event'leri kaldır
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [onResizeComplete, onResizeEnd]);

  return {
    width: resizeState.currentWidth,
    height: resizeState.currentHeight,
    isResizing: resizeState.isResizing,
    resizeDirection: resizeState.resizeDirection,
    handleResizeStart
  };
} 