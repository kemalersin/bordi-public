import { useEffect } from 'react';
import { RopeSegment } from '../types/ConnectionLine.types';

/**
 * İp Fiziği Hesaplamaları
 * 
 * Fizik Parametreleri:
 * - gravity: 0.35 (yerçekimi kuvveti)
 * - damping: 0.88 (sönümleme - hareketin yavaşlama oranı)
 * - tension: 0.15 (gerilim - ipin gerginliği)
 * - baseSlack: 0.12 (temel sarkma miktarı)
 * - maxVelocity: 6 (maksimum hız sınırı)
 * 
 * Her İp İçin:
 * 1. Mesafe Hesaplama
 *    distance = √((endX - startX)² + (endY - startY)²)
 * 
 * 2. Nokta Sayısı Belirleme
 *    numPoints = max(6, min(10, floor(distance / 40)))
 * 
 * 3. Sarkma Hesaplama
 *    maxSlack = min(distance * 0.15, 25)
 *    slack = min(baseSlack * distance, maxSlack)
 * 
 * 4. Her Nokta İçin:
 *    a) Doğal Pozisyon
 *       t = i / (numPoints - 1)
 *       naturalX = startX + (endX - startX) * t
 *       sag = sin(t * π) * (1 - (2t - 1)²) * slack
 *       naturalY = startY + (endY - startY) * t + sag
 * 
 *    b) Kuvvetler
 *       - Yerçekimi: vy += gravity * deltaTime
 *       - Yay Kuvveti: springForce = (dx, dy) * tension
 *       - Restore Kuvveti: restoreForce = (naturalPos - currentPos) * tension * 1.5
 * 
 *    c) Hız Güncelleme
 *       - Toplam Kuvvet: v += (springForce + restoreForce)
 *       - Hız Sınırlama: v = clamp(v, -maxVelocity, maxVelocity)
 *       - Dinamik Sönümleme: v *= damping * (1 - min(speed/maxVelocity, 0.3))
 * 
 *    d) Pozisyon Güncelleme
 *       - pos += v * deltaTime * 55
 *       - Maksimum Sapma Kontrolü
 *       - Pozisyon Sınırlama
 */

