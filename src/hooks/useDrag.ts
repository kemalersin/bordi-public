import { useCallback, useEffect } from 'react';
import { IpcRendererLike } from '../types/Electron.types';
import useZIndex from './useZIndex';

import { NoteData } from '../types/Note.types';
import { MediaData } from '../types/MediaFrame.types';
import { Position } from '../types/Common.types';
import { PinData } from '../types/Pin.types';
import { RopeSegment } from '../types/ConnectionLine.types';

/**
 * Sürükleme İşleyicileri
 * 
 * handleDragStart:
 * 1. Sürükleme durumunu aktifleştirir
 * 2. Z-index'i günceller
 * 3. Bağlı iplerin z-index'lerini günceller
 * 
 * handleDrag:
 * 1. Sürüklenen nesnenin pozisyonunu günceller
 * 2. Çöp kutusu üzerinde olma durumunu kontrol eder
 * 3. Genişletilmiş çöp kutusu alanı hesaplar
 * 4. Pozisyon state'ini günceller
 * 
 * handleDragStop:
 * 1. Çöp kutusu üzerinde bırakma kontrolü
 * 2. Nesne silme işlemleri
 * 3. Bağlı pin ve ipleri temizleme
 * 4. State'leri sıfırlama
 */

const useDrag = (
    notes: NoteData[],
    setNotes: React.Dispatch<React.SetStateAction<NoteData[]>>,
    medias: MediaData[],
    setMedias: React.Dispatch<React.SetStateAction<MediaData[]>>,
    pins: PinData[],
    setPins: React.Dispatch<React.SetStateAction<PinData[]>>,
    setRopes: React.Dispatch<React.SetStateAction<RopeSegment[]>>,
    setPositions: React.Dispatch<React.SetStateAction<Record<string, Position>>>,
    maxZIndex: number,
    setMaxZIndex: React.Dispatch<React.SetStateAction<number>>,
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
    isDragging: boolean,
    draggedItemInfo: { id: number; type: 'note' | 'media' } | null,
    setDraggedItemInfo: React.Dispatch<React.SetStateAction<{ id: number; type: 'note' | 'media' } | null>>,
    isDragOverTrash: boolean,
    setIsDragOverTrash: React.Dispatch<React.SetStateAction<boolean>>,
    setMousePosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
    draggedPin: PinData | null,
    setTemporaryRope: React.Dispatch<React.SetStateAction<RopeSegment | null>>,
    setIsDraggingDelayed: React.Dispatch<React.SetStateAction<boolean>>,
    ipcRenderer: IpcRendererLike
) => {
    const { increaseZIndex } = useZIndex(maxZIndex, setMaxZIndex);

    const handleDragStart = useCallback((id: number, type: 'note' | 'media') => {
        setIsDragging(true);

        const newZIndex = maxZIndex + 1;

        // Kilitli not ve medya kontrolü
        const isItemLocked = type === 'note' 
            ? notes.find(note => note.id === id)?.isLocked 
            : medias.find(media => media.id === id)?.isLocked;
        
        // Eğer nesne kilitli değilse, z-index'i güncelle
        if (!isItemLocked) {
            // Nesnenin z-index'ini güncelle
            if (type === 'note') {
                setNotes(prevNotes => prevNotes.map(note =>
                    note.id === id ? { ...note, zIndex: newZIndex } : note
                ));
            } else {
                setMedias(prevMedias => prevMedias.map(media =>
                    media.id === id ? { ...media, zIndex: newZIndex } : media
                ));
            }

            // Sürüklenen nesnenin pin'ini bul
            const itemPin = pins.find(pin => pin.parentId === id && pin.parentType === type);

            // Bu pin'e bağlı tüm ipleri bul
            if (itemPin) {
                setRopes(prevRopes => prevRopes.map(rope => {
                    if (rope.startPin.id === itemPin.id || rope.endPin.id === itemPin.id) {
                        // Bu nesnenin ipi ise, nesnenin üstünde olsun
                        return { ...rope, zIndex: newZIndex + 1 };
                    }
                    return rope;
                }));
            }

            increaseZIndex(2); // İpler için +1 fazla
        }
    }, [maxZIndex, pins, notes, medias, setIsDragging, increaseZIndex, setMedias, setNotes, setRopes]);

    const handleDrag = useCallback((id: number, type: 'note' | 'media', data: { x: number, y: number }) => {
        // Sürükleme başladığında draggedItemInfo'yu set et
        if (!draggedItemInfo) {
            setDraggedItemInfo({ id, type });
        }

        const element = document.querySelector(`[data-id="${type}-${id}"]`);
        if (element) {
            const rect = element.getBoundingClientRect();

            // Çöp kovasının pozisyonunu kontrol et
            const trashRect = document.querySelector('.trash-bin')?.getBoundingClientRect();
            if (trashRect) {
                // Nesnenin gerçek pozisyonunu hesapla
                const elementRect = {
                    left: rect.left,
                    right: rect.right,
                    top: rect.top,
                    bottom: rect.bottom
                };

                // Çöp kovasının alanını genişlet
                const extendedTrashRect = {
                    left: trashRect.left - 50,
                    right: trashRect.right + 50,
                    top: trashRect.top - 50,
                    bottom: trashRect.bottom + 50
                };

                // İki dikdörtgenin kesişimini kontrol et
                const isOverTrash = !(
                    elementRect.left > extendedTrashRect.right ||
                    elementRect.right < extendedTrashRect.left ||
                    elementRect.top > extendedTrashRect.bottom ||
                    elementRect.bottom < extendedTrashRect.top
                );

                setIsDragOverTrash(isOverTrash);
            }

            // Nesnenin rotasyonunu al
            const rotation = type === 'note'
                ? notes.find(n => n.id === id)?.rotation || 0
                : medias.find(p => p.id === id)?.rotation || 0;

            setPositions(prev => ({
                ...prev,
                [`${type}-${id}`]: {
                    x: data.x,
                    y: data.y,
                    width: rect.width,
                    height: rect.height,
                    rotation
                }
            }));
        }
    }, [draggedItemInfo, notes, medias, setDraggedItemInfo, setIsDragOverTrash, setPositions]);

    const handleDragStop = useCallback(async (e: any, position: { x: number; y: number }) => {        
        setIsDraggingDelayed(false);
        
        // Sürükleme durumunu gecikmeli kapat
        setTimeout(() => {
            setIsDragging(false);
            ipcRenderer?.send('drag-state-changed', false);
        }, 100);

        if (draggedItemInfo) {
            const { id, type } = draggedItemInfo;

            if (isDragOverTrash) {
                // Çöp kutusu üzerinde bırakıldı, öğeyi sil
                if (type === 'note') {
                    setNotes(prev => prev.filter(note => note.id !== id));
                } else if (type === 'media') {
                    setMedias(prev => prev.filter(media => media.id !== id));
                }

                // Bağlı pinleri ve ipleri temizle
                setPins(prev => prev.filter(pin => !(pin.parentId === id && pin.parentType === type)));
                setRopes(prev => prev.filter(rope => {
                    const startPin = pins.find(p => p.id === rope.startPin.id);
                    const endPin = pins.find(p => p.id === rope.endPin.id);
                    return !(startPin?.parentId === id && startPin?.parentType === type) &&
                           !(endPin?.parentId === id && endPin?.parentType === type);
                }));
            } else {
                // Normal bırakma, pozisyonu güncelle
                if (type === 'note') {
                    setNotes(prev => prev.map(note => 
                        note.id === id 
                            ? { ...note, x: position.x, y: position.y }
                            : note
                    ));
                } else if (type === 'media') {
                    setMedias(prev => prev.map(media => 
                        media.id === id 
                            ? { ...media, x: position.x, y: position.y }
                            : media
                    ));
                }
            }

            setDraggedItemInfo(null);
            setIsDragOverTrash(false);
        }
    }, [draggedItemInfo, isDragOverTrash, setNotes, setMedias, setPins, setRopes, setDraggedItemInfo, setIsDragging, setIsDraggingDelayed, setIsDragOverTrash, ipcRenderer, pins]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    
        // Eğer bir pin sürükleniyorsa, geçici ipi güncelle
        if (draggedPin) {
          // Pin'in gerçek pozisyonunu bul
          const startElement = document.querySelector(`[data-id="${draggedPin.parentType}-${draggedPin.parentId}"]`);
          if (startElement) {
            const startRect = startElement.getBoundingClientRect();
    
            // Geçici ipi güncelle
            setTemporaryRope({
              id: 'temp',
              startPin: draggedPin,
              endPin: { ...draggedPin, x: e.clientX, y: e.clientY },
              points: [
                { x: draggedPin.x + startRect.left, y: draggedPin.y + startRect.top },
                { x: e.clientX, y: e.clientY }
              ],
              color: '#888888',
              zIndex: maxZIndex + 1
            });
          }
        }
      }, [draggedPin, maxZIndex, setMousePosition, setTemporaryRope]);

      useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
          // Eğer itemsVisible false ise hiçbir etkileşime izin verme
          if (!window.areItemsVisible) {
            ipcRenderer.send('mouse-over-interactive', false);
            return;
          }

          const element = document.elementFromPoint(e.clientX, e.clientY);
          const isClickableArea = element?.classList.contains('clickable-area');

          ipcRenderer.send('mouse-over-interactive', !isClickableArea);
        };
    
        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
      }, [ipcRenderer]);
    
      useEffect(() => {
        if (isDragging) {
          const timeout = setTimeout(() => {
            setIsDraggingDelayed(true);
            ipcRenderer.send('drag-state-changed', true);
          }, 300);
    
          return () => clearTimeout(timeout);
        } else {
          const timeout = setTimeout(() => {
            setIsDraggingDelayed(false);
            ipcRenderer.send('drag-state-changed', false);
          }, 300);
    
          return () => clearTimeout(timeout);
        }
      }, [isDragging, ipcRenderer, setIsDraggingDelayed]);

    return { handleDragStart, handleDrag, handleDragStop, handleMouseMove };
};

export default useDrag; 