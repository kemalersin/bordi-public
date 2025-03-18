import { useState, useCallback, useEffect } from 'react';
import { getIpcRendererOrMock } from '../utils/electron';
import { BoardData } from '../types/Board.types';

// Gizlenme süresi (ms)
const HIDE_DELAY = 1000;

interface UseActionBarUIProps {
  isDragging: boolean;
  onToggleVisibility: () => void;
}

const useActionBarUI = ({ isDragging, onToggleVisibility }: UseActionBarUIProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(true);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isDisplayChanging, setIsDisplayChanging] = useState(false);

  // Sürükleme durumunu izle
  useEffect(() => {
    if (isDragging) {
      setIsVisible(true);

      if (hideTimeout) {
        clearTimeout(hideTimeout);
        setHideTimeout(null);
      }
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, HIDE_DELAY);
      setHideTimeout(timeout);
    }

    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [isDragging]);

  const handleMouseEnter = useCallback(() => {
    if (itemsVisible) {
      setIsVisible(true);

      if (hideTimeout) {
        clearTimeout(hideTimeout);
        setHideTimeout(null);
      }
    }
  }, [hideTimeout, itemsVisible]);

  const handleMouseLeave = useCallback(() => {
    if (!isDragging && itemsVisible) {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        setHideTimeout(null);
      }

      const timeout = setTimeout(() => {
        // ActionBar üzerinde hover durumunu kontrol et
        const actionBar = document.querySelector('.action-bar-area');
        const isHovering = actionBar?.matches(':hover');

        if (!isHovering) {
          // Son bir kez daha hover durumunu kontrol et
          const closeTimeout = setTimeout(() => {
            const isStillHovering = document.querySelector('.action-bar-area')?.matches(':hover');
            if (!isStillHovering) {
              setIsVisible(false);
            }
          }, 200);

          setHideTimeout(closeTimeout);
        }
      }, 800);

      setHideTimeout(timeout);
    }
  }, [isDragging, itemsVisible, hideTimeout]);

  const handleToggleVisibility = useCallback(() => {
    const newItemsVisible = !itemsVisible;
    setItemsVisible(newItemsVisible);
    setIsVisible(newItemsVisible);

    // Global değişkeni güncelle
    window.areItemsVisible = newItemsVisible;

    const ipcRenderer = getIpcRendererOrMock();
    if (!newItemsVisible) {
      ipcRenderer.send('set-ignore-mouse-events', true, 'transparent');
    } else {
      ipcRenderer.send('set-background', window.currentBackground.type, window.currentBackground.value);
      ipcRenderer.send('set-ignore-mouse-events', false, window.currentBackground.type);
    }

    onToggleVisibility();
  }, [itemsVisible, onToggleVisibility]);

  const handleQuit = useCallback(() => {
    const ipcRenderer = getIpcRendererOrMock();

    // Kapanış durumunu işaretle
    setIsClosing(true);
    // ActionBar'ı hemen gizle
    setIsVisible(false);

    // Kısa bir gecikme sonra içeriği gizle
    setTimeout(() => {
      setItemsVisible(false);
      onToggleVisibility();

      // Animasyon tamamlandıktan sonra board'u kaydet ve kapat
      setTimeout(() => {
        if (ipcRenderer.invoke) {
          ipcRenderer.send('quit-app');
        }
      }, 500);
    }, 50);
  }, [setItemsVisible, setIsVisible, onToggleVisibility]);

  // TaskBar simgesinden gösterme/gizleme
  useEffect(() => {
    const ipcRenderer = getIpcRendererOrMock();

    const handleShowFromTray = () => {
      // Her zaman tüm içeriği göster
      setItemsVisible(true);
      onToggleVisibility();

      // ActionBar'ı göster
      setIsVisible(true);

      ipcRenderer.send('set-ignore-mouse-events', false, window.currentBackground.type);
      
      // ActionBar'ı otomatik gizle
      const timeout = setTimeout(() => {
        if (!isDragging) {
          setIsVisible(false);
        }
      }, HIDE_DELAY + 500);
      setHideTimeout(timeout);
    };

    const handleHideFromTray = () => {
      // Tüm içeriği gizle
      setItemsVisible(false);
      onToggleVisibility();

      // ActionBar'ı gizle
      setIsVisible(false);
    };

    ipcRenderer.on('show-from-tray', handleShowFromTray);
    ipcRenderer.on('hide-from-tray', handleHideFromTray);

    return () => {
      ipcRenderer.removeListener('show-from-tray', handleShowFromTray);
      ipcRenderer.removeListener('hide-from-tray', handleHideFromTray);
    };
  }, [isDragging, onToggleVisibility]);

  // Initial value
  useEffect(() => {
    window.areItemsVisible = true;
  }, []);

  const handleDisplayHide = useCallback(() => {
    setIsDisplayChanging(true);
    setIsVisible(false);

    // Mevcut timeout'u temizle
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }

    // İçeriği gizle ama state'i değiştirme
    onToggleVisibility();
  }, [onToggleVisibility, hideTimeout]);

  const handleDisplayShow = useCallback(() => {
    // Mevcut timeout'u temizle
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }

    setIsVisible(true);

    // İçeriği göster ama state'i değiştirme
    onToggleVisibility();

    // Ekran değişimi tamamlandı
    setIsDisplayChanging(false);

    // ActionBar'ı otomatik gizle
    if (!isDragging) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, HIDE_DELAY + 500);
      setHideTimeout(timeout);
    }
  }, [onToggleVisibility, isDragging, hideTimeout, setHideTimeout]);

  // Ekran değiştirme olaylarını dinle
  useEffect(() => {
    const ipcRenderer = getIpcRendererOrMock();
    ipcRenderer.on('hide-for-display-change', handleDisplayHide);
    ipcRenderer.on('show-after-display-change', handleDisplayShow);

    return () => {
      ipcRenderer.removeListener('hide-for-display-change', handleDisplayHide);
      ipcRenderer.removeListener('show-after-display-change', handleDisplayShow);
    };
  }, [handleDisplayHide, handleDisplayShow]);

  return {
    isVisible,
    itemsVisible,
    isClosing,
    isDisplayChanging,
    handleMouseEnter,
    handleMouseLeave,
    handleToggleVisibility,
    handleQuit
  };
};

export default useActionBarUI; 