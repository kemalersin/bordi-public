/**
 * ActionBar.tsx
 * Araç Çubuğu Bileşeni
 * 
 * Gruplar ve Özellikler:
 * 1. İçerik Ekleme
 *    - Not ekleme
 *    - Resim ekleme
 *    - Video ekleme
 * 
 * 2. Pano Yönetimi
 *    - Yeni pano ekleme
 * 
 * 3. Görünüm Ayarları
 *    - Ekran değiştirme
 *    - Arkaplan değiştirme
 * 
 * 4. Sistem Kontrolleri
 *    - Görünürlük kontrolü
 *    - Uygulama kapatma
 * 
 * Genel Özellikler:
 * - Otomatik gizlenme
 * - Animasyonlu geçişler
 * - Sürükleme durumu yönetimi
 * - Açılır menüler (Ekran ve arkaplan)
 */

import React, { useState, useCallback, useEffect } from 'react';
import { FaPlus, FaImage, FaEye, FaEyeSlash, FaPowerOff, FaVideo, FaDesktop, FaPaintRoller, FaFolderPlus, FaList } from 'react-icons/fa';
import { ActionBarProps } from '../types/ActionBar.types';
import { BarArea, Bar, ActionButton, Divider } from '../styles/ActionBar.styles';
import useActionBarUI from '../hooks/useActionBarUI';
import { useTranslations } from '../hooks/useTranslations';
import { DisplayList } from './DisplayList';
import { BackgroundList } from './BackgroundList';
import { getIpcRendererOrMock } from '../utils/electron';

