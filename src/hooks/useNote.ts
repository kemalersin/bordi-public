import { useCallback } from 'react';
import { NoteData } from '../types/Note.types';
import useZIndex from './useZIndex';

export const useNote = (
  setNotes: React.Dispatch<React.SetStateAction<NoteData[]>>,
  maxZIndex: number,
  setMaxZIndex: React.Dispatch<React.SetStateAction<number>>,
  setEditingNoteId: React.Dispatch<React.SetStateAction<number | null>>,
  notes: NoteData[],
  editingNoteId: number | null,
  lastFontSettings: { family: string; size: number },
  setLastFontSettings: React.Dispatch<React.SetStateAction<{ family: string; size: number }>>
) => {
  const { increaseZIndex } = useZIndex(maxZIndex, setMaxZIndex);

  const handleNoteDoubleClick = useCallback((id: number) => {
    const note = notes.find(n => n.id === id);
    if (!note || note.isCompleted) return;

    if (id === editingNoteId) {
      setEditingNoteId(null);
      return;
    }

    setEditingNoteId(id);
    const newZIndex = maxZIndex + 1;
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === id ? { ...note, zIndex: newZIndex } : note
    ));
    increaseZIndex();
  }, [maxZIndex, setNotes, setEditingNoteId, notes, editingNoteId, increaseZIndex]);

  const handleNoteContentChange = useCallback((id: number, content: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, content } : note
    ));
    setEditingNoteId(null);
  }, [setNotes, setEditingNoteId]);

  const handleNoteFontSizeChange = useCallback((id: number, fontSize: number) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, fontSize } : note
    ));
    setLastFontSettings(prev => ({ ...prev, size: fontSize }));
  }, [setNotes, setLastFontSettings]);

  const handleNoteColorChange = useCallback((id: number, color: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, color } : note
    ));
  }, [setNotes]);

  const handleNoteFontChange = useCallback((id: number, fontFamily: string) => {
    const currentNote = notes.find(note => note.id === id);
    if (!currentNote) return;

    // Önceki ve yeni font tipine göre boyut ayarla
    const currentFontIsCaveat = currentNote.fontFamily?.includes('Caveat') || (!currentNote.fontFamily);
    const newFontIsCaveat = fontFamily.includes('Caveat');
    let newFontSize = currentNote.fontSize;

    if (currentFontIsCaveat && !newFontIsCaveat) {
      // El yazısından normal fonta geçiş
      newFontSize = currentNote.fontSize * 0.7;
    } else if (!currentFontIsCaveat && newFontIsCaveat) {
      // Normal fonttan el yazısına geçiş
      newFontSize = currentNote.fontSize * 1.4286;
    }

    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, fontFamily, fontSize: newFontSize } : note
    ));

    setLastFontSettings(prev => ({ ...prev, family: fontFamily, size: newFontSize }));
  }, [notes, setNotes, setLastFontSettings]);

  const handleNoteToggleComplete = useCallback((id: number) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, isCompleted: !note.isCompleted } : note
    ));
  }, [setNotes]);

  const handleNoteToggleLock = useCallback((id: number) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, isLocked: !note.isLocked } : note
    ));
  }, [setNotes]);

  return {
    handleNoteDoubleClick,
    handleNoteContentChange,
    handleNoteFontSizeChange,
    handleNoteColorChange,
    handleNoteToggleComplete,
    handleNoteFontChange,
    handleNoteToggleLock
  };
};

export default useNote; 