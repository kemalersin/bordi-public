import { BrowserWindow } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';

export function getWindowConfig({ x, y, width, height }: Electron.Rectangle): Electron.BrowserWindowConstructorOptions {
  return {
    title: 'Bordi',
    x,
    y,
    width,
    height,
    icon: isDev
      ? path.join(process.cwd(), 'public', 'icons', process.platform === 'win32' ? 'win/icon.ico' : process.platform === 'darwin' ? 'mac/icon.icns' : 'png/512x512.png')
      : path.join(__dirname, '../../public', 'icons', process.platform === 'win32' ? 'win/icon.ico' : process.platform === 'darwin' ? 'mac/icon.icns' : 'png/512x512.png'),
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    type: process.platform === 'darwin' ? 'normal' : 'desktop', 
    focusable: true,
    acceptFirstMouse: true,
    skipTaskbar: true,
    hasShadow: false,
    fullscreen: process.platform !== 'darwin',
    alwaysOnTop: process.platform === 'darwin'
  };
}