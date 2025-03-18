import React, { useState, useEffect, useRef } from 'react';
import { ResizeHandles } from './ResizeHandle';
import { useResize } from '../hooks/useResize';
import { ResizeHandlePosition } from '../styles/ResizeHandle.styles';
import { isLocalVideo } from '../utils/media';
import { MediaData } from '../types/MediaFrame.types';
import {
  GlobalResizeStyle,
  ResizableContainer,
  ContentWrapper,
  SizeTooltip
} from '../styles/Resizable.styles';

export interface ResizableProps {
  itemId: number;
  itemType: 'note' | 'media';
  initialWidth: number;
  initialHeight: number;
  isEditing?: boolean;
  isDragging?: boolean;
  isVisible?: boolean;
  onResize?: (width: number, height: number) => void;
  onResizeComplete?: (width: number, height: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  children: React.ReactNode;
}

export const Resizable: React.FC<ResizableProps> = ({
  itemId,
  itemType,
  initialWidth,
  initialHeight,
  isEditing = false,
  isDragging = false,
  isVisible = true,
  onResize,
  onResizeComplete,
  onResizeStart,
  onResizeEnd,
  children
}) => {
  // Anlık boyut değişikliklerini takip etmek için state
  const [currentDimensions, setCurrentDimensions] = useState({
    width: initialWidth,
    height: initialHeight
  });
  
  // Boyutlandırma hook'unu kullan
  const {
    width: currentWidth,
    height: currentHeight,
    isResizing,
    handleResizeStart
  } = useResize({
    itemId,
    itemType,
    initialWidth,
    initialHeight,
    minWidth: 175, // Sabit minimum genişlik
    minHeight: 100, // Sabit minimum yükseklik
    onResize: (width, height) => {
      // Anlık boyut değişikliklerini güncelle
      setCurrentDimensions({ width, height });
      if (onResize) onResize(width, height);
    },
    onResizeComplete: (width, height) => {
      if (onResizeComplete) onResizeComplete(width, height);
    },
    onResizeStart: () => {
      if (onResizeStart) onResizeStart();
    },
    onResizeEnd: () => {
      if (onResizeEnd) onResizeEnd();
    }
  });
  
  // Boyutlar değiştiğinde state'i güncelle
  useEffect(() => {
    if (!isResizing && initialWidth && initialHeight) {
      setCurrentDimensions({
        width: initialWidth,
        height: initialHeight
      });
    }
  }, [initialWidth, initialHeight, isResizing]);
  
  // Boyutlandırma başlatma işleyicisi
  const handleResizeStartWrapper = (e: React.MouseEvent, position: ResizeHandlePosition) => {
    handleResizeStart(e, position);
  };
  
  // Boyutlandırılmış içeriği oluştur
  const resizedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // Çocuk bileşene width ve height prop'larını ekle
      // Not: itemType === 'media' ise boyutlandırma sırasında boyutları değiştirme
      if (itemType === 'media' && isResizing) {
        // Media bileşeni için boyutlandırma sırasında orijinal boyutları koru
        return React.cloneElement(child, {
          ...child.props,
          // Orijinal boyutları kullan
          width: initialWidth,
          height: initialHeight
        });
      } else {
        // Not bileşeni için boyutlandırma sırasında boyutları değiştir
        return React.cloneElement(child, {
          ...child.props,
          width: isResizing ? currentDimensions.width : currentWidth,
          height: isResizing ? currentDimensions.height : currentHeight
        });
      }
    }
    return child;
  });  
  
  // Lokal video kontrolü
  const isLocalVideoMedia = React.Children.toArray(children).some(child => {
    if (React.isValidElement(child)) {
      const mediaProps = child.props.media as MediaData;
      if (mediaProps?.type === 'video') {
        return !!mediaProps.localFilePath || isLocalVideo(mediaProps.src);
      }
    }
    return false;
  });

  const [isHovering, setIsHovering] = useState(false);
  const [shouldShowHandle, setShouldShowHandle] = useState(false);
  const handleTimeoutRef = useRef<NodeJS.Timeout>();

  // Fare üzerine gelme durumunu takip et
  useEffect(() => {
    if (handleTimeoutRef.current) {
      clearTimeout(handleTimeoutRef.current);
    }

    if (isHovering && !isDragging) {
      handleTimeoutRef.current = setTimeout(() => {
        setShouldShowHandle(true);
      }, 300);
    } else if (!isHovering && !isDragging) {
      handleTimeoutRef.current = setTimeout(() => {
        setShouldShowHandle(false);
      }, 300);
    } else {
      setShouldShowHandle(false);
    }

    return () => {
      if (handleTimeoutRef.current) {
        clearTimeout(handleTimeoutRef.current);
      }
    };
  }, [isHovering, isDragging]);

  return (
    <>
      {/* Global boyutlandırma stili */}
      <GlobalResizeStyle isResizing={isResizing} />
      
      <ResizableContainer
        width={isResizing ? currentDimensions.width : currentWidth}
        height={isResizing ? currentDimensions.height : currentHeight}
        isResizing={isResizing}
        isVisible={isVisible}
        isLocalVideo={isLocalVideoMedia}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <ContentWrapper isResizing={isResizing}>
          {resizedChildren}
        </ContentWrapper>
        
        {/* Boyutlandırma tutamaçları */}
        <ResizeHandles
          isResizing={isResizing}
          isVisible={shouldShowHandle}
          onResizeStart={handleResizeStartWrapper}
        />
        
        {/* Boyut bilgisi etiketi */}
        <SizeTooltip isVisible={isResizing}>
          {currentDimensions.width} x {currentDimensions.height}
        </SizeTooltip>
      </ResizableContainer>
    </>
  );
}; 