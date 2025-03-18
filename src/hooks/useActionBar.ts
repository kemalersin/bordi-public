import { useCallback } from 'react';
import { NoteData } from '../types/Note.types';
import { NOTE_COLORS } from '../constants/colors';
import { calculateRandomPosition } from '../utils/position';
import { NOTE_DEFAULT_POSITION } from '../constants/positions';
import { useTranslations } from '../hooks/useTranslations';
import { getIpcRendererOrMock } from '../utils/electron';
import useZIndex from '../hooks/useZIndex';

export const useActionBar = (
  notes: NoteData[],
  setNotes: React.Dispatch<React.SetStateAction<NoteData[]>>,
  maxZIndex: number,
  setMaxZIndex: React.Dispatch<React.SetStateAction<number>>,
  setAreItemsVisible: React.Dispatch<React.SetStateAction<boolean>>,
  fileChangeHandler: {
    handleFileSelect: () => Promise<void>;
  },
  lastFontSettings: { family: string; size: number }
) => {
  const translations = useTranslations();
  const { increaseZIndex } = useZIndex(maxZIndex, setMaxZIndex);

  const handleAddNoteFromBar = useCallback(() => {
    const newPosition = calculateRandomPosition(notes, NOTE_DEFAULT_POSITION);

    const newNote: NoteData = {
      id: Date.now(),
      content: translations.note.newNote,
      x: newPosition.x,
      y: newPosition.y,
      rotation: newPosition.rotation,
      zIndex: maxZIndex + 1,
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      fontSize: lastFontSettings.size,
      fontFamily: lastFontSettings.family,
      createdAt: new Date()
    };

    setNotes(prev => [...prev, newNote]);
    increaseZIndex();
  }, [maxZIndex, notes, setNotes, increaseZIndex, translations, lastFontSettings]);

  const handleAddMediaFromBar = useCallback(async () => {
    const ipcRenderer = getIpcRendererOrMock();
    if (!ipcRenderer?.send) return;

    ipcRenderer.send('set-window-focusable', false);
    await fileChangeHandler.handleFileSelect();
    ipcRenderer.send('set-window-focusable', true);
  }, [fileChangeHandler]);

  const handleToggleVisibility = useCallback(() => {
    setAreItemsVisible(prev => {
      const newValue = !prev;
      return newValue;
    });
  }, [setAreItemsVisible]);

  return { handleAddNoteFromBar, handleAddMediaFromBar, handleToggleVisibility };
};

export default useActionBar; 