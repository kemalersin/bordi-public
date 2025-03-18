import styled from 'styled-components';

/**
 * MediaFrame Bileşeni
 * Fotoğraf çerçevesi görünümü
 * 
 * Props:
 * @param isDragging - Sürükleme durumu
 * 
 * Özellikler:
 * - Minimum boyutlar
 * - Stil bazlı gölge efektleri
 * - Vintage efektleri
 * - Hover animasyonları
 * - Boyutlandırma kontrolü
 */
export const MediaFrame = styled.div.attrs({
  className: 'media-frame'
})<{ 
  isDragging?: boolean; 
  type?: 'image' | 'video'; 
  isLocalVideo?: boolean; 
  isVisible?: boolean;
  isResizing?: boolean;
}>`
  background: ${props => props.isLocalVideo ? 'transparent' : 'var(--frame-bg, #ffffff)'};
  padding: ${props => {
    if (props.type === 'image') return '15px 15px 40px 15px';
    if (props.type === 'video' && !props.isLocalVideo) return '15px 15px 40px 15px';
    return '0';
  }};  
  position: relative;
  box-shadow: 0 2px 4px var(--shadow-color, rgba(0,0,0,0.2));
  cursor: default;
  will-change: transform;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;    

  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
  
  /* Boyutlandırma sırasında içeriğin görünümünü iyileştir */
  ${props => props.isResizing && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(200, 200, 255, 0.2);
      pointer-events: none;
      z-index: 5;
    }
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
  
  ${props => !props.isDragging && !props.isResizing && `
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    
    &:hover {
      box-shadow: 0 8px 16px var(--hover-shadow-color, rgba(0,0,0,0.3));
    }
  `}

  .react-player {
    overflow: hidden;
    
    video {
      object-fit: contain;
    }
  }

  @media (prefers-color-scheme: dark) {
    --frame-bg: rgba(42, 42, 42, 0.95);
    --shadow-color: rgba(0,0,0,0.4);
    --inner-shadow-color: rgba(0,0,0,0.2);
    --hover-shadow-color: rgba(0,0,0,0.5);
    --vintage-overlay: rgba(255,255,255,0.03);
  }

  @media (prefers-color-scheme: light) {
    --frame-bg: rgba(255, 255, 255, 0.95);
    --shadow-color: rgba(0,0,0,0.2);
    --inner-shadow-color: rgba(0,0,0,0.1);
    --hover-shadow-color: rgba(0,0,0,0.3);
    --vintage-overlay: rgba(0,0,0,0.03);
  }
`;

export const StyledImage = styled.img.attrs({
  draggable: false
})`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: none;
  overflow: hidden;
`;

export const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;  
  
  .react-player {
    overflow: hidden;
    
    video {
      object-fit: contain;
    }
  }
`;

export const VideoControlButton = styled.div.attrs({
  className: 'video-control-button'
})`
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
  opacity: 0.8;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

export const PlayerWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const ChildrenWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;   
  
  pointer-events: none;
  z-index: 2;

  > * {
    pointer-events: auto;
  }
`;

/**
 * Kilit düğmesi
 */
export const LockButton = styled.button<{ isDragging: boolean; isHovering: boolean; isLocked?: boolean }>`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: ${props => props.isLocked 
    ? 'var(--lock-button-active-bg, rgba(33, 150, 243, 0.9))' 
    : 'var(--lock-button-bg, rgba(255, 255, 255, 0.9))'};
  color: ${props => props.isLocked 
    ? 'var(--lock-button-active-color, #ffffff)' 
    : 'var(--lock-button-color, #333)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.isHovering && !props.isDragging ? 1 : 0};
  transition: opacity 0.3s ease, transform 0.1s ease, background-color 0.2s ease;
  z-index: 10;

  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.isLocked 
      ? 'var(--lock-button-active-color, #ffffff)' 
      : 'var(--lock-button-color, #333)'};
  }

  &:active {
    transform: scale(0.9);
  }

  &:hover {
    background: ${props => props.isLocked 
      ? 'var(--lock-button-active-hover-bg, rgba(33, 150, 243, 0.8))' 
      : 'var(--lock-button-hover-bg, rgba(250, 250, 250, 0.9))'};
  }

  @media (prefers-color-scheme: dark) {
    --lock-button-bg: rgba(50, 50, 50, 0.9);
    --lock-button-color: #fff;
    --lock-button-active-bg: rgba(33, 150, 243, 0.9);
    --lock-button-active-color: #fff;
    --lock-button-active-hover-bg: rgba(33, 150, 243, 0.8);
    --lock-button-hover-bg: rgba(70, 70, 70, 0.9);
  }
`; 