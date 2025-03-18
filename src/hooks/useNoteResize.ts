import { useCallback } from 'react';
import { NoteData } from '../types/Note.types';
import { PinData } from '../types/Pin.types';
import { getIpcRendererOrMock } from '../utils/electron';
import { adjustPinPosition } from '../utils/pinUtils';

interface UseNoteResizeProps {
  notes: NoteData[];
  setNotes: React.Dispatch<React.SetStateAction<NoteData[]>>;
  pins?: PinData[];
  setPins?: React.Dispatch<React.SetStateAction<PinData[]>>;
}

export function useNoteResize({ notes, setNotes, pins, setPins }: UseNoteResizeProps) {
  // Not boyutunu güncelleme
  const handleNoteResize = useCallback((noteId: number, width: number, height: number) => {
    // Geçici boyut değişikliği, sadece UI'da gösterilir
    // Not: Bu aşamada veritabanına kaydetmiyoruz
    
    // Not: Notlarda pin konumu sadece boyutlandırma tamamlandıktan sonra düzeltilmeli
    // Bu nedenle burada pin konumunu düzeltme kodunu kaldırıyoruz
  }, []);

  // Not boyutlandırma tamamlandığında
  const handleNoteResizeComplete = useCallback((noteId: number, width: number, height: number) => {
    // Notu güncelle
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.map(note => 
        note.id === noteId 
          ? { ...note, width, height } 
          : note
      );      
     
      return updatedNotes;
    });

    // Not boyutlandırma tamamlandıktan sonra pin konumlarını düzelt
    if (pins && setPins) {
      // Bu nota ait pinleri bul
      const notePins = pins.filter(pin => pin.parentId === noteId && pin.parentType === 'note');
      
      if (notePins.length > 0) {
        console.log(`Not #${noteId} boyutlandırıldı, pin konumları düzeltiliyor...`);
        
        // Pin konumlarını kontrol et ve düzelt
        setPins(prevPins => {
          return prevPins.map(pin => {
            // Sadece bu nota ait pinleri düzelt
            if (pin.parentId === noteId && pin.parentType === 'note') {
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
  }, [setNotes, pins, setPins]);

  return {
    handleNoteResize,
    handleNoteResizeComplete
  };
} 