export interface MediaData {
  id: number;
  src: string;
  type: 'image' | 'video';
  thumbnail?: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  aspectRatio?: '16:9' | '4:3';
  hasStarted?: boolean;
  width?: number;
  height?: number;
  localFilePath?: string;
  bookmark?: string;
  stopId?: number;
  isResizing?: boolean;
  isLocked?: boolean;
}

export interface MediaFrameProps {
  media: MediaData;
  isDragging: boolean;
  onUpdateMedia: (media: MediaData) => void;
  onImageDoubleClick?: (src: string) => void;
  onToggleLock?: (id: number) => void;
  children?: React.ReactNode;
  isVisible?: boolean;
  width?: number;
  height?: number;
  isResizing?: boolean;
} 