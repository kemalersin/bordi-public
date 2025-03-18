import { NoteData } from './Note.types';
import { MediaData } from './MediaFrame.types';
import { PinData } from './Pin.types';
import { RopeSegment } from './ConnectionLine.types';

export interface BoardData {
  notes: NoteData[];
  medias: MediaData[];
  pins: PinData[];
  ropes: RopeSegment[];
  maxZIndex: number;
  settings?: {
    lastFont?: {
      family: string;
      size: number;
    };
    background?: {
      type: 'transparent' | 'color' | 'image';
      value?: string;
    };
  };
} 

export interface BoardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (displayName: string, boardId: string) => void;
}

export interface BoardState {
  id: string;
  displayName: string;
  isActive: boolean;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BoardSettings {
  boards: BoardState[];
  activeBoard: BoardState;
}

export interface BoardListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBoardSelect: (board: BoardState) => void;
  onBoardDelete?: (board: BoardState) => void;
  onBoardFavorite?: (board: BoardState) => void;
} 