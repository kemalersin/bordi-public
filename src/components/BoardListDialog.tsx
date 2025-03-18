/**
 * BoardListDialog.tsx
 * Pano Listesi Modal Bileşeni
 * 
 * Özellikler:
 * 1. Pano listesi
 * 2. Sürüklenebilir modal
 * 3. Animasyonlu geçişler
 */

import React, { useState, useEffect } from 'react';
import { DialogArea } from '../styles/VideoUrlDialog.styles';
import { BoardListDialogContent } from '../styles/BoardListDialog.styles';
import Draggable from 'react-draggable';
import { useTranslations } from '../hooks/useTranslations';
import { BoardListDialogProps, BoardState } from '../types/Board.types';
import { getIpcRendererOrMock } from '../utils/electron';

export const BoardListDialog: React.FC<BoardListDialogProps> = ({
    isOpen,
    onClose,
    onBoardSelect,
    onBoardDelete,
    onBoardFavorite
}) => {
    const [boards, setBoards] = useState<BoardState[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBoards, setFilteredBoards] = useState<BoardState[]>([]);
    const translations = useTranslations();
    const ipcRenderer = getIpcRendererOrMock();
    const [deleteConfirmMap, setDeleteConfirmMap] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
        }
    }, [isOpen]);

    useEffect(() => {
        const loadBoards = async () => {
            if (isOpen && ipcRenderer?.invoke) {
                try {
                    const boardList = await ipcRenderer.invoke('get-boards');
                    setBoards(boardList || []);
                    setFilteredBoards(boardList || []);

                    // Liste yüklendikten sonra aktif öğeye kaydır
                    setTimeout(() => {
                        const activeItem = document.querySelector('.board-item.active');
                        if (activeItem) {
                            // Öğenin görünürlüğünü kontrol et
                            const rect = activeItem.getBoundingClientRect();
                            const parentRect = (activeItem.parentElement as HTMLElement).getBoundingClientRect();
                            
                            const isVisible = (
                                rect.top >= parentRect.top &&
                                rect.bottom <= parentRect.bottom
                            );

                            // Sadece görünür alanda değilse kaydır
                            if (!isVisible) {
                                activeItem.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center'
                                });
                            }
                        }
                    }, 100);
                } catch (error) {
                    console.error('Pano listesi alınamadı:', error);
                }
            }
        };

        loadBoards();
    }, [isOpen, ipcRenderer, translations]);

    useEffect(() => {
        // Arama terimini küçük harfe çevir
        const term = searchTerm.toLowerCase().trim();
        
        // Eğer arama terimi boşsa tüm panoları göster
        if (!term) {
            setFilteredBoards(boards);
            return;
        }

        // Panoları filtrele
        const filtered = boards.filter(board => 
            board.displayName.toLowerCase().includes(term) ||
            new Date(board.updatedAt).toLocaleDateString(navigator.language).toLowerCase().includes(term)
        );

        setFilteredBoards(filtered);
    }, [searchTerm, boards]);

    const handleDelete = (e: React.MouseEvent, board: BoardState) => {
        e.stopPropagation();
        if (onBoardDelete) {
            const now = Date.now();
            const lastClick = deleteConfirmMap[board.id];

            if (lastClick && now - lastClick < 3000) {
                onBoardDelete(board);
                const newMap = { ...deleteConfirmMap };
                delete newMap[board.id];
                setDeleteConfirmMap(newMap);
                setBoards(prevBoards => prevBoards.filter(b => b.id !== board.id));
            } else {
                setDeleteConfirmMap({ ...deleteConfirmMap, [board.id]: now });
                setTimeout(() => {
                    setDeleteConfirmMap(prevMap => {
                        const newMap = { ...prevMap };
                        delete newMap[board.id];
                        return newMap;
                    });
                }, 3000);
            }
        }
    };

    const handleFavorite = async (e: React.MouseEvent, board: BoardState) => {
        e.stopPropagation();
        
        if (onBoardFavorite) {
            onBoardFavorite(board);
            
            // Pano listesini yeniden yükle
            try {
                if (ipcRenderer?.invoke) {
                    const boardList = await ipcRenderer.invoke('get-boards');
                    setBoards(boardList || []);
                    
                    // Arama filtresi varsa, filtrelenmiş listeyi de güncelle
                    if (searchTerm) {
                        const term = searchTerm.toLowerCase().trim();
                        const filtered = boardList.filter((b: BoardState) => 
                            b.displayName.toLowerCase().includes(term) ||
                            new Date(b.updatedAt).toLocaleDateString(navigator.language).toLowerCase().includes(term)
                        );
                        setFilteredBoards(filtered);
                    } else {
                        setFilteredBoards(boardList || []);
                    }
                }
            } catch (error) {
                console.error('Pano listesi alınamadı:', error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <DialogArea className="board-list-dialog-area">
            <Draggable>
                <BoardListDialogContent>
                    <div className="header">
                        <h2>{translations.boardListDialog.title}</h2>
                        <button className="close-button" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="search-container">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder={translations.boardListDialog.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onMouseDown={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="board-list">
                        {filteredBoards.map((board) => (
                            <div
                                key={board.id}
                                className={`board-item${board.isActive ? ' active' : ''}`}
                                onClick={() => {
                                    onBoardSelect(board);
                                    onClose();
                                }}
                            >
                                <div className="board-content">
                                    <div className="board-name">{board.displayName}</div>
                                    {board.id && (
                                        <div className="board-date">
                                            {new Date(board.updatedAt).toLocaleDateString(navigator.language, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div className="board-actions">
                                    <button 
                                        className={`favorite-button${board.isFavorite ? ' active' : ''}${!board.isActive && !board.isFavorite && onBoardDelete ? ' with-delete' : ''}`}
                                        onClick={(e) => handleFavorite(e, board)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                        </svg>
                                    </button>
                                    {!board.isActive && !board.isFavorite && onBoardDelete && (
                                        <button 
                                            className={`delete-button${deleteConfirmMap[board.id] ? ' confirm' : ''}`}
                                            onClick={(e) => handleDelete(e, board)}
                                        >
                                            {deleteConfirmMap[board.id] ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                                    <line x1="12" y1="17" x2="12" y2="17"></line>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18"></path>
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                </svg>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </BoardListDialogContent>
            </Draggable>
        </DialogArea>
    );
}; 