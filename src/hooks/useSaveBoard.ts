import { useCallback } from 'react';
import { getIpcRendererOrMock } from '../utils/electron';

const useSaveBoard = () => {
  const ipcRenderer = getIpcRendererOrMock();

  const saveCurrentBoard = useCallback(() => {
    if (window.currentBoardData && ipcRenderer.invoke) {
      const currentData = window.currentBoardData;
      ipcRenderer.invoke('save-board', currentData);
    }
  }, [ipcRenderer]);

  return saveCurrentBoard;
};

export default useSaveBoard; 