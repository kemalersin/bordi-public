import styled from 'styled-components';

export type ResizeHandlePosition = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';

export const ResizeHandleContainer = styled.div<{
  position: ResizeHandlePosition;
  isResizing: boolean;
  isVisible?: boolean;
}>`
  position: absolute;
  width: ${props => props.isResizing ? '20px' : '16px'};
  height: ${props => props.isResizing ? '20px' : '16px'};
  background-color: ${props => props.isResizing ? 'rgba(0, 120, 215, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
  border: ${props => props.isResizing ? '2px solid rgba(255, 255, 255, 0.8)' : '1.5px solid rgba(0, 0, 0, 0.4)'};
  border-radius: 50%;
  z-index: 100;
  
  /* Görünürlük: Boyutlandırma sırasında her zaman görünür, diğer durumlarda isVisible prop'una göre */
  opacity: ${props => props.isResizing ? 1 : props.isVisible === false ? 0 : 1};
  
  box-shadow: ${props => props.isResizing ? '0 0 10px rgba(0, 120, 215, 0.5)' : '0 1px 3px rgba(0, 0, 0, 0.2)'};
  
  /* Boyutlandırma sırasında geçiş efektlerini devre dışı bırak */
  transition: ${props => props.isResizing ? 'none' : 'opacity 0.15s ease, background-color 0.15s ease, width 0.1s ease, height 0.1s ease, transform 0.1s ease'};
  
  /* Boyutlandırma sırasında daha belirgin görünüm - animasyon olmadan */
  ${props => props.isResizing && `
    background-color: rgba(0, 120, 215, 1);
    border: 2px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 10px rgba(0, 120, 215, 0.5);
  `}
  
  /* Pozisyona göre konumlandırma */
  ${props => {
    switch (props.position) {
      case 'top-left':
        return `
          top: -5px;
          left: -5px;
          cursor: nw-resize;
        `;
      case 'top-right':
        return `
          top: -5px;
          right: -5px;
          cursor: ne-resize;
        `;
      case 'bottom-left':
        return `
          bottom: -5px;
          left: -5px;
          cursor: sw-resize;
        `;
      case 'bottom-right':
        return `
          bottom: -10px;
          right: -10px;
          cursor: se-resize;
          
          /* Sağ alt köşe tutamacı için özel stil */
          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${props.isResizing ? '8px' : '6px'};
            height: ${props.isResizing ? '8px' : '6px'};
            background-color: ${props.isResizing ? 'white' : 'rgba(0, 120, 215, 0.9)'};
            border-radius: 50%;
            transition: ${props.isResizing ? 'none' : 'background-color 0.15s ease'};
          }
        `;
      case 'top':
        return `
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
          cursor: n-resize;
        `;
      case 'right':
        return `
          top: 50%;
          right: -5px;
          transform: translateY(-50%);
          cursor: e-resize;
        `;
      case 'bottom':
        return `
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          cursor: s-resize;
        `;
      case 'left':
        return `
          top: 50%;
          left: -5px;
          transform: translateY(-50%);
          cursor: w-resize;
        `;
      default:
        return '';
    }
  }}
  
  /* Hover durumunda stilleri sadece boyutlandırma yapmıyorken uygula */
  ${props => !props.isResizing && `
    &:hover {
      background-color: rgba(0, 120, 215, 0.8);
      opacity: 1;
      width: 20px;
      height: 20px;
      ${props.position === 'bottom-right' ? `
        transform: translate(0, 0);
      ` : `
        transform: translate(1px, 1px);
      `}
      box-shadow: 0 0 8px rgba(0, 120, 215, 0.5);
    }
  `}
  
  &:active {
    background-color: rgba(0, 120, 215, 1);
    border-color: rgba(0, 0, 0, 0.6);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
`;

export const ResizeHandlesWrapper = styled.div<{
  isResizing?: boolean;
  isVisible?: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 99;
  
  /* Tutamaçlar için pointer-events'i aktif et */
  & > ${ResizeHandleContainer} {
    pointer-events: auto;
  }
  
  /* Görünürlük kontrolü */
  opacity: ${props => props.isResizing ? 1 : props.isVisible ? 1 : 0};
  
  /* Geçiş efekti */
  transition: ${props => props.isResizing ? 'none' : 'opacity 0.3s ease'};
`; 