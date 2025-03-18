import styled from 'styled-components';

// Boyutlandırma sırasında fare imlecini değiştirmek için global stil
export const GlobalResizeStyle = styled.div<{
  isResizing: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  z-index: 1000;
  pointer-events: ${props => props.isResizing ? 'auto' : 'none'};
  cursor: se-resize;
  display: ${props => props.isResizing ? 'block' : 'none'};
  background-color: transparent;
`;

// Boyutlandırılabilir konteyner
export const ResizableContainer = styled.div<{
  width: number;
  height: number;
  isResizing: boolean;
  isVisible: boolean;
  isLocalVideo?: boolean;
}>`
  position: relative;
  width: ${props => props.width - 2}px;
  height: ${props => props.height - 2}px;  
  display: ${props => props.isVisible ? 'block' : 'none'};
  
  /* Lokal video için arkaplan rengi */
  background-color: ${props => props.isLocalVideo
    ? props.isResizing ? 'transparent' : '#000000'
    : props.isResizing ? 'rgba(200, 200, 255, 0.2)' : 'transparent'
  };
  
  ${({ isResizing, width, height }) => isResizing && `
    width: ${width + 2}px !important;
    height: ${height + 2}px !important;
  `}
  
  /* Boyutlandırma sırasında görsel geri bildirim */
  ${({ isResizing }) => isResizing && `
    border: 2px dashed rgba(100, 100, 255, 0.7);
    box-shadow: 0 0 15px rgba(0, 0, 255, 0.15);
    backdrop-filter: blur(2px);
    z-index: 5;
    transition: none;
  `}
`;

// İçerik sarmalayıcı
export const ContentWrapper = styled.div<{
  isResizing: boolean;
}>`
  position: absolute;
  left: -1px;
  top: -1px;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  /* Boyutlandırma sırasında içeriği silikleştir */
  opacity: ${props => props.isResizing ? 0.5 : 1};
  filter: ${props => props.isResizing ? 'blur(1px)' : 'none'};
  transition: ${props => props.isResizing ? 'none' : 'opacity 0.2s ease, filter 0.2s ease'};
  
  /* Boyutlandırma sırasında içeriğin üzerine hafif bir katman ekle */
  ${props => props.isResizing && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(200, 200, 255, 0.2), rgba(100, 100, 255, 0.2));
      pointer-events: none;
      z-index: 2;
      border-radius: 4px;
    }
  `}
`;

// Boyut bilgisi etiketi
export const SizeTooltip = styled.div<{
  isVisible: boolean;
}>`
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  pointer-events: none;
  z-index: 10;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translate(-10px, -10px);
  transition: ${props => props.isVisible ? 'none' : 'opacity 0.2s ease-in-out'};
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  /* Görünür olduğunda sabit stil */
  ${props => props.isVisible && `
    box-shadow: 0 0 8px rgba(100, 100, 255, 0.5);
  `}
`; 