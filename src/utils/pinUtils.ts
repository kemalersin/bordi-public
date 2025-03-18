import { PinData } from '../types/Pin.types';

/**
 * Pin konumunu kontrol edip düzeltir
 * Eğer pin, bileşen sınırlarının dışında kalıyorsa, bileşen içinde olabilecek en uygun konuma taşır
 * 
 * @param pin - Pin verisi
 * @param width - Bileşenin genişliği
 * @param height - Bileşenin yüksekliği
 * @returns - Düzeltilmiş pin verisi
 */
export function adjustPinPosition(pin: PinData, width: number, height: number): PinData {
  // Pin boyutları (yaklaşık değerler)
  const PIN_WIDTH = 24;
  const PIN_HEIGHT = 24;
  
  // Kenar boşluğu (pin'in bileşen kenarına olan minimum mesafesi)
  const MARGIN = 5;
  
  // Pin'in merkez noktası
  const pinCenterX = pin.x + PIN_WIDTH / 2;
  const pinCenterY = pin.y + PIN_HEIGHT / 2;
  
  // Bileşen sınırları içinde kalacak şekilde pin konumunu ayarla
  let newX = pin.x;
  let newY = pin.y;
  
  // X koordinatını kontrol et
  if (pinCenterX < 0) {
    // Sol sınırın dışında - sol üst köşeye yakın bir konuma taşı
    newX = MARGIN;
  } else if (pinCenterX > width) {
    // Sağ sınırın dışında - sağ üst köşeye yakın bir konuma taşı
    newX = width - PIN_WIDTH - MARGIN;
  }
  
  // Y koordinatını kontrol et
  if (pinCenterY < 0) {
    // Üst sınırın dışında - sol üst köşeye yakın bir konuma taşı
    newY = MARGIN;
  } else if (pinCenterY > height) {
    // Alt sınırın dışında - sol alt köşeye yakın bir konuma taşı
    newY = height - PIN_HEIGHT - MARGIN;
  }
  
  // Eğer konum değişmediyse, orijinal pin'i döndür
  if (newX === pin.x && newY === pin.y) {
    return pin;
  }
  
  // Düzeltilmiş pin verisini döndür
  return {
    ...pin,
    x: newX,
    y: newY
  };
} 