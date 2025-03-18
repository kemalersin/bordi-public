/**
 * BoardDialog.tsx
 * Yeni Pano Ekleme Modal Bileşeni
 * 
 * Özellikler:
 * 1. Pano adı girişi
 * 2. Sürüklenebilir modal
 * 3. Animasyonlu geçişler
 */

import React, { useState, useCallback } from 'react';
import { DialogArea, DialogContent } from '../styles/VideoUrlDialog.styles';
import Draggable from 'react-draggable';
import { useTranslations } from '../hooks/useTranslations';
import { BoardDialogProps } from '../types/Board.types';

export const BoardDialog: React.FC<BoardDialogProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [boardName, setBoardName] = useState('');
  const translations = useTranslations();

  const generateBoardId = useCallback(() => {
    const timestamp = Date.now();
    return `${timestamp}`;
  }, []);

  const handleSubmit = useCallback(() => {
    if (boardName.trim()) {
      const boardId = generateBoardId();
      onSubmit(boardName.trim(), boardId);
      setBoardName('');
      onClose();
    }
  }, [boardName, onSubmit, onClose, generateBoardId]);

  const handleClose = useCallback(() => {
    setBoardName('');
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <DialogArea className="board-dialog-area">
      <Draggable>
        <DialogContent>
          <h2>{translations.boardDialog.title}</h2>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder={translations.boardDialog.placeholder}
            autoFocus
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && boardName.trim()) {
                handleSubmit();
              }
            }}
          />
          <div className="buttons">
            <button onClick={handleClose}>
              {translations.boardDialog.cancel}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!boardName.trim()}
              className={boardName.trim() ? 'primary' : ''}
            >
              {translations.boardDialog.submit}
            </button>
          </div>
        </DialogContent>
      </Draggable>
    </DialogArea>
  );
}; 