export const ActionBar: React.FC<ActionBarProps> = ({
  // İçerik Ekleme
  onAddNote,
  onAddMedia,
  onAddVideoUrl,

  // Pano Yönetimi
  onAddBoard,
  onSelectBoard,

  // Görünüm Ayarları
  onBackgroundChange,
  currentBackground,

  // Sistem Kontrolleri
  onToggleVisibility,

  // Genel
  isDragging,
  style,
  boards
}) => {
  // UI Durumu
  const {
    isVisible,
    itemsVisible,
    isClosing,
    isDisplayChanging,
    handleMouseEnter,
    handleMouseLeave,
    handleToggleVisibility,
    handleQuit
  } = useActionBarUI({  
    isDragging,
    onToggleVisibility
  });

  const translations = useTranslations();

  // Ekran Listesi State'leri
  const [displays, setDisplays] = useState([]);
  const [showDisplayList, setShowDisplayList] = useState(false);
  const [isDisplayListClosing, setIsDisplayListClosing] = useState(false);
  const [displayListTimeout, setDisplayListTimeout] = useState<NodeJS.Timeout | null>(null);

  // Arkaplan Listesi State'leri
  const [showBackgroundList, setShowBackgroundList] = useState(false);
  const [isBackgroundListClosing, setIsBackgroundListClosing] = useState(false);
  const [backgroundListTimeout, setBackgroundListTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleDisplayButtonClick = useCallback(async () => {
    const ipcRenderer = getIpcRendererOrMock();
    try {
      if (ipcRenderer?.invoke) {
        const displayInfo = await ipcRenderer.invoke('get-displays');
        setDisplays(displayInfo);
        // Arkaplan menüsünü anında kapat
        setShowBackgroundList(false);
        setIsBackgroundListClosing(false);
        // Ekran menüsünü aç/kapat
        setIsDisplayListClosing(false);
        setShowDisplayList(prev => !prev);
      }
    } catch (error) {
      console.error('Ekran bilgisi alınamadı:', error);
    }
  }, []);

  const handleDisplayListMouseEnter = useCallback(() => {
    if (displayListTimeout) {
      clearTimeout(displayListTimeout);
      setDisplayListTimeout(null);
    }
    setIsDisplayListClosing(false);
  }, [displayListTimeout]);

  const handleDisplayListMouseLeave = useCallback(() => {
    const startClosing = () => {
      const displayList = document.querySelector('.display-list');
      const button = document.querySelector('[data-tooltip="' + translations.actionBar.displays + '"]');
      
      const isHovering = displayList?.matches(':hover') || button?.matches(':hover');
      
      if (!isHovering) {
        setIsDisplayListClosing(true);
        
        const closeTimeout = setTimeout(() => {
          const isStillHovering = displayList?.matches(':hover') || button?.matches(':hover');
          if (!isStillHovering) {
            setShowDisplayList(false);
            setIsDisplayListClosing(false);
          } else {
            setIsDisplayListClosing(false);
          }
        }, 400);
        
        return closeTimeout;
      }
      return null;
    };

    if (displayListTimeout) {
      clearTimeout(displayListTimeout);
    }

    const timeout = setTimeout(() => {
      const closeTimeout = startClosing();
      if (closeTimeout) {
        setDisplayListTimeout(closeTimeout);
      }
    }, 800);

    setDisplayListTimeout(timeout);
  }, [displayListTimeout, translations.actionBar.displays]);

  const handleDisplaySelect = useCallback(async (displayId: number) => {
    const ipcRenderer = getIpcRendererOrMock();
    try {
      if (ipcRenderer?.invoke) {
        await ipcRenderer.invoke('move-to-display', displayId);      }
    } catch (error) {
      console.error('Ekran değiştirme hatası:', error);
    }

    setIsDisplayListClosing(true);
    setTimeout(() => {
      setShowDisplayList(false);
      setIsDisplayListClosing(false);
      // ActionBar'ı gizle
      handleMouseLeave();
    }, 300);
  }, [handleMouseLeave, onBackgroundChange, currentBackground]);

  const handleBackgroundButtonClick = useCallback(() => {
    // Ekran menüsünü anında kapat
    setShowDisplayList(false);
    setIsDisplayListClosing(false);
    // Arkaplan menüsünü aç/kapat
    setIsBackgroundListClosing(false);
    setShowBackgroundList(prev => !prev);
  }, []);

  const handleBackgroundListMouseEnter = useCallback(() => {
    if (backgroundListTimeout) {
      clearTimeout(backgroundListTimeout);
      setBackgroundListTimeout(null);
    }
    setIsBackgroundListClosing(false);
  }, [backgroundListTimeout]);

  const handleBackgroundListMouseLeave = useCallback(() => {
    const startClosing = () => {
      const backgroundList = document.querySelector('.background-list');
      const button = document.querySelector('[data-tooltip="' + translations.actionBar.background + '"]');
      
      const isHovering = backgroundList?.matches(':hover') || button?.matches(':hover');
      
      if (!isHovering) {
        setIsBackgroundListClosing(true);
        
        const closeTimeout = setTimeout(() => {
          const isStillHovering = backgroundList?.matches(':hover') || button?.matches(':hover');
          if (!isStillHovering) {
            setShowBackgroundList(false);
            setIsBackgroundListClosing(false);
          } else {
            setIsBackgroundListClosing(false);
          }
        }, 400);
        
        return closeTimeout;
      }
      return null;
    };

    if (backgroundListTimeout) {
      clearTimeout(backgroundListTimeout);
    }

    const timeout = setTimeout(() => {
      const closeTimeout = startClosing();
      if (closeTimeout) {
        setBackgroundListTimeout(closeTimeout);
      }
    }, 800);

    setBackgroundListTimeout(timeout);
  }, [backgroundListTimeout, translations.actionBar.background]);

  const handleBackgroundSelect = useCallback((type: 'transparent' | 'color' | 'image', value?: string) => {
    onBackgroundChange(type, value);
    setIsBackgroundListClosing(true);
    setTimeout(() => {
      setShowBackgroundList(false);
      setIsBackgroundListClosing(false);
      // ActionBar'ı gizle
      handleMouseLeave();
    }, 300);
  }, [onBackgroundChange, handleMouseLeave]);

  // İlk yüklemede ekran listesini al
  useEffect(() => {
    const getDisplays = async () => {
      const ipcRenderer = getIpcRendererOrMock();
      try {
        if (ipcRenderer?.invoke) {
          const displayInfo = await ipcRenderer.invoke('get-displays');
          setDisplays(displayInfo);
        }
      } catch (error) {
        console.error('Ekran bilgisi alınamadı:', error);
      }
    };

    getDisplays();
  }, []);

  // Ekran değişikliklerini dinle
  useEffect(() => {
    const ipcRenderer = getIpcRendererOrMock();
    
    const handleDisplaysChanged = async () => {
      try {
        if (ipcRenderer?.invoke) {
          const displayInfo = await ipcRenderer.invoke('get-displays');
          setDisplays(displayInfo);
        }
      } catch (error) {
        console.error('Ekran bilgisi alınamadı:', error);
      }
    };
    
    ipcRenderer.on('displays-changed', handleDisplaysChanged);
    
    return () => {
      ipcRenderer.removeListener('displays-changed', handleDisplaysChanged);
    };
  }, []);

  // Temizlik işlemi
  useEffect(() => {
    return () => {
      if (displayListTimeout) {
        clearTimeout(displayListTimeout);
      }
    };
  }, [displayListTimeout]);

  return (
    <BarArea 
      className="action-bar-area" 
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      isVisible={isVisible}
      itemsVisible={itemsVisible}
    >
      <Bar isVisible={isVisible} itemsVisible={itemsVisible}>
        {/* Grup 1: İçerik Ekleme */}
        <ActionButton 
          onClick={onAddNote} 
          disabled={isDragging} 
          data-tooltip={!showDisplayList ? translations.actionBar.addNote : undefined}
        >
          <FaPlus />
        </ActionButton>

        <ActionButton 
          onClick={onAddMedia} 
          disabled={isDragging} 
          data-tooltip={!showDisplayList ? translations.actionBar.addImage : undefined}
        >
          <FaImage />
        </ActionButton>

        <ActionButton 
          onClick={onAddVideoUrl} 
          disabled={isDragging} 
          data-tooltip={!showDisplayList ? translations.actionBar.addVideo : undefined}
        >
          <FaVideo />
        </ActionButton>

        <Divider />

        {/* Grup 2: Pano Yönetimi */}
        <ActionButton
          onClick={onAddBoard}
          data-tooltip={translations.actionBar.addBoard}
        >
          <FaFolderPlus />
        </ActionButton>

        {Array.isArray(boards) && boards.length > 0 && (
          <ActionButton
            onClick={onSelectBoard}
            data-tooltip={translations.actionBar.selectBoard}
          >
            <FaList />
          </ActionButton>
        )}

        <Divider />

        {/* Grup 3: Görünüm Ayarları */}
        {displays.length > 1 && (
          <ActionButton 
            onClick={handleDisplayButtonClick} 
            data-tooltip={!showDisplayList ? translations.actionBar.displays : undefined}
            style={{ position: 'relative' }}
            onMouseEnter={handleDisplayListMouseEnter}
            onMouseLeave={handleDisplayListMouseLeave}
          >
            <FaDesktop />
            {showDisplayList && displays.length > 0 && (
              <DisplayList 
                displays={displays}
                onDisplaySelect={handleDisplaySelect}
                onMouseEnter={handleDisplayListMouseEnter}
                onMouseLeave={handleDisplayListMouseLeave}
                isClosing={isDisplayListClosing}
              />
            )}
          </ActionButton>        
        )}

        <ActionButton 
          onClick={handleBackgroundButtonClick}
          data-tooltip={!showBackgroundList ? translations.actionBar.background : undefined}
          style={{ position: 'relative' }}
          onMouseEnter={handleBackgroundListMouseEnter}
          onMouseLeave={handleBackgroundListMouseLeave}
        >
          <FaPaintRoller />
          {showBackgroundList && (
            <BackgroundList               
              onBackgroundSelect={handleBackgroundSelect}
              onMouseEnter={handleBackgroundListMouseEnter}
              onMouseLeave={handleBackgroundListMouseLeave}
              isClosing={isBackgroundListClosing}
              currentBackground={currentBackground}
            />
          )}
        </ActionButton>

        <Divider />

        {/* Grup 4: Sistem Kontrolleri */}
        <ActionButton 
          onClick={handleToggleVisibility} 
          data-tooltip={!showDisplayList ? translations.actionBar.toggleVisibility : undefined}
        >
          {itemsVisible ? <FaEye /> : <FaEyeSlash />}
        </ActionButton>

        <ActionButton 
          onClick={handleQuit} 
          color="#ff4444" 
          data-tooltip={!showDisplayList ? translations.actionBar.quit : undefined}
        >
          <FaPowerOff />
        </ActionButton>
      </Bar>
    </BarArea>
  );
}; 