import { useState } from 'react';
import { NoteData } from '../types/Note.types';
import { MediaData } from '../types/MediaFrame.types';
import { Position } from '../types/Common.types';
import { RopeSegment } from '../types/ConnectionLine.types';
import { PinData } from '../types/Pin.types';
import { BoardState } from '../types/Board.types';

export function useAppState() {
  // State Yönetimi
  /**
   * notes: Not dizisi
   * Özellikler:
   * - id: Benzersiz tanımlayıcı
   * - content: Not içeriği
   * - x, y: Konum
   * - rotation: Dönüş açısı (-5 ile +5 arası)
   * - zIndex: Katman sırası
   * - color: Arkaplan rengi
   * - fontSize: Yazı boyutu
   * - createdAt: Oluşturma zamanı
   */
  const [notes, setNotes] = useState<NoteData[]>([]);

  /**
   * medias: Medya dizisi
   * Özellikler:
   * - id: Benzersiz tanımlayıcı
   * - src: Görsel kaynağı (URL veya base64)
   * - x, y: Konum
   * - rotation: Dönüş açısı
   * - zIndex: Katman sırası
   */
  const [medias, setMedias] = useState<MediaData[]>([]);

  /**
   * maxZIndex: En üst katman indeksi
   * - Her yeni nesne veya öne getirme işleminde artırılır
   * - İpler için nesne zIndex + 1 kullanılır
   */
  const [maxZIndex, setMaxZIndex] = useState(0);

  /**
   * Sürükleme ve Etkileşim Durumları
   * - isDragging: Aktif sürükleme var mı?
   * - editingNoteId: Düzenlenen not ID
   * - positions: Tüm nesnelerin anlık pozisyonları
   * - pins: Raptiye dizisi
   * - ropes: İp dizisi
   * - draggedPin: Sürüklenen raptiye
   * - mousePosition: Fare konumu
   * - temporaryRope: Geçici ip (sürükleme sırasında)
   * - isDragOverTrash: Çöp kutusu üzerinde mi?
   * - draggedItemInfo: Sürüklenen nesne bilgisi
   * - areItemsVisible: Nesneler görünür mü?
   * - isFirstRender: İlk render mı?
   * - isHiding: Gizlenme animasyonu aktif mi?
   * - hoveredItem: Fare üzerindeki nesne
   */
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingDelayed, setIsDraggingDelayed] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [pins, setPins] = useState<PinData[]>([]);
  const [ropes, setRopes] = useState<RopeSegment[]>([]);
  const [draggedPin, setDraggedPin] = useState<PinData | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [temporaryRope, setTemporaryRope] = useState<RopeSegment | null>(null);
  const [isDragOverTrash, setIsDragOverTrash] = useState(false);
  const [draggedItemInfo, setDraggedItemInfo] = useState<{ id: number; type: 'note' | 'media' } | null>(null);
  const [areItemsVisible, setAreItemsVisible] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<{ id: number; type: 'note' | 'media' } | null>(null);
  const [isVideoUrlDialogOpen, setIsVideoUrlDialogOpen] = useState(false);
  const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false);
  const [isBoardListDialogOpen, setIsBoardListDialogOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Font yükleme durumu
  const [areFontsLoaded, setAreFontsLoaded] = useState(false);

  // Son font ayarları
  const [lastFontSettings, setLastFontSettings] = useState({
    family: "'Caveat', cursive",
    size: 1.2
  });

  const [background, setBackground] = useState<{
    type: 'transparent' | 'color' | 'image';
    value?: string;
  }>({ type: 'transparent' });

  const [isAppReady, setIsAppReady] = useState(false);
  const [boards, setBoards] = useState<BoardState[]>([]);

  // Aktif pano
  const [activeBoard, setActiveBoard] = useState<BoardState | null>(null);

  return {
    notes, setNotes,
    medias, setMedias,
    maxZIndex, setMaxZIndex,
    isDragging, setIsDragging,
    isDraggingDelayed, setIsDraggingDelayed,
    editingNoteId, setEditingNoteId,
    positions, setPositions,
    pins, setPins,
    ropes, setRopes,
    draggedPin, setDraggedPin,
    mousePosition, setMousePosition,
    temporaryRope, setTemporaryRope,
    isDragOverTrash, setIsDragOverTrash,
    draggedItemInfo, setDraggedItemInfo,
    areItemsVisible, setAreItemsVisible,
    isHiding, setIsHiding,
    isInitialRender, setIsInitialRender,
    hoveredItem, setHoveredItem,
    isVideoUrlDialogOpen, setIsVideoUrlDialogOpen,
    isBoardDialogOpen, setIsBoardDialogOpen,
    isBoardListDialogOpen, setIsBoardListDialogOpen,
    modalImage, setModalImage,
    areFontsLoaded, setAreFontsLoaded,
    lastFontSettings, setLastFontSettings,
    background, setBackground,
    isAppReady, setIsAppReady,
    boards, setBoards,
    activeBoard, setActiveBoard
  };
} 