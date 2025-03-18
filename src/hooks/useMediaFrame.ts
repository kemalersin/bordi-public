import { useState, useCallback } from 'react';
import { MediaData } from '../types/MediaFrame.types';

interface UseMediaFrameProps {
  media: MediaData;
  onUpdateMedia?: (updatedMedia: MediaData) => void;
}

export const useMediaFrame = ({ media, onUpdateMedia }: UseMediaFrameProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = useCallback(() => {
    if (!isPlaying && !media.hasStarted) {
      if (onUpdateMedia) {
        const updatedMedia = {
          ...media,
          hasStarted: true
        };
        onUpdateMedia(updatedMedia);
      }
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, media, onUpdateMedia]);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

 
  return {
    isPlaying,
    handleVideoClick,
    handleVideoEnded
  };
}; 