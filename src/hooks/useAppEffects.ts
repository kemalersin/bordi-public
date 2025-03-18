import { useEffect, useCallback } from 'react';

import useSaveBoard from './useSaveBoard';

import { getIpcRendererOrMock } from '../utils/electron';
import { PinData } from '../types/Pin.types';
import { useTranslations } from './useTranslations';

import { PHOTO_DEFAULT_WIDTH, PHOTO_DEFAULT_HEIGHT, VIDEO_DEFAULT_WIDTH, VIDEO_DEFAULT_HEIGHT } from '../constants/sizes';

export function useAppEffects(
  state: ReturnType<typeof import('./useAppState').useAppState>,
  hooks: ReturnType<typeof import('./useAppHooks').useAppHooks>
) {
  const {
    notes, setNotes,
    medias, setMedias,
    maxZIndex, setMaxZIndex,
    isDragging,
    areItemsVisible, setAreItemsVisible,
    isInitialRender, setIsInitialRender,
    areFontsLoaded, setAreFontsLoaded,
    lastFontSettings, setLastFontSettings,
    background, setBackground,
    pins, setPins,
    ropes, setRopes,
    isAppReady, setIsAppReady,
    boards, setBoards,
    activeBoard, setActiveBoard
  } = state;

  const {
    handleBackgroundChange
  } = hooks;

  const ipcRenderer = getIpcRendererOrMock();

  const translations = useTranslations();

  const saveCurrentBoard = useSaveBoard();

  // Pano listesini yükle
  useEffect(() => {
    const loadBoards = async () => {
      try {
        if (ipcRenderer?.invoke) {
          const boardList = await ipcRenderer.invoke('get-boards');

          setBoards(boardList || []);

          // Aktif panoyu bul ve activeBoard'u güncelle
          if (Array.isArray(boardList) && boardList.length > 0) {
            const activeBoard = boardList.find(board => board.isActive);
            if (activeBoard) {
              setIsAppReady(true);
              setActiveBoard(activeBoard);
            }
          }
        }
      } catch (error) {
        console.error('Pano listesi yüklenirken hata:', error);
        setBoards([]);
      }
    };

    loadBoards();
  }, [setBoards, setActiveBoard, translations]);

  // Pano verilerini yükle
  useEffect(() => {
    const loadBoardData = async (targetBoardId?: string) => {
      try {
        if (ipcRenderer?.invoke) {
          // Eğer belirli bir pano ID'si belirtilmişse onu kullan, yoksa aktif panoyu yükle
          const data = await ipcRenderer.invoke('load-board', targetBoardId);

          if (data && typeof data === 'object') {
            // Font ayarlarını yükle
            if (data.settings?.lastFont) {
              setLastFontSettings(data.settings.lastFont);
            }

            // Arkaplan ayarlarını yükle ve doğrula
            if (data.settings?.background) {
              const { type, value } = data.settings.background;
              // Arkaplan tipini doğrula
              const validType = ['transparent', 'color', 'image'].includes(type) ? type : 'transparent';
              // Değer kontrolü
              const validValue = type === 'transparent' ? undefined : value;

              const background = { type: validType, value: validValue };

              window.currentBackground = background;

              setBackground(background);
              // Mouse event'lerini güncelle
              ipcRenderer.send('set-ignore-mouse-events', false, validType);
            }

            // İlk render'ı 100ms sonra kaldır
            setTimeout(() => {
              setIsInitialRender(false);
            }, 100);

            // State'leri sırayla ve güvenli bir şekilde güncelle
            if (Array.isArray(data.notes)) {
              setNotes(data.notes.map((note: any) => ({
                ...note,
                // Eğer createdAt yoksa şu anki tarihi ekle
                createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
                // Boyut bilgilerini ekle (yoksa varsayılan değerler)
                width: note.width || 200,
                height: note.height || 200
              })));
            }

            if (Array.isArray(data.medias)) {
              setMedias(data.medias.map((media: any) => {
                // Medya tipine göre varsayılan boyutları belirle
                let defaultWidth = PHOTO_DEFAULT_WIDTH;
                let defaultHeight = PHOTO_DEFAULT_HEIGHT;

                if (media.type === 'video') {
                  defaultWidth = VIDEO_DEFAULT_WIDTH;
                  defaultHeight = VIDEO_DEFAULT_HEIGHT;
                }

                return {
                  ...media,
                  // Eğer localFilePath varsa, src'yi file:// protokolü ile güncelle
                  src: media.localFilePath ? `file://${media.localFilePath}` : media.src,
                  // Boyut bilgilerini ekle (yoksa varsayılan değerler)
                  width: media.width || defaultWidth,
                  height: media.height || defaultHeight
                };
              }));
            }

            if (Array.isArray(data.pins)) {
              // Pozisyon bilgilerini kullanarak pin konumlarını yüzde formatına dönüştür
              const convertedPins = data.pins.map((pin: PinData) => {
                // Eğer pin konumları zaten yüzde cinsinden ise (0-100 arasında) dönüştürme
                if (pin.x <= 100 && pin.y <= 100 && pin.x >= 0 && pin.y >= 0) {
                  return pin;
                }

                // Aksi halde piksel konumlarını yüzde konumlarına dönüştür
                const parentPosition = state.positions[`${pin.parentType}-${pin.parentId}`];
                if (parentPosition) {
                  return {
                    ...pin,
                    x: (pin.x / parentPosition.width) * 100,
                    y: (pin.y / parentPosition.height) * 100
                  };
                }

                // Eğer ebeveyn pozisyonu bulunamazsa orijinal değerleri kullan
                return pin;
              });

              setPins([...convertedPins]);
            }

            if (Array.isArray(data.ropes)) {
              setRopes([...data.ropes]);
            }

            if (typeof data.maxZIndex === 'number') {
              setMaxZIndex(data.maxZIndex);
            }
          }
        }
      } catch (error) {
        console.error('Pano verileri yüklenirken hata:', error);
      }
    };

    if (!isAppReady) {
      return;
    }

    const activeBoardId = activeBoard?.id || "default";

    window.saveBoard = false;

    if (
      !(window.activeBoardId || activeBoard?.id) ||
      (window.activeBoardId !== activeBoardId)
    ) { 
      loadBoardData(activeBoard?.id);
    }

    window.activeBoardId = activeBoardId;
  }, [activeBoard]);

  // State değişikliklerini izle ve kaydet
  useEffect(() => {
    if (!isAppReady) return;

    window.currentBoardData = {
      notes,
      medias,
      pins,
      ropes,
      maxZIndex,
      settings: {
        lastFont: lastFontSettings,
        background
      }
    };

    window.currentBackground = background;
    ipcRenderer.send('set-ignore-mouse-events', false, background.type || "transparent");

    try {
      if (window.areItemsVisible && window.saveBoard) {
        saveCurrentBoard();
      }

      if (!window.saveBoard) {
        window.saveBoard = true;
      }
    } catch (error) {
      console.error('Board kaydedilirken hata:', error);
    }
  }, [notes, medias, pins, maxZIndex, lastFontSettings, background, isAppReady]);

  // Font yükleme kontrolü
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const fontFaces = [
          new FontFace('Caveat', 'url(/fonts/Caveat-Regular.woff2)', { weight: '400' }),
          new FontFace('Caveat', 'url(/fonts/Caveat-Bold.woff2)', { weight: '700' })
        ];

        // Tüm fontları yükle
        await Promise.all(fontFaces.map(font => font.load()));

        // Fontları document'e ekle
        fontFaces.forEach(font => document.fonts.add(font));

        // Font yükleme durumunu güncelle
        setAreFontsLoaded(true);
      } catch (error) {
        console.error('Font yükleme hatası:', error);
        // Hata durumunda da içeriği göster
        setAreFontsLoaded(true);
      }
    };

    loadFonts();
  }, []);

  // İlk yüklemede içeriği gizli başlat ve sonra göster
  useEffect(() => {
    if (areFontsLoaded) {
      setAreItemsVisible(true);
    }
  }, [areFontsLoaded, setAreItemsVisible]);

  // İlk yüklemede içeriği gizli başlat
  useEffect(() => {
    setAreItemsVisible(false);
  }, [setAreItemsVisible]);

  // areItemsVisible değişkenini window nesnesine ekle
  useEffect(() => {
    window.areItemsVisible = areItemsVisible;
    ipcRenderer.send?.('items-visibility-changed');
  }, [areItemsVisible]);
} 