import { useCallback, useRef } from 'react';
import { BoardData } from '../types/Board.types';
import { MediaData } from '../types/MediaFrame.types';
import { getIpcRendererOrMock } from '../utils/electron';
import { BoardState } from '../types/Board.types';

import useContextMenu from './useContextMenu';
import useActionBar from './useActionBar';
import useFileChangeHandler from './useFileChange';
import useVisibilityAnimation from './useVisibilityAnimation';
import useDrag from './useDrag';
import useNote from './useNote';
import useRopePhysics from './useRopePhysics';
import usePin from './usePin';
import useHover from './useHover';
import { useMediaManager } from './useMediaManager';
import { useNoteResize } from './useNoteResize';
import { useMediaResize } from './useMediaResize';

export function useAppHooks(state: ReturnType<typeof import('./useAppState').useAppState>) {
  const {
    notes, setNotes,
    medias, setMedias,
    maxZIndex, setMaxZIndex,
    isDragging, setIsDragging,
    isDraggingDelayed, setIsDraggingDelayed,
    editingNoteId, setEditingNoteId,
    positions, setPositions,
    pins, setPins,
    ropes, setRopes,
    draggedPin, setDraggedPin,
    mousePosition, setMousePosition,
    temporaryRope, setTemporaryRope,
    isDragOverTrash, setIsDragOverTrash,
    draggedItemInfo, setDraggedItemInfo,
    areItemsVisible, setAreItemsVisible,
    isHiding, setIsHiding,
    hoveredItem, setHoveredItem,
    isVideoUrlDialogOpen, setIsVideoUrlDialogOpen,
    modalImage, setModalImage,
    areFontsLoaded,
    lastFontSettings, setLastFontSettings,
    background, setBackground,
    isBoardDialogOpen, setIsBoardDialogOpen,
    activeBoard, setActiveBoard,
    boards
  } = state;

  const contextMenuHandler = useContextMenu(pins, notes, medias, setPins, setPositions);
  const fileChangeHandler = useFileChangeHandler(medias, setMedias, maxZIndex, setMaxZIndex);

  const { handleAddNoteFromBar, handleAddMediaFromBar, handleToggleVisibility } = useActionBar(
    notes,
    setNotes,
    maxZIndex,
    setMaxZIndex,
    setAreItemsVisible,
    fileChangeHandler,
    lastFontSettings
  );

  const {
    handleDragStart,
    handleDrag,
    handleDragStop,
    handleMouseMove
  } = useDrag(
    notes,
    setNotes,
    medias,
    setMedias,
    pins,
    setPins,
    setRopes,
    setPositions,
    maxZIndex,
    setMaxZIndex,
    setIsDragging,
    isDragging,
    draggedItemInfo,
    setDraggedItemInfo,
    isDragOverTrash,
    setIsDragOverTrash,
    setMousePosition,
    draggedPin,
    setTemporaryRope,
    setIsDraggingDelayed,
    getIpcRendererOrMock()
  );

  const { handleMouseEnter, handleMouseLeave } = useHover(hoveredItem, setHoveredItem);

  const { handlePinMouseDown, handlePinMouseUp, handlePinRemove } = usePin(
    setDraggedPin,
    setTemporaryRope,
    setRopes,
    setPins,
    draggedPin,
    mousePosition
  );

  const {
    handleNoteDoubleClick,
    handleNoteContentChange,
    handleNoteFontSizeChange,
    handleNoteColorChange,
    handleNoteToggleComplete,
    handleNoteFontChange,
    handleNoteToggleLock,
  } = useNote(
    setNotes,
    maxZIndex,
    setMaxZIndex,
    setEditingNoteId,
    notes,
    editingNoteId,
    lastFontSettings,
    setLastFontSettings
  );

  // Boyutlandırma hook'ları
  const { handleNoteResize, handleNoteResizeComplete } = useNoteResize({ 
    notes, 
    setNotes,
    pins,
    setPins
  });
  
  const { handleMediaResize, handleMediaResizeComplete } = useMediaResize({ 
    medias, 
    setMedias,
    pins,
    setPins
  });

  // Medya güncelleme işleyicisi
  const handleMediaUpdate = useCallback((mediaId: number, updatedMedia: MediaData) => {
    setMedias(prevMedias => {
      const updatedMedias = prevMedias.map(media => 
        media.id === mediaId ? { ...media, ...updatedMedia } : media
      );
      return updatedMedias;
    });
  }, [setMedias]);

  useRopePhysics(ropes, setRopes, areItemsVisible);
  useVisibilityAnimation(areItemsVisible, setIsHiding);

  const { handleAddVideoUrl, handleToggleLock } = useMediaManager({
    medias,
    setMedias,
    maxZIndex,
    setMaxZIndex
  });

  const handleImageDoubleClick = (src: string) => {
    setModalImage(src);
  };

  const handleBackgroundChange = useCallback((type: 'transparent' | 'color' | 'image', value?: string) => {
    setBackground(prevBackground => {
      const newBackground = { type, value };
      
      // Mouse event'lerini güncelle
      const ipcRenderer = getIpcRendererOrMock();
      
      // İçerik gizliyse veya sürükleniyorsa veya arkaplan şeffaf değilse
      const shouldIgnoreEvents = !window.areItemsVisible || isDragging || type !== 'transparent';
      ipcRenderer.send('set-ignore-mouse-events', shouldIgnoreEvents, type);

      return newBackground;
    });
  }, []);

  const handleAddBoard = useCallback(() => {
    setIsBoardDialogOpen(true);
  }, [setIsBoardDialogOpen]);

  const handleBoardSubmit = useCallback(async (displayName: string, boardId: string) => {
    const ipcRenderer = getIpcRendererOrMock();

    try {
      if (ipcRenderer?.invoke) {
        const newBoard: BoardState = {
          id: boardId,
          displayName,        
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await ipcRenderer.invoke('update-board-settings', {
          type: 'add',
          board: newBoard
        });

        await ipcRenderer.invoke('copy-default-board', boardId);

        setTimeout(() => {
          setActiveBoard(newBoard);
        }, 300);
      }
    } catch (error) {
      console.error('Pano oluşturma hatası:', error);
    }
  }, [setActiveBoard]);

  const handleBoardSelect = useCallback(async (selectedBoard: BoardState) => {
    try {     
      // Aktif panoyu güncelle
      const ipcRenderer = getIpcRendererOrMock();

      await ipcRenderer.invoke?.('update-board-settings', {
        type: 'set-active',
        board: selectedBoard
      });

      setTimeout(() => {       
        setActiveBoard(selectedBoard);
      }, 300);
    } catch (error) {
      console.error('Board yüklenirken hata:', error);
    }
  }, [setActiveBoard]);

  const handleBoardDelete = useCallback(async (selectedBoard: BoardState) => {
    try {
      // Panoyu sil
      const ipcRenderer = getIpcRendererOrMock();
      await ipcRenderer.invoke?.('delete-board', selectedBoard.id);
    } catch (error) {
      console.error('Pano silinirken hata:', error);
    }
  }, [boards, setActiveBoard]);

  const handleFavorite = useCallback(async (selectedBoard: BoardState) => {
    try {
      // Favori durumunu değiştir
      const ipcRenderer = getIpcRendererOrMock();

      await ipcRenderer.invoke?.('toggle-favorite-board', selectedBoard.id);

      // Pano listesini yeniden yükle
      const boardList = await ipcRenderer.invoke?.('get-boards');
      state.setBoards(boardList || []);
    } catch (error) {
      console.error('Pano favori durumu değiştirilirken hata:', error);
    }
  }, [state]);

  return {
    contextMenuHandler,
    fileChangeHandler,
    handleAddNoteFromBar,
    handleAddMediaFromBar,
    handleToggleVisibility,
    handleDragStart,
    handleDrag,
    handleDragStop,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handlePinMouseDown,
    handlePinMouseUp,
    handlePinRemove,
    handleNoteDoubleClick,
    handleNoteContentChange,
    handleNoteFontSizeChange,
    handleNoteColorChange,
    handleNoteToggleComplete,
    handleNoteFontChange,
    handleNoteToggleLock,
    handleAddVideoUrl,
    handleImageDoubleClick,
    handleBackgroundChange,
    handleNoteResize,
    handleNoteResizeComplete,
    handleMediaResize,
    handleMediaResizeComplete,
    handleMediaUpdate,
    handleMediaToggleLock: handleToggleLock,
    handleAddBoard,
    handleBoardSubmit,
    handleBoardSelect,
    handleBoardDelete,
    handleFavorite
  };
} 