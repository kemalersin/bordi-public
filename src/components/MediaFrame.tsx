/**
 * MediaFrame.tsx
 * Fotoğraf ve Video Bileşeni
 * 
 * Özellikler:
 * 1. Sürükle-bırak
 * 2. Boyutlandırma
 * 3. Çerçeve stilleri
 * 4. Pin ekleme desteği
 * 5. Görsel optimizasyonu
 * 6. Kilitleme özelliği
 */

import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { getIpcRendererOrMock } from '../utils/electron';
import { MdLock, MdLockOpen } from 'react-icons/md';

import { MediaFrameProps } from '../types/MediaFrame.types';
import {
  MediaFrame as StyledMediaFrame,
  StyledImage,
  VideoContainer,
  PlayerWrapper,
  ChildrenWrapper,
  LockButton
} from '../styles/MediaFrame.styles';
import { useMediaFrame } from '../hooks/useMediaFrame';

import { isLocalVideo } from '../utils/media';
import { PHOTO_DEFAULT_HEIGHT, PHOTO_DEFAULT_WIDTH, VIDEO_DEFAULT_HEIGHT, VIDEO_DEFAULT_HEIGHT_LOCAL, VIDEO_DEFAULT_WIDTH_LOCAL, VIDEO_DEFAULT_WIDTH } from '../constants/sizes';
import Loader from './Loader';

const ipcRenderer = getIpcRendererOrMock();

export const MediaFrame: React.FC<MediaFrameProps> = ({
  media,
  isDragging,
  onUpdateMedia,
  onImageDoubleClick,
  onToggleLock,
  children,
  isVisible = true,
  width,
  height,
  isResizing = false
}) => {
  const isLocal = useMemo(() =>
    !!media.localFilePath || isLocalVideo(media.src),
    [media.localFilePath, media.src]
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [shouldShowLock, setShouldShowLock] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({
    width: VIDEO_DEFAULT_WIDTH,
    height: isLocal ? VIDEO_DEFAULT_HEIGHT_LOCAL : VIDEO_DEFAULT_HEIGHT
  });
  const playerRef = useRef<ReactPlayer>(null);
  const lockTimeoutRef = useRef<NodeJS.Timeout>();

  const {
    isPlaying,
    handleVideoEnded,
  } = useMediaFrame({
    media,
    onUpdateMedia
  });

  // Fare üzerine gelme durumunu takip et
  useEffect(() => {
    const mediaElement = document.querySelector(`[data-id="media-${media.id}"]`);
    if (!mediaElement) return;

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    mediaElement.addEventListener('mouseenter', handleMouseEnter);
    mediaElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      mediaElement.removeEventListener('mouseenter', handleMouseEnter);
      mediaElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [media.id]);

  // Kilit düğmesinin görünürlüğünü gecikmeyle ayarla
  useEffect(() => {
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }

    if (isHovering && !isDragging) {
      lockTimeoutRef.current = setTimeout(() => {
        if (isHovering && !isDragging) {
          setShouldShowLock(true);
        }
      }, 300);
    } else {
      lockTimeoutRef.current = setTimeout(() => {
        setShouldShowLock(false);
      }, 300);
    }

    return () => {
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, [isHovering, isDragging]);

  const stopAccessingFile = () => {
    if (media.stopId) {
      ipcRenderer.invoke?.('stop-accessing-file', media.stopId).catch(error => {
        console.error('Dosya erişimi sonlandırılırken hata:', error);
      });
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    stopAccessingFile();
  };

  const handleError = () => {
    setIsLoading(false);
    stopAccessingFile();
    // TODO: Hata durumunda gösterilecek UI
  };

  const handleImageDoubleClick = (e: React.MouseEvent) => {
    if (isDragging || media.isLocked) return;
    e.stopPropagation();
    const imageSrc = media.localFilePath ? `file://${media.localFilePath}` : media.src;
    onImageDoubleClick?.(imageSrc);
  };

  const handleLockToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleLock) {
      onToggleLock(media.id);
    }
  };

  const handleVideoReady = () => {
    if (isLocal && playerRef.current) {
      const video = playerRef.current.getInternalPlayer();
      if (video) {
        const aspectRatio = video.videoWidth / video.videoHeight;
        let newWidth = VIDEO_DEFAULT_WIDTH_LOCAL;
        let newHeight = Math.round(newWidth / aspectRatio);

        // Maksimum boyutları aşmamak için kontrol
        if (newHeight > VIDEO_DEFAULT_HEIGHT_LOCAL) {
          newHeight = VIDEO_DEFAULT_HEIGHT_LOCAL;
          newWidth = Math.round(newHeight * aspectRatio);
        }

        setVideoDimensions({ width: newWidth, height: newHeight });

        // MediaData'yı güncelle
        if (onUpdateMedia) {
          onUpdateMedia({
            ...media,
            width: newWidth,
            height: newHeight
          });
        }
      }
    }
    setIsLoading(false);
    stopAccessingFile();
  };

  const renderImage = () => (
    <>
      <Loader isVisible={isLoading} />
      <StyledImage
        src={media.localFilePath ? `file://${media.localFilePath}` : media.src}
        alt=""
        onLoad={handleLoad}
        onError={handleError}
        onDoubleClick={handleImageDoubleClick}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </>
  );

  const renderVideo = () => (
    <VideoContainer
      onMouseDown={(e: React.MouseEvent) => {
        // Video kontrollerinin üzerinde tıklandıysa sürüklemeyi engelle
        const target = e.target as HTMLElement;
        if (target.closest('.react-player__controls')) {
          e.stopPropagation();
        }
      }}
      style={isLocal ? {
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        visibility: isLoading ? 'hidden' : 'visible'
      } : undefined}
    >
      <PlayerWrapper
        id={`player-wrapper-${media.id}`}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <ReactPlayer
          ref={playerRef}
          url={media.localFilePath ? `file://${media.localFilePath}` : media.src}
          width="100%"
          height="100%"
          playing={isPlaying}
          controls={true}
          light={false}
          onReady={handleVideoReady}
          onError={handleError}
          style={{ maxWidth: '100%', maxHeight: '100%', pointerEvents: isDragging ? 'none' : 'auto' }}
        />
      </PlayerWrapper>
    </VideoContainer>
  );

  // Bileşenin boyutlarını belirle
  const frameWidth = width || media.width || (media.type === 'video' ? videoDimensions.width : PHOTO_DEFAULT_WIDTH);
  const frameHeight = height || media.height || (media.type === 'video' ? videoDimensions.height : PHOTO_DEFAULT_HEIGHT);

  return (
    <StyledMediaFrame
      isDragging={isDragging}
      type={media.type}
      isLocalVideo={isLocal && media.type === 'video'}
      isVisible={isVisible}
      isResizing={isResizing || media.isResizing}
      style={{
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        zIndex: media.zIndex,
        visibility: isLoading && isLocal ? 'hidden' : 'visible'
      }}
      data-id={`media-${media.id}`}
    >
      {media.type === 'image' ? renderImage() : renderVideo()}
      
      <LockButton
        onClick={handleLockToggle}
        isHovering={shouldShowLock}
        isDragging={isDragging}
        isLocked={media.isLocked}
        data-no-drag="true"
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {media.isLocked ? <MdLock /> : <MdLockOpen />}
      </LockButton>
      
      <ChildrenWrapper>
        {children}
      </ChildrenWrapper>
    </StyledMediaFrame>
  );
};