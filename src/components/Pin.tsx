/**
 * Pin.tsx
 * Raptiye Bileşeni
 * 
 * Özellikler:
 * 1. Sürüklenebilir
 * 2. Bağlantı noktası
 * 3. Görsel efektler
 * 4. Sağ tık ile silme
 * 5. Aktif durum gösterimi
 */

import React from 'react';

import { PinProps } from '../types/Pin.types';
import { Pin as StyledPin } from '../styles/Pin.styles';

import pinIcon from '../assets/pin.png';

/**
 * Pin Bileşeni
 * 
 * Özellikler:
 * 1. Merkez noktasından konumlandırma
 * 2. Rotasyon desteği
 * 3. Aktif durum gösterimi (1.2x scale)
 * 4. Hover efekti (1.1x scale)
 * 5. Sağ tık ile silme
 */
export const Pin: React.FC<PinProps> = ({
  pin,
  position,
  isActive,
  onMouseDown,
  onMouseUp,
  onRemove,
}) => {
  /**
   * Fare İşleyicileri
   * 
   * 1. stopPropagation ile event yayılımını engelle
   * 2. Sağ tık menüsünü engelle (preventDefault)
   * 3. Üst bileşene olayları ilet
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMouseDown();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMouseUp();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRemove();
  };

  // Pin pozisyonu (piksel cinsinden)
  const pinStyle = {
    left: `${pin.x}px`,
    top: `${pin.y}px`,
  };

  return (
    <StyledPin
      className="pin"
      style={pinStyle}
      isActive={isActive}
      rotation={position.rotation}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      {/* Pin Görseli */}
      <img src={pinIcon} alt="pin" draggable={false} />
    </StyledPin>
  );
};
