import { useCallback } from 'react';
import { MediaData } from '../types/MediaFrame.types';
import { PinData } from '../types/Pin.types';
import { getIpcRendererOrMock } from '../utils/electron';
import { adjustPinPosition } from '../utils/pinUtils';

interface UseMediaResizeProps {
  medias: MediaData[];
  setMedias: React.Dispatch<React.SetStateAction<MediaData[]>>;
  pins?: PinData[];
  setPins?: React.Dispatch<React.SetStateAction<PinData[]>>;
}

export function useMediaResize({ medias, setMedias, pins, setPins }: UseMediaResizeProps) {
  // Medya boyutunu güncelleme
  const handleMediaResize = useCallback((mediaId: number, width: number, height: number) => {
    // Geçici boyut değişikliği, sadece UI'da gösterilir
    // Not: Bu aşamada veritabanına kaydetmiyoruz
    
    // MediaFrame boyutlandırılırken pin konumlarını düzelt
    if (pins && setPins) {
      // Bu medyaya ait pinleri bul
      const mediaPins = pins.filter(pin => pin.parentId === mediaId && pin.parentType === 'media');
      
      if (mediaPins.length > 0) {
        // Pin konumlarını kontrol et ve düzelt
        setPins(prevPins => {
          return prevPins.map(pin => {
            // Sadece bu medyaya ait pinleri düzelt
            if (pin.parentId === mediaId && pin.parentType === 'media') {
              // MediaFrame boyutlandırılırken pin konumunu düzelt
              return adjustPinPosition(pin, width, height);
            }
            return pin;
          });
        });
      }
    }
  }, [pins, setPins]);

  // Medya boyutlandırma tamamlandığında
  const handleMediaResizeComplete = useCallback((mediaId: number, width: number, height: number) => {
    // Medyayı güncelle
    setMedias(prevMedias => {
      const updatedMedias = prevMedias.map(media => 
        media.id === mediaId 
          ? { ...media, width, height } 
          : media
      );      
     
      return updatedMedias;
    });

    // MediaFrame boyutlandırma tamamlandıktan sonra pin konumlarını düzelt
    if (pins && setPins) {
      // Bu medyaya ait pinleri bul
      const mediaPins = pins.filter(pin => pin.parentId === mediaId && pin.parentType === 'media');
      
      if (mediaPins.length > 0) {
        console.log(`MediaFrame #${mediaId} boyutlandırıldı, pin konumları düzeltiliyor...`);
        
        // Pin konumlarını kontrol et ve düzelt
        setPins(prevPins => {
          return prevPins.map(pin => {
            // Sadece bu medyaya ait pinleri düzelt
            if (pin.parentId === mediaId && pin.parentType === 'media') {
              const adjustedPin = adjustPinPosition(pin, width, height);
              
              // Eğer pin konumu değiştiyse, log'a yaz
              if (adjustedPin.x !== pin.x || adjustedPin.y !== pin.y) {
                console.log(`Pin #${pin.id} konumu düzeltildi: (${pin.x}, ${pin.y}) -> (${adjustedPin.x}, ${adjustedPin.y})`);
              }
              
              return adjustedPin;
            }
            return pin;
          });
        });
      }
    }
  }, [setMedias, pins, setPins]);

  return {
    handleMediaResize,
    handleMediaResizeComplete
  };
} 