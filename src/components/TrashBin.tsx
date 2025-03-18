/**
 * TrashBin.tsx
 * Çöp Kutusu Bileşeni
 * 
 * Özellikler:
 * 1. Sürükle-bırak hedefi
 * 2. Görsel geri bildirim
 * 3. Animasyonlu geçişler
 * 4. Duruma bağlı görünürlük
 * 5. Performans optimizasyonu
 */

import React from 'react';

import { TrashBinProps } from '../types/TrashBin.types';
import { TrashContainer } from '../styles/TrashBin.styles';

import trashIcon from '../assets/trash-can.png';

/**
 * Çöp Kutusu Bileşeni
 * 
 * Özellikler:
 * 1. Görünürlük kontrolü
 * 2. Sürükleme durumu gösterimi
 * 3. Hover efekti (1.1x scale)
 * 4. Sürükleme üzeri efekti (1.2x scale)
 * 5. Performans optimizasyonu:
 *    - Görünmez durumda etkileşimleri devre dışı bırakma
 *    - CSS transform kullanımı
 *    - Gereksiz render'ları engelleme
 */
export const TrashBin: React.FC<TrashBinProps> = ({ isDragOver, isVisible }) => {
  return (
    <TrashContainer 
      className={`trash-bin ${isDragOver ? 'drag-over' : ''}`} 
      isVisible={isVisible}
    >
      {/* Çöp Kutusu Görseli */}
      <img src={trashIcon} alt="trash" draggable={false} />
    </TrashContainer>
  );
}; 