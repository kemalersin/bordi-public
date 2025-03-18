import { useCallback } from 'react';
import useSaveBoard from './useSaveBoard';

import { PinData } from '../types/Pin.types';
import { RopeSegment } from '../types/ConnectionLine.types';

import { ROPE_COLORS } from '../constants/colors';

const usePin = (
  setDraggedPin: React.Dispatch<React.SetStateAction<PinData | null>>,
  setTemporaryRope: React.Dispatch<React.SetStateAction<RopeSegment | null>>,
  setRopes: React.Dispatch<React.SetStateAction<RopeSegment[]>>,
  setPins: React.Dispatch<React.SetStateAction<PinData[]>>,
  draggedPin: PinData | null,
  mousePosition: { x: number; y: number },
) => {
  const saveCurrentBoard = useSaveBoard();

  const handlePinMouseDown = useCallback((pin: PinData) => {
    setDraggedPin(pin);
  }, [setDraggedPin]);

  const handlePinMouseUp = useCallback((targetPin: PinData) => {
    if (draggedPin && draggedPin.id !== targetPin.id) {
      // Yeni ip oluştur
      const newRope: RopeSegment = {
        id: `rope-${Date.now()}`,
        startPin: draggedPin,
        endPin: targetPin,
        points: [
          { x: mousePosition.x, y: mousePosition.y },
          { x: mousePosition.x, y: mousePosition.y }
        ],
        color: ROPE_COLORS[Math.floor(Math.random() * ROPE_COLORS.length)]
      };
      setRopes(prev => [...prev, newRope]);

      if (window.currentBoardData) {
        window.currentBoardData.ropes.push(newRope);
      }

      saveCurrentBoard();
    }
    setDraggedPin(null);
    setTemporaryRope(null);
  }, [draggedPin, mousePosition, setRopes, setDraggedPin, setTemporaryRope, saveCurrentBoard]);


  const handlePinRemove = useCallback((pinToRemove: PinData) => {
    // Önce bu pin'e bağlı tüm ipleri bul ve sil
    setRopes(prevRopes => prevRopes.filter(rope =>
      rope.startPin.id !== pinToRemove.id && rope.endPin.id !== pinToRemove.id
    ));

    // Sonra pin'i sil
    setPins(prevPins => prevPins.filter(pin => pin.id !== pinToRemove.id));

    // Eğer silinen pin sürüklenen pin ise, sürükleme durumunu sıfırla
    if (draggedPin?.id === pinToRemove.id) {
      setDraggedPin(null);
      setTemporaryRope(null);
    }
  }, [draggedPin, setRopes, setPins, setDraggedPin, setTemporaryRope, saveCurrentBoard]);


  return { handlePinMouseDown, handlePinMouseUp, handlePinRemove };
};

export default usePin; 