import { useCallback } from 'react';
import { MediaData } from '../types/MediaFrame.types';
import { MEDIA_DEFAULT_POSITION } from '../constants/positions';
import { calculateRandomPosition } from '../utils/position';
import { useTranslations } from './useTranslations';
import { getIpcRendererOrMock } from '../utils/electron';

const ipcRenderer = getIpcRendererOrMock();

const useFileChangeHandler = (
  medias: MediaData[],
  setMedias: React.Dispatch<React.SetStateAction<MediaData[]>>,
  maxZIndex: number,
  setMaxZIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const translations = useTranslations();

  // Yeni medya ekleme yardımcı fonksiyonu
  const addNewMedia = useCallback((src: string, type: 'image' | 'video', thumbnail?: string, localFilePath?: string, bookmark?: string) => {
    const newPosition = calculateRandomPosition(medias, MEDIA_DEFAULT_POSITION);

    const newMedia: MediaData = {
      id: Date.now(),
      src,
      type,
      thumbnail,
      x: newPosition.x,
      y: newPosition.y,
      rotation: newPosition.rotation,
      zIndex: maxZIndex + 1,
      aspectRatio: type === 'video' ? '16:9' : undefined,
      localFilePath,
      bookmark
    };

    setMedias(prev => [...prev, newMedia]);
    setMaxZIndex(prev => prev + 1);
  }, [medias, maxZIndex, setMedias, setMaxZIndex]);

  const handleFileSelect = useCallback(async () => {
    try {
      if (!ipcRenderer?.invoke) {
        console.error('IPC Renderer bulunamadı');
        return;
      }

      const result = await ipcRenderer.invoke('select-files');

      if (result.canceled || result.filePaths.length === 0) return;

      result.filePaths.forEach((filePath: string, index: number) => {
        const fileType = filePath.toLowerCase();
        const isImage = fileType.endsWith('.jpg') || fileType.endsWith('.jpeg') ||
          fileType.endsWith('.png') || fileType.endsWith('.gif') ||
          fileType.endsWith('.webp');
        const isVideo = fileType.endsWith('.mp4') || fileType.endsWith('.mov') || fileType.endsWith('.webm') ||
          fileType.endsWith('.ogg');

        if (!isImage && !isVideo) {
          alert(translations.alerts.unsupportedFile);
          return;
        }

        try {
          const src = `file://${filePath}`;
          addNewMedia(
            src,
            isImage ? 'image' : 'video',
            undefined,
            filePath,
            result.bookmarks?.[index]
          );
        } catch (error) {
          console.error('Dosya yükleme hatası:', error);
          alert(translations.alerts.uploadError);
        }
      });
    } catch (error) {
      console.error('Dosya seçim hatası:', error);
      alert(translations.alerts.uploadError);
    }
  }, [addNewMedia, translations]);

  return { handleFileSelect };
};

export default useFileChangeHandler; 