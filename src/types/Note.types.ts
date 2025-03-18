export interface NoteData {
  id: number;
  content: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;
  zIndex: number;
  color: string;
  fontSize: number;
  fontFamily?: string;
  isCompleted?: boolean;
  isResizing?: boolean;
  isLocked?: boolean;
  createdAt: Date;
}

export interface NoteProps {
  note: NoteData;
  isEditing: boolean;
  onDoubleClick: () => void;
  onContentChange: (content: string) => void;
  onFontSizeChange: (fontSize: number) => void;
  onColorChange: (color: string) => void;
  onFontChange: (fontFamily: string) => void;
  onToggleComplete: () => void;
  onToggleLock: () => void;
  children?: React.ReactNode;
  isDragging?: boolean;
} 