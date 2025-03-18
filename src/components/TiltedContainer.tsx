import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';

import { TiltedContainerProps } from '../types/TiltedContainer.types';
import { TiltedContainer as StyledTiltedContainer } from '../styles/TiltedContainer.styles';

export const TiltedContainer: React.FC<TiltedContainerProps> = ({
    children,
    rotation,
    zIndex,
    x,
    y,
    isDisabled,
    isDragOverTrash,
    isResizing,
    isLocked,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragStop
}) => {
    const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
        if (onDragStop) {
            onDragStop(e, {
                x: data.x,
                y: data.y
            });
        }
    };

    const handleDragStart = (e: DraggableEvent) => {
        // Menü düğmesine tıklandıysa sürüklemeyi engelle
        const target = e.target as HTMLElement;
        if (target.hasAttribute('data-no-drag') || target.closest('[data-no-drag="true"]')) {
            return false; // Sürüklemeyi engelle
        }
        
        // Not kilitli olsa bile sürüklemeye izin ver
        if (onDragStart) {
            onDragStart();
        }
    };

    const handleDrag = (_e: DraggableEvent, data: { x: number; y: number; }) => {
        onDrag({ x: data.x, y: data.y });
    };

    return (
        <Draggable
            position={{ x, y }}
            onStop={handleDragStop}
            onStart={handleDragStart}
            onDrag={handleDrag}
            disabled={isDisabled}
        >
            <StyledTiltedContainer
                rotation={rotation}
                zIndex={zIndex}
                isDragOverTrash={isDragOverTrash}
                isResizing={isResizing}
                isLocked={isLocked}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {children}
            </StyledTiltedContainer>
        </Draggable>
    );
};