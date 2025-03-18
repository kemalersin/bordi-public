import styled from 'styled-components';

export const TiltedContainer = styled.div.attrs({
    className: 'tilted-container'
}) <{ rotation: number; zIndex: number; isDragOverTrash?: boolean; isResizing?: boolean; isVisible?: boolean; isLocked?: boolean }>`  
  position: absolute;
  z-index: ${props => props.isDragOverTrash ? 10000 : props.zIndex};
  display: ${props => props.isVisible === false ? 'none' : 'block'};  
  & > * { 
    opacity: ${props => props.isDragOverTrash ? 0.5 : 1};
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;

    transform: rotate(${props => props.isResizing ? 0 : props.rotation}deg);
    
    /* Kilitli durum için özel stil - tarih kısmında gösterileceği için kaldırılıyor */
    ${props => props.isLocked && ``}

    &:hover {
      transform: rotate(0deg);
    }
  }    
`;
