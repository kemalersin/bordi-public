export interface ActionBarProps {
  style?: React.CSSProperties;
  isDragging: boolean;
  onAddNote: () => void;
  onAddMedia: () => void;
  onAddVideoUrl: () => void;
  onToggleVisibility: () => void;
  onAddBoard: () => void;
  onSelectBoard: () => void;
  onBackgroundChange: (type: 'transparent' | 'color' | 'image', value?: string) => void;
  currentBackground: {
    type: 'transparent' | 'color' | 'image';
    value?: string;
  };
  boards?: { id: string; displayName: string; isActive: boolean; }[];
}

export interface DisplayListProps {
  displays: {
    id: number;
    bounds: { x: number; y: number; width: number; height: number };
    workArea: { x: number; y: number; width: number; height: number };
    isPrimary: boolean;
    isActive: boolean;
  }[];
  onDisplaySelect?: (displayId: number) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isClosing?: boolean;
} 