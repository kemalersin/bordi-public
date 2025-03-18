/**
 * FavoriteBoards.tsx
 * Favori Panolar Bileşeni
 * 
 * Özellikler:
 * 1. Favori panoları rakamlar olan yuvarlak düğmeler şeklinde gösterir
 * 2. Ekranın sağ üst kısmında konumlanır
 * 3. ActionBar ile aynı gösterilip gizlenme mantığına sahiptir
 * 4. Düğmelere tıklandığında ilgili panoya geçiş yapar
 */

import React, { useState, useCallback, useEffect } from 'react';
import { BoardState } from '../types/Board.types';
import { FavoriteBoardsArea, FavoriteBoardsContainer, FavoriteBoardButton } from '../styles/FavoriteBoards.styles';

interface FavoriteBoardsProps {
  boards: BoardState[];
  onBoardSelect: (board: BoardState) => void;
  isDragging: boolean;
  activeBoard?: BoardState;
}

// Gizlenme süresi (ms) - ActionBar ile aynı
const HIDE_DELAY = 1000;

export const FavoriteBoards: React.FC<FavoriteBoardsProps> = ({
  boards,
  onBoardSelect,
  isDragging,
  activeBoard
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<string | undefined>(activeBoard?.id);
  const [favoriteBoards, setFavoriteBoards] = useState<BoardState[]>([]);
  
  // Favori panoları filtrele ve ilk 5'ini al
  useEffect(() => {
    const filtered = boards.filter(board => board.isFavorite).slice(0, 5);
    setFavoriteBoards(filtered);
  }, [boards]);

  // activeBoard değiştiğinde selectedBoardId'yi güncelle
  useEffect(() => {
    setSelectedBoardId(activeBoard?.id);
  }, [activeBoard]);

  // Sürükleme durumunu izle - ActionBar ile aynı mantık
  useEffect(() => {
    if (isDragging) {
      setIsVisible(true);

      if (hideTimeout) {
        clearTimeout(hideTimeout);
        setHideTimeout(null);
      }
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, HIDE_DELAY);
      setHideTimeout(timeout);
    }

    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [isDragging]);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);

    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
  }, [hideTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (!isDragging) {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        setHideTimeout(null);
      }

      const timeout = setTimeout(() => {
        // FavoriteBoards üzerinde hover durumunu kontrol et
        const favBoards = document.querySelector('.favorite-boards-area');
        const isHovering = favBoards?.matches(':hover');

        if (!isHovering) {
          // Son bir kez daha hover durumunu kontrol et
          const closeTimeout = setTimeout(() => {
            const isStillHovering = document.querySelector('.favorite-boards-area')?.matches(':hover');
            if (!isStillHovering) {
              setIsVisible(false);
            }
          }, 200);

          setHideTimeout(closeTimeout);
        }
      }, 800);

      setHideTimeout(timeout);
    }
  }, [isDragging, hideTimeout]);

  const handleBoardSelect = useCallback((board: BoardState) => {
    // Hemen seçili duruma geçir
    setSelectedBoardId(board.id);
    // Pano seçimini gerçekleştir
    onBoardSelect(board);
  }, [onBoardSelect]);

  // Favori pano yoksa render etme
  if (favoriteBoards.length === 0) {
    return null;
  }

  return (
    <FavoriteBoardsArea 
      className="favorite-boards-area"
      isVisible={isVisible}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <FavoriteBoardsContainer isVisible={isVisible}>
        {favoriteBoards.map((board, index) => (
          <FavoriteBoardButton 
            key={board.id}
            isActive={board.id === selectedBoardId}
            onClick={() => handleBoardSelect(board)}
            data-tooltip={board.displayName}
          >
            {index + 1}
          </FavoriteBoardButton>
        ))}
      </FavoriteBoardsContainer>
    </FavoriteBoardsArea>
  );
}; 