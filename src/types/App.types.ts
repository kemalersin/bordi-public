import { BoardData, BoardState } from './Board.types';
import { getIpcRendererOrMock } from '../utils/electron';

export const ipcRenderer = getIpcRendererOrMock();

// Board verilerini global olarak erişilebilir yap
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