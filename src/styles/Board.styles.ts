import styled from 'styled-components';

interface BoardProps {
  isInitialRender?: boolean;
}

/**
 * Board Bileşeni
 * Ana uygulama konteyneri
 * 
 * Özellikler:
 * - Tam ekran boyutları
 * - Şeffaf arkaplan
 * - Taşma kontrolü
 * - Seçici pointer-events yönetimi
 */
export const Board = styled.div<BoardProps>`
  width: 100vw;
  height: 100vh;
  background: transparent;
  position: relative;
  overflow: hidden;
  transition: ${props => props.isInitialRender ? 'none' : `
    background 0.3s ease-in-out,
    background-image 0.3s ease-in-out,
    background-color 0.3s ease-in-out
  `};
  will-change: background, background-image, background-color;

  & > * {
    pointer-events: none;
  }

  & > .clickable-area,
  & > .favorite-boards-area,
  & > .action-bar-area {    
    pointer-events: auto;
  }
`;

/**
 * ClickableArea Bileşeni
 * Props:
 * @param isVisible - Görünürlük durumu
 * @param isHiding - Gizlenme animasyonu durumu
 * 
 * Özellikler:
 * 1. Görünürlük animasyonları (opacity ve scale)
 * 2. Otomatik pointer-events yönetimi
 * 3. Smooth geçiş efektleri
 */
export const ClickableArea = styled.div.attrs({
  className: 'clickable-area'
})<{ isVisible: boolean; isHiding: boolean }>`
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: scale(${props => props.isVisible ? 1 : 0.95});
  transform-origin: center center;
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: ${props => props.isVisible 
    ? 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out, visibility 0s linear' 
    : 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out, visibility 0s linear 0.3s'
  };
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  will-change: opacity, transform, visibility;
`;