import { BoardData, BoardState } from './Board.types';

declare global {
  interface Window {
    areItemsVisible: boolean;
    saveBoard: boolean;
    activeBoardId: string | undefined;
    currentBoardData: BoardData;
    currentBackground: {
      type: 'transparent' | 'color' | 'image';
      value?: string;
    };
    tempBackground?: {
      type: 'transparent' | 'color' | 'image';
      value?: string;
    };
  }
}

export {}; 