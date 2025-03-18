import { IpcRenderer } from 'electron';

/**
 * IPC Renderer benzeri bir arayüz
 * Hem gerçek IpcRenderer hem de mock versiyonu için kullanılır
 */
export interface IpcRendererLike {
  send: (channel: string, ...args: any[]) => void;
  on: (channel: string, listener: (...args: any[]) => void) => void;
  removeListener: (channel: string, listener: (...args: any[]) => void) => void;
  invoke?: (channel: string, ...args: any[]) => Promise<any>;
}

/**
 * IPC kanalları için tip tanımları
 * Her kanal için gönderilen ve alınan veri tiplerini tanımlar
 */
export type IpcChannel = 
  | 'mouse-over-interactive'
  | 'drag-state-changed'
  | 'quit-app'
  | 'set-ignore-mouse-events'
  | 'load-board'
  | 'save-board';

export type IpcPayload = boolean | string | number | object; 