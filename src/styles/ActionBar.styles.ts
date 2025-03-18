import styled from 'styled-components';

/**
 * Araç Çubuğu Alan Stili
 * 
 * - Sabit konumlandırma (alt)
 * - Tam genişlik
 * - 80px yükseklik
 * - Alt boşluk (20px)
 * - Merkezi hizalama
 */
export const BarArea = styled.div<{ isVisible: boolean; itemsVisible: boolean }>`
  position: fixed;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  pointer-events: ${props => props.itemsVisible ? 'auto' : 'none'};
`;

/**
 * Araç Çubuğu Konteyner Stili
 * 
 * Özellikler:
 * - Yarı saydam beyaz arka plan
 * - Yuvarlak köşeler (30px)
 * - Gölge efekti
 * - Yumuşak geçişler (0.3s)
 * - Görünürlük durumuna göre:
 *   1. Görünür: opacity 1, scale 1, translateY 0
 *   2. Gizli: opacity 0, scale 0.95, translateY 20px
 */
export const Bar = styled.div<{ isVisible: boolean; itemsVisible: boolean }>`
  background: var(--bar-bg, rgba(255, 255, 255, 0.8));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 30px;
  padding: 10px;
  display: flex;
  gap: 10px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15),
              0 2px 8px rgba(0, 0, 0, 0.08),
              0 0 1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.35);
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: scale(${props => props.isVisible ? 1 : 0.95}) translateY(${props => props.isVisible ? '0' : '20px'});
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: ${props => (props.isVisible && props.itemsVisible) ? 'auto' : 'none'};

  @media (prefers-color-scheme: dark) {
    background: rgba(51, 51, 51, 0.8);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3),
                0 2px 8px rgba(0, 0, 0, 0.2),
                0 0 1px rgba(0, 0, 0, 0.2);
  }
`;

/**
 * Eylem Düğmesi Stili
 * 
 * Özellikler:
 * - Dairesel şekil (40x40px)
 * - Durum gösterimi (aktif/pasif)
 * - Hover ve aktif durumlar
 * - İkon boyutlandırma (20x20px)
 * - Özel renk desteği
 */
export const ActionButton = styled.button<{ isActive?: boolean; color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || 'var(--button-color, #333)'};
  background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.5)' : 'transparent'};
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease-in-out;
  transform: scale(1);

  &[data-tooltip] {
    &:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: calc(100% + 4px);
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      animation: showTooltip 0.3s ease forwards;
      animation-delay: 0.5s;
      pointer-events: none;
    }
  }

  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.15s ease-in;
  }

  &:active {
    background: rgba(255, 255, 255, 0.65);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    transform: scale(0.95);
    transition: all 0.1s ease-in;
  }

  &:not(:hover) {
    transition: all 0.3s ease-out;
  }

  @keyframes showTooltip {
    from {
      opacity: 0;
      transform: translate(-50%, 10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  @media (prefers-color-scheme: dark) {
    color: ${props => props.color || '#fff'};
    background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.35)' : 'transparent'};

    &:hover {
      background: rgba(255, 255, 255, 0.35);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    &:active {
      background: rgba(255, 255, 255, 0.45);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      transform: scale(0.95);
    }

    &[data-tooltip] {
      &:hover::after {
        background: rgba(255, 255, 255, 0.9);
        color: #333;
      }
    }
  }
`;

/**
 * Ayırıcı Çizgi Stili
 */
export const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: rgba(0, 0, 0, 0.1);
  margin: 8px 5px;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.1);
  }
`;