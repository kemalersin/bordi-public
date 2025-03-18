export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  relativeX?: number;
  relativeY?: number;
}

export interface Connection {
    start: Position;
    end: Position;
  }

export type DraggedItem = {
  id: number;
  type: 'note' | 'media';
};

export type HoveredItem = {
  id: number;
  type: 'note' | 'media';
};