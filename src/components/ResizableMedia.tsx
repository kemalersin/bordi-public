import React, { useState, useEffect } from 'react';
import { MediaFrame } from './MediaFrame';
import { MediaData } from '../types/MediaFrame.types';
import { Resizable } from './Resizable';
import { TiltedContainer } from './TiltedContainer';
import { isLocalVideo } from '../utils/media';

import { PHOTO_DEFAULT_HEIGHT, PHOTO_DEFAULT_WIDTH, VIDEO_DEFAULT_HEIGHT, VIDEO_DEFAULT_HEIGHT_LOCAL, VIDEO_DEFAULT_WIDTH_LOCAL, VIDEO_DEFAULT_WIDTH } from '../constants/sizes';

interface ResizableMediaProps {
  media: MediaData;
  isDragging: boolean;
  onImageDoubleClick: () => void;
  isVisible: boolean;
  onResize?: (width: number, height: number) => void;
  onResizeComplete?: (width: number, height: number) => void;
  children?: React.ReactNode;
  interactionState: any;
  areItemsVisible: boolean;
  onUpdateMedia: (updatedMedia: MediaData) => void;
  onToggleLock?: (id: number) => void;
}

export const ResizableMedia: React.FC<ResizableMediaProps> = ({
  media,
  isDragging,
  onImageDoubleClick,
  isVisible,
  onResize,
  onResizeComplete,
  children,
  interactionState,
  areItemsVisible,
  onUpdateMedia,
  onToggleLock
}) => {
  // Lokal video kontrolü
  const isLocalVideoMedia = media.type === 'video' && (!!media.localFilePath || isLocalVideo(media.src));

  // Gerçek kare boyutunun hesaplanıp hesaplanmadığını kontrol et
  const [isFrameSizeCalculated, setIsFrameSizeCalculated] = useState(
    !isLocalVideoMedia || (isLocalVideoMedia && !!media.width && !!media.height)
  );

  // Medya tipine göre varsayılan boyutları belirle
  const getDefaultDimensions = () => {
    // Eğer medya zaten boyutlara sahipse, onları kullan
    if (media.width && media.height) {
      return {
        width: media.width,
        height: media.height
      };
    }

    // Aksi takdirde medya tipine göre varsayılan boyutları kullan
    if (media.type === 'video') {
      const isLocal = !!media.localFilePath || isLocalVideo(media.src);
      // Video için varsayılan boyutları kullan
      return {
        width: isLocal ? VIDEO_DEFAULT_WIDTH_LOCAL : VIDEO_DEFAULT_WIDTH,
        height: isLocal ? VIDEO_DEFAULT_HEIGHT_LOCAL : VIDEO_DEFAULT_HEIGHT
      };
    } else {
      // Resim için kare boyut
      return {
        width: PHOTO_DEFAULT_WIDTH,
        height: PHOTO_DEFAULT_HEIGHT
      };
    }
  };

  const initialDimensions = getDefaultDimensions();

  // Anlık boyutları takip etmek için state
  const [currentDimensions, setCurrentDimensions] = useState({
    width: initialDimensions.width,
    height: initialDimensions.height
  });

  // Boyutlandırma durumunu takip etmek için state
  const [isResizing, setIsResizing] = useState(false);

  // MediaFrame'den boyut güncellemelerini yakalamak için
  const handleMediaUpdate = (updatedMedia: MediaData) => {
    // Eğer medya zaten boyutlara sahip değilse ve güncellemede boyutlar varsa
    if (!media.width && !media.height && updatedMedia.width && updatedMedia.height) {
      setCurrentDimensions({
        width: updatedMedia.width,
        height: updatedMedia.height
      });

      // Lokal video için gerçek kare boyutu hesaplandı
      if (isLocalVideoMedia) {
        setTimeout(() => {
          setIsFrameSizeCalculated(true);
        }, 50);
      }

      // App seviyesindeki medias dizisini güncelle
      onUpdateMedia(updatedMedia);
    }
  };

  // Boyut değişikliklerini yakalamak için
  const handleResize = (width: number, height: number) => {
    setCurrentDimensions({ width, height });
    if (onResize) onResize(width, height);
  };

  // Boyutlandırma tamamlandığında medya verilerini güncelle
  const handleResizeComplete = (width: number, height: number) => {
    if (onResizeComplete) onResizeComplete(width, height);
  };

  // Boyutlandırma başladığında
  const handleResizeStart = () => {
    setIsResizing(true);
  };

  // Boyutlandırma bittiğinde
  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // MediaFrame bileşeni
  const mediaFrame = (
    <MediaFrame
      media={{
        ...media,
        width: currentDimensions.width,
        height: currentDimensions.height,
        isResizing: isResizing
      }}
      isDragging={isDragging}
      isResizing={isResizing}
      onUpdateMedia={handleMediaUpdate}
      onImageDoubleClick={onImageDoubleClick}
      isVisible={isVisible}
      onToggleLock={onToggleLock}
    >
      {children}
    </MediaFrame>
  );

  return (
    <TiltedContainer
      key={media.id}
      rotation={media.rotation}
      zIndex={media.zIndex}
      x={media.x}
      y={media.y}
      isDisabled={!areItemsVisible}
      isDragOverTrash={interactionState.isDragOverTrash}
      isResizing={isResizing}
      isVisible={isVisible && isFrameSizeCalculated}
      onMouseEnter={() => interactionState.onMouseEnter()}
      onMouseLeave={interactionState.onMouseLeave}
      onDragStart={interactionState.onDragStart}
      onDrag={interactionState.onDrag}
      onDragStop={interactionState.onDragStop}
    >
      <Resizable
        itemId={media.id}
        itemType="media"
        initialWidth={currentDimensions.width}
        initialHeight={currentDimensions.height}
        isDragging={isDragging}
        isVisible={isFrameSizeCalculated}
        onResize={handleResize}
        onResizeComplete={handleResizeComplete}
        onResizeStart={handleResizeStart}
        onResizeEnd={handleResizeEnd}
      >
        {mediaFrame}
      </Resizable>

    </TiltedContainer>
  );
}; 