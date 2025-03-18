import { useCallback } from 'react';

import { NoteData } from '../types/Note.types';
import { MediaData } from '../types/MediaFrame.types';
import { Position } from '../types/Common.types';
import { PinData } from '../types/Pin.types';

/**
 * handleContextMenu
 * Sağ tık işleyicisi
 * 1. Tıklanan noktayı tespit eder
 * 2. Not/fotoğraf üzerinde tıklanıp tıklanmadığını kontrol eder
 * 3. Raptiye ekleme mantığını yönetir
 * 4. Pozisyon güncellemelerini yapar
 */

const useContextMenu = (
  pins: PinData[],
  notes: NoteData[], // notes ve medias için uygun tipleri kullanın
  medias: MediaData[],
  setPins: React.Dispatch<React.SetStateAction<PinData[]>>,
  setPositions: React.Dispatch<React.SetStateAction<Record<string, Position>>>
) => {
  return useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Tıklanan elementi bul
    const element = document.elementFromPoint(e.clientX, e.clientY);
    
    const tiltedContainer = element?.closest('.tilted-container');
    if (!tiltedContainer) return;
    
    const noteElement = tiltedContainer.querySelector('.note');
    const mediaElement = tiltedContainer.querySelector('.media-frame');
    
    // Not veya fotoğraf üzerinde tıklandıysa
    if (noteElement || mediaElement) {
      const targetElement = noteElement || mediaElement;
      if (!targetElement) return;

      const [type, idStr] = targetElement.getAttribute('data-id')?.split('-') || [];
      const id = parseInt(idStr || '0');
      
      if (id && (type === 'note' || type === 'media')) {
        // Eğer bu nesnenin zaten bir raptiyesi varsa, yeni raptiye eklemeyelim
        const existingPin = pins.find(pin => pin.parentId === id && pin.parentType === type);
        if (!existingPin) {
          const rect = targetElement.getBoundingClientRect();
          
          // Pin'i ekle - piksel konumu kullan
          const newPin: PinData = {
            id: `pin-${Date.now()}`,
            parentId: id,
            parentType: type as 'note' | 'media',
            x: e.clientX - rect.left, // Piksel cinsinden x konumu
            y: e.clientY - rect.top,  // Piksel cinsinden y konumu
            rotation: 0
          };
          setPins(prev => [...prev, newPin]);

          // Pozisyonu güncelle
          setPositions(prev => ({
            ...prev,
            [`${type}-${id}`]: {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height,
              rotation: type === 'note' 
                ? notes.find(n => n.id === id)?.rotation || 0
                : medias.find(p => p.id === id)?.rotation || 0
            }
          }));
        }
      }
    }
  }, [pins, notes, medias, setPins, setPositions]);
};

export default useContextMenu; 