const useRopePhysics = (
  ropes: RopeSegment[],
  setRopes: React.Dispatch<React.SetStateAction<RopeSegment[]>>,
  areItemsVisible: boolean
) => {
  useEffect(() => {
    if (!areItemsVisible) return;

    let lastTime = Date.now();
    const gravity = 0.35;
    const damping = 0.88;
    const tension = 0.15;
    const baseSlack = 0.12;
    const maxVelocity = 6;

    const updateRopes = () => {
      const currentTime = Date.now();
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.016);

      lastTime = currentTime;

      setRopes(prevRopes => prevRopes.map(rope => {
        const startPinElement = document.querySelector(`[data-id="${rope.startPin.parentType}-${rope.startPin.parentId}"] .pin`);
        const endPinElement = document.querySelector(`[data-id="${rope.endPin.parentType}-${rope.endPin.parentId}"] .pin`);

        if (!startPinElement || !endPinElement) {
          return rope;
        }

        const startRect = startPinElement.getBoundingClientRect();
        const endRect = endPinElement.getBoundingClientRect();

        // Pin'lerin merkezlerini hesapla
        const startCenterX = startRect.left + (startRect.width / 2);
        const startCenterY = startRect.top + (startRect.height / 2);
        const endCenterX = endRect.left + (endRect.width / 2);
        const endCenterY = endRect.top + (endRect.height / 2);

        // İki pin arasındaki açıyı hesapla
        const angle = Math.atan2(endCenterY - startCenterY, endCenterX - startCenterX);

        // Pin'lerin yarıçapları (her ikisi için 1/5)
        const startPinRadius = startRect.width / 5;
        const endPinRadius = endRect.width / 5;

        // Başlangıç ve bitiş noktalarını pin'lerin kenarlarına taşı
        const startX = startCenterX + Math.cos(angle) * startPinRadius;
        const startY = startCenterY + Math.sin(angle) * startPinRadius;
        const endX = endCenterX - Math.cos(angle) * endPinRadius;
        const endY = endCenterY - Math.sin(angle) * endPinRadius;

        // İki nokta arasındaki mesafeyi hesapla
        const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

        // Mesafeye göre nokta sayısını ayarla
        const numPoints = Math.max(6, Math.min(10, Math.floor(distance / 40)));

        // Mesafeye göre sarkma miktarını ayarla
        const maxSlack = Math.min(distance * 0.15, 25);
        const slack = Math.min(baseSlack * distance, maxSlack);

        const points: { x: number; y: number; vx?: number; vy?: number }[] = [
          { x: startX, y: startY }
        ];

        // Ara noktaları oluştur
        for (let i = 1; i < numPoints - 1; i++) {
          const t = i / (numPoints - 1);
          const naturalX = startX + (endX - startX) * t;
          // Daha yumuşak bir eğri için kuadratik fonksiyon kullan
          const sag = Math.sin(t * Math.PI) * (1 - Math.pow(2 * t - 1, 2)) * slack;
          const naturalY = startY + (endY - startY) * t + sag;

          if (!rope.points[i]) {
            points.push({
              x: naturalX,
              y: naturalY,
              vx: 0,
              vy: 0
            });
          } else {
            const point = rope.points[i];
            points.push({
              x: point.x || naturalX,
              y: point.y || naturalY,
              vx: point.vx || 0,
              vy: point.vy || 0
            });
          }
        }

        points.push({ x: endX, y: endY });

        // Ara noktaların fizik hesaplamalarını yap
        for (let i = 1; i < points.length - 1; i++) {
          const point = points[i] as { x: number; y: number; vx: number; vy: number };

          // Yerçekimi
          point.vy += gravity * deltaTime;

          // Yay kuvveti
          const prevPoint = points[i - 1];
          const nextPoint = points[i + 1];

          const dx1 = prevPoint.x - point.x;
          const dy1 = prevPoint.y - point.y;
          const dx2 = nextPoint.x - point.x;
          const dy2 = nextPoint.y - point.y;

          // Doğal pozisyona doğru çekme kuvveti
          const t = i / (points.length - 1);
          const naturalX = startX + (endX - startX) * t;
          const sag = Math.sin(t * Math.PI) * (1 - Math.pow(2 * t - 1, 2)) * slack;
          const naturalY = startY + (endY - startY) * t + sag;

          // Yay kuvvetini hesapla
          const springForceX = (dx1 + dx2) * tension;
          const springForceY = (dy1 + dy2) * tension;

          // Doğal pozisyona dönme kuvveti (daha güçlü)
          const restoreForceX = (naturalX - point.x) * tension * 1.5;
          const restoreForceY = (naturalY - point.y) * tension * 1.5;

          // Toplam kuvveti uygula
          point.vx += springForceX + restoreForceX;
          point.vy += springForceY + restoreForceY;

          // Hız sınırlaması
          point.vx = Math.max(-maxVelocity, Math.min(maxVelocity, point.vx));
          point.vy = Math.max(-maxVelocity, Math.min(maxVelocity, point.vy));

          // Sönümleme (hıza bağlı olarak değişken)
          const speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
          const dynamicDamping = damping * (1 - Math.min(speed / maxVelocity, 0.3));
          point.vx *= dynamicDamping;
          point.vy *= dynamicDamping;

          // Pozisyonu güncelle
          point.x += point.vx * deltaTime * 55; // Hareket hızını artırdım
          point.y += point.vy * deltaTime * 55;

          // Pozisyon sınırlaması (doğal pozisyondan çok uzaklaşmasın)
          const maxDistance = distance * 0.08; // Maksimum sapma mesafesini azalttım
          const dx = point.x - naturalX;
          const dy = point.y - naturalY;
          const currentDistance = Math.sqrt(dx * dx + dy * dy);

          if (currentDistance > maxDistance) {
            const scale = maxDistance / currentDistance;
            point.x = naturalX + dx * scale;
            point.y = naturalY + dy * scale;
          }
        }

        return {
          ...rope,
          points: points
        };
      }));
    };

    const interval = setInterval(updateRopes, 16);
    return () => clearInterval(interval);
  }, [ropes, setRopes, areItemsVisible]);
};

export default useRopePhysics; 