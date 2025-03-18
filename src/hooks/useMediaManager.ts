import { useCallback } from 'react';
import { MediaData } from '../types/MediaFrame.types';
import { calculateRandomPosition } from '../utils/position';
import { MEDIA_DEFAULT_POSITION } from '../constants/positions';
import useZIndex from './useZIndex';

interface UseMediaManagerProps {
  medias: MediaData[];
  setMedias: React.Dispatch<React.SetStateAction<MediaData[]>>;
  maxZIndex: number;
  setMaxZIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useMediaManager = ({ medias, setMedias, maxZIndex, setMaxZIndex }: UseMediaManagerProps) => {
  const { increaseZIndex } = useZIndex(maxZIndex, setMaxZIndex);

  const handleAddVideoUrl = useCallback((url: string) => {
    const newPosition = calculateRandomPosition(medias, MEDIA_DEFAULT_POSITION);

    const newMedia: MediaData = {
      id: Date.now(),
      src: url,
      type: 'video',
      x: newPosition.x,
      y: newPosition.y,
      rotation: newPosition.rotation,
      zIndex: maxZIndex + 1,
      aspectRatio: '16:9'
    };

    setMedias(prev => [...prev, newMedia]);
    increaseZIndex();
  }, [maxZIndex, setMedias, increaseZIndex]);

  const handleToggleLock = useCallback((id: number) => {
    setMedias(prev => prev.map(media =>
      media.id === id ? { ...media, isLocked: !media.isLocked } : media
    ));
  }, [setMedias]);

  return {
    handleAddVideoUrl,
    handleToggleLock
  };
}; 