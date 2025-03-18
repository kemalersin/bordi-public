/**
 * Electron yardımcı fonksiyonları
 */

import { IpcRenderer } from 'electron';
import { IpcRendererLike } from '../types/Electron.types';

// Electron ortamında olup olmadığımızı kontrol eder
export const isElectron = () => {
  return window && window.process && window.process.type;
};

// IPC Renderer'ı güvenli bir şekilde alır
export const getIpcRenderer = (): IpcRenderer | null => {
  if (isElectron()) {
    return (window as any).require('electron').ipcRenderer;
  }
  return null;
};

// Geliştirme ortamında IPC mesajlarını simüle eder
export const mockIpcRenderer: IpcRendererLike = {
  send: (channel: string, ...args: any[]) => {
    console.debug(`IPC Mock - Channel: ${channel}`, ...args);
  },
  on: (channel: string, listener: (...args: any[]) => void) => {
    console.debug(`IPC Mock - Listening on channel: ${channel}`);
  },
  removeListener: (channel: string, listener: (...args: any[]) => void) => {
    console.debug(`IPC Mock - Removed listener from channel: ${channel}`);
  },
  invoke: async (channel: string, ...args: any[]) => {
    console.debug(`IPC Mock - Invoke channel: ${channel}`, ...args);
    return null;
  }
};

// IPC Renderer'ı veya mock'unu döndürür
export const getIpcRendererOrMock = (): IpcRendererLike => {
  return getIpcRenderer() || mockIpcRenderer;
}; 