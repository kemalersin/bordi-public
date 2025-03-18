import styled from 'styled-components';

/**
 * Pin Bileşeni
 * Raptiye görünümü
 * 
 * Props:
 * @param isActive - Aktif durum
 * @param rotation - Dönüş açısı
 * @param zIndex - Z-index
 * 
 * Özellikler:
 * - Merkez noktasından konumlandırma (transform-origin: center)
 * - Negatif offset ile merkezleme (transform: translate(-50%, -50%))
 * - Hover ve aktif durum animasyonları
 * - Gölge efekti (drop-shadow)
 */
export const Pin = styled.div<{ isActive?: boolean; rotation?: number; zIndex?: number }>`
  position: absolute;
  width: 24px;
  height: 24px;
  cursor: pointer;
  z-index: ${props => props.zIndex || 1};
  transform-origin: center;
  transition: transform 0.2s ease;
  pointer-events: all;
  transform: translate(-50%, -50%);  

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.2s ease;
    transform: ${props => `rotate(${props.rotation || 0}deg) scale(${props.isActive ? 1.2 : 1})`};
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  &:hover img {
    transform: ${props => `rotate(${props.rotation || 0}deg) scale(1.1)`};
  }
`; 