import React from 'react';
import { ResizeHandleContainer, ResizeHandlePosition, ResizeHandlesWrapper } from '../styles/ResizeHandle.styles';

interface ResizeHandleProps {
  position: ResizeHandlePosition;
  isResizing: boolean;
  isVisible?: boolean;
  onResizeStart: (e: React.MouseEvent, position: ResizeHandlePosition) => void;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  position,
  isResizing,
  isVisible = true,
  onResizeStart
}) => {
  return (
    <ResizeHandleContainer
      position={position}
      isResizing={isResizing}
      isVisible={isVisible}
      onMouseDown={(e) => onResizeStart(e, position)}
    />
  );
};

interface ResizeHandlesProps {
  isResizing: boolean;
  isVisible?: boolean;
  onResizeStart: (e: React.MouseEvent, position: ResizeHandlePosition) => void;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  isResizing,
  isVisible = true,
  onResizeStart
}) => {
  return (
    <ResizeHandlesWrapper 
      isResizing={isResizing}
      isVisible={isVisible}
    >
      {/* Sadece sağ alt köşe tutamacı */}
      <ResizeHandle
        position="bottom-right"
        isResizing={isResizing}
        isVisible={isVisible}
        onResizeStart={onResizeStart}
      />
    </ResizeHandlesWrapper>
  );
}; 