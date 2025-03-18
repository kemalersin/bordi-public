import React from 'react';
import { Note } from './Note';
import { NoteData } from '../types/Note.types';
import { Resizable } from './Resizable';
import { NOTE_DEFAULT_HEIGHT, NOTE_DEFAULT_WIDTH } from '../constants/sizes';

interface ResizableNoteProps {
  note: NoteData;
  isEditing: boolean;
  onDoubleClick: () => void;
  onContentChange: (content: string) => void;
  onFontSizeChange: (fontSize: number) => void;
  onColorChange: (color: string) => void;
  onFontChange: (fontFamily: string) => void;
  onToggleComplete: () => void;
  onToggleLock: () => void;
  isDragging: boolean;
  onResize?: (width: number, height: number) => void;
  onResizeComplete?: (width: number, height: number) => void;
  children?: React.ReactNode;
}

export const ResizableNote: React.FC<ResizableNoteProps> = ({
  note,
  isEditing,
  onDoubleClick,
  onContentChange,
  onFontSizeChange,
  onColorChange,
  onFontChange,
  onToggleComplete,
  onToggleLock,
  isDragging,
  onResize,
  onResizeComplete,
  children
}) => {
  // Varsayılan boyutlar
  const defaultWidth = note.width || NOTE_DEFAULT_WIDTH;
  const defaultHeight = note.height || NOTE_DEFAULT_HEIGHT;
  
  return (
    <Resizable
      itemId={note.id}
      itemType="note"
      initialWidth={defaultWidth}
      initialHeight={defaultHeight}
      isEditing={isEditing}
      isDragging={isDragging}
      onResize={onResize}
      onResizeComplete={onResizeComplete}
      onResizeStart={() => {
        note.isResizing = true;
      }}
      onResizeEnd={() => {
        note.isResizing = false;
      }}
    >
      <Note
        note={{
          ...note,
          // width ve height prop'ları Resizable bileşeni tarafından eklenecek
        }}
        isEditing={isEditing}
        onDoubleClick={onDoubleClick}
        onContentChange={onContentChange}
        onFontSizeChange={onFontSizeChange}
        onColorChange={onColorChange}
        onFontChange={onFontChange}
        onToggleComplete={onToggleComplete}
        onToggleLock={onToggleLock}
        isDragging={isDragging}
      >
        {children}
      </Note>
    </Resizable>
  );
}; 