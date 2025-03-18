/**
 * ConnectionLine.tsx
 * Bağlantı Çizgisi Bileşeni
 * 
 * Özellikler:
 * 1. SVG tabanlı çizim
 * 2. Bezier eğrileri
 * 3. Gölge efekti
 * 4. Yumuşak geçişler
 * 5. Performans optimizasyonu
 */

import React from 'react';

import { ConnectionLineProps } from '../types/ConnectionLine.types';
import { ConnectionLineSvg, ConnectionPath } from '../styles/ConnectionLine.styles';

/**
 * Bağlantı Çizgisi Bileşeni
 * 
 * SVG ve Bezier eğrileri kullanarak iki nokta arasında
 * yumuşak bir ip görünümü oluşturur.
 * 
 * Özellikler:
 * 1. Çoklu nokta desteği
 * 2. Quadratic Bezier eğrileri
 * 3. Otomatik kontrol noktaları
 * 4. Yumuşak geçişler
 */
export const ConnectionLine: React.FC<ConnectionLineProps> = ({ rope, zIndex }) => {
  // Bezier eğrisi oluştur
  const points = rope.points;
  let pathD = '';

  if (points.length >= 2) {
    // Başlangıç noktası
    pathD = `M ${points[0].x},${points[0].y}`;

    /**
     * Ara noktalar için yumuşak eğri oluştur
     * 
     * 1. Her nokta çifti için:
     *    - Kontrol noktaları hesapla
     *    - Orta nokta hesapla
     *    - Quadratic Bezier eğrisi oluştur
     * 
     * 2. Formül:
     *    Q controlX,controlY endX,endY
     *    - Q: Quadratic Bezier komutu
     *    - control: Eğrinin şeklini belirleyen kontrol noktası
     *    - end: Eğrinin bitiş noktası
     */
    for (let i = 1; i < points.length - 2; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Kontrol noktalarını hesapla
      const controlX1 = current.x;
      const controlY1 = current.y;
      const controlX2 = next.x;
      const controlY2 = next.y;
      
      // Orta nokta hesapla
      const midX = (controlX1 + controlX2) / 2;
      const midY = (controlY1 + controlY2) / 2;
      
      // Quadratic Bezier curve kullan
      pathD += ` Q ${controlX1},${controlY1} ${midX},${midY}`;
    }

    /**
     * Son iki nokta için son eğriyi ekle
     * 
     * 1. Üç veya daha fazla nokta varsa:
     *    - Son iki nokta arasında Quadratic Bezier
     * 2. Sadece iki nokta varsa:
     *    - Düz çizgi (Linear)
     */
    if (points.length >= 3) {
      const lastIndex = points.length - 1;
      const secondLastIndex = lastIndex - 1;
      
      pathD += ` Q ${points[secondLastIndex].x},${points[secondLastIndex].y} ${points[lastIndex].x},${points[lastIndex].y}`;
    } else {
      // Sadece iki nokta varsa düz çizgi
      pathD += ` L ${points[1].x},${points[1].y}`;
    }
  }

  return (
    <ConnectionLineSvg zIndex={zIndex}>
      <ConnectionPath d={pathD} color={rope.color} />
    </ConnectionLineSvg>
  );
}; 