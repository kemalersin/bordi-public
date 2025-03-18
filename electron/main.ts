import { app, BrowserWindow, globalShortcut, ipcMain, Menu, screen, Tray, shell, dialog, Display } from 'electron';
import * as isDev from 'electron-is-dev';
import { initializeBoardsDirectory, loadBoard, saveBoard, copyDefaultBoard, updateBoardSettings, deleteBoard, toggleFavoriteBoard } from './modules/board';
import { startServer } from './modules/server';
import { getWindowConfig } from './modules/window';
import { createTrayIcon, showFromTray } from './modules/tray';
import { getSettings, saveSettings } from './modules/settings';
import { getTranslation } from './modules/translations';

interface MediaData {
  bookmark?: string;
  [key: string]: any;
}

let mainWindow: BrowserWindow | null = null;
let activeDisplay: Display | null = null;
let tray: Tray | null = null;
let dialogOpened: boolean = false;

// stopAccessingSecurityScopedResource fonksiyonlarını saklamak için Map
const stopAccessingFunctions = new Map<number, () => void>();

const scaleWindow = (targetDisplay: Electron.Display, show?: boolean) => {
  if (!mainWindow) return;

  const baseWidth = 1920;
  const zoomFactor = Math.max(1, targetDisplay.bounds.width / baseWidth);
  mainWindow.webContents.setZoomFactor(zoomFactor);

  mainWindow.setBounds(targetDisplay.workArea);
  mainWindow.setSize(targetDisplay.workArea.width, targetDisplay.workArea.height);

  if (show) {
    mainWindow.show();
  }
}

async function createWindow() {
  initializeBoardsDirectory();

  const settings = getSettings();
  const displays = screen.getAllDisplays();

  let targetDisplay = displays.find(display => display.id === settings.display.id);

  const primaryDisplay = screen.getPrimaryDisplay();

  if (!targetDisplay) {
    targetDisplay = primaryDisplay;
    settings.display.id = targetDisplay.id;

    saveSettings(settings);
  }

  activeDisplay = targetDisplay;
  mainWindow = new BrowserWindow(getWindowConfig(targetDisplay.workArea));   

  setupWindowEvents();
  setupIpcHandlers();
  setupShortcuts();
  setupMenu();

  tray = createTrayIcon(mainWindow, tray);

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    try {
      const port = await startServer();
      mainWindow.loadURL(`http://localhost:${port}`);
    } catch (error) {
      console.error('Server başlatılamadı:', error);
      app.quit();
    }
  }
}

function setupWindowEvents() {
  if (!mainWindow) return;

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('blur', async () => {
    mainWindow.setIgnoreMouseEvents(false);
  });

  screen.on('display-added', () => {
    if (mainWindow) {
      mainWindow.webContents.send('displays-changed');
    }
  });

  screen.on('display-removed', (event: any, oldDisplay: Display) => {
    if (mainWindow) {
      mainWindow.webContents.send('displays-changed');

      const settings = getSettings();

      if (settings.display.id === oldDisplay.id) {
        const targetDisplay = screen.getPrimaryDisplay();

        activeDisplay = targetDisplay;
        settings.display.id = targetDisplay.id;

        saveSettings(settings);
        scaleWindow(targetDisplay);
      }
    }
  });

  screen.on('display-metrics-changed', (event: any, display: Display) => {
    if (mainWindow) {
      const settings = getSettings();

      if (settings.display.id === display.id) {
        scaleWindow(display);
        console.log('display-metrics-changed', display.workArea);
      }
    }
  });
}

function setupIpcHandlers() {
  ipcMain.handle('get-displays', () => {
    const displays = screen.getAllDisplays();
    const primaryDisplay = screen.getPrimaryDisplay();
    const windowBounds = mainWindow?.getBounds();

    return displays.map((display, index) => ({
      id: display.id,
      bounds: display.bounds,
      workArea: display.workArea,
      isPrimary: display.id === primaryDisplay.id,
      isActive: windowBounds ? screen.getDisplayMatching(windowBounds).id === display.id : false
    }));
  });

  ipcMain.handle('load-board', async (event, boardId?: string) => {
    const boardData = await loadBoard(boardId);

    // macOS'ta bookmark'ları kullanarak dosya erişimini sağla
    if (process.platform === 'darwin' && boardData?.medias) {
      boardData.medias.forEach((media: MediaData) => {
        if (media.bookmark) {
          // Her medya için stopAccessingSecurityScopedResource fonksiyonunu sakla
          const stopAccessing = app.startAccessingSecurityScopedResource(media.bookmark);
          // MediaData'ya stopId ekle
          media.stopId = Date.now() + Math.random();
          // stopAccessing fonksiyonunu geçici olarak sakla
          stopAccessingFunctions.set(media.stopId, () => stopAccessing());
        }
      });
    }

    return boardData;
  });

  ipcMain.handle('save-board', (event, data) => saveBoard(data));

  ipcMain.on('quit-app', () => {
    app.quit();
    process.exit(0);
  });

  ipcMain.on('set-window-focusable', (event, focusable) => {
    if (mainWindow) {
      mainWindow.setFocusable(focusable);
      mainWindow.setSkipTaskbar(true);
    }
  });

  ipcMain.on('open-external-url', (event, url) => {
    shell.openExternal(url);
  });

  let isOverInteractiveElement = false;
  let isDragging = false;
  let currentBackgroundType = 'transparent';
  let isContentVisible = true;

  function updateMouseEvents() {
    if (!mainWindow) return;

    // Arkaplan şeffaf değilse hiçbir durumda arkaya geçirme
    if (currentBackgroundType !== 'transparent') {
      mainWindow.setIgnoreMouseEvents(false);
      return;
    }

    // İçerik gizliyse ve şeffaf arkaplandaysa arkaya geçir
    if (!isContentVisible) {
      mainWindow.setIgnoreMouseEvents(true, { forward: true });
      return;
    }

    // Etkileşimli eleman üzerinde veya sürükleme varsa normal kullan
    if (isOverInteractiveElement || isDragging) {
      mainWindow.setIgnoreMouseEvents(false);
      return;
    }

    // Diğer durumlarda arkaya geçir
    mainWindow.setIgnoreMouseEvents(true, { forward: true });
  }

  ipcMain.on('set-ignore-mouse-events', (event, ignore: boolean, backgroundType?: string) => {
    // İçerik görünürlüğünü güncelle
    isContentVisible = !ignore;

    // Arkaplan tipini güncelle
    if (backgroundType) {
      currentBackgroundType = backgroundType;
    }

    updateMouseEvents();
  });

  ipcMain.on('mouse-over-interactive', (event, isOver) => {
    if (dialogOpened) return;

    isOverInteractiveElement = isOver;
    updateMouseEvents();

    if (mainWindow && process.platform === 'darwin') {
      if (!mainWindow.isFocused()) {
        mainWindow.blur();
      }

      if (isOver) {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });

  ipcMain.on('drag-state-changed', (event, dragging) => {
    isDragging = dragging;
    updateMouseEvents();
  });

  ipcMain.handle('select-files', async () => {
    if (!mainWindow) return { canceled: true, filePaths: [], bookmarks: [] };

    mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);

    dialogOpened = true;

    const result = await dialog.showOpenDialog(mainWindow, {
      securityScopedBookmarks: true,
      properties: ['openFile'],
      filters: [
        { name: getTranslation('dialog.mediaFiles'), extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'webm', 'ogg'] }
      ]
    });

    setTimeout(() => {
      dialogOpened = false;

      mainWindow?.show();
      mainWindow?.setAlwaysOnTop(false);
    }, 100);

    return result;
  });

  // Dosya erişimini sonlandırmak için yeni handler
  ipcMain.handle('stop-accessing-file', (event, stopId: number) => {
    const stopAccessing = stopAccessingFunctions.get(stopId);
    if (stopAccessing) {
      stopAccessing();
      stopAccessingFunctions.delete(stopId);
    }
  });

  ipcMain.handle('move-to-display', (event, displayId: number) => {
    if (!mainWindow) return;

    const displays = screen.getAllDisplays();
    const targetDisplay = displays.find(display => display.id === displayId);

    if (targetDisplay) {
      activeDisplay = targetDisplay;

      mainWindow.webContents.send('hide-for-display-change');

      const settings = getSettings();
      settings.display.id = displayId;

      saveSettings(settings);

      setTimeout(() => {
        scaleWindow(targetDisplay, true);
        mainWindow.webContents.send('show-after-display-change');
      }, 600);
    }
  });

  ipcMain.handle('get-display-info', () => {
    const display = activeDisplay || screen.getPrimaryDisplay();

    // Otomatik olarak zoom faktörünü ayarlayın
    if (mainWindow) {
      // Referans genişliğe göre ölçeklendirme faktörünü hesaplayın
      const baseWidth = 1920; // Referans genişlik
      const zoomFactor = Math.max(1, display.bounds.width / baseWidth);
      mainWindow.webContents.setZoomFactor(zoomFactor);
    }

    console.log('get-display-info', display.scaleFactor, display.bounds.width, display.bounds.height, display.workArea.width, display.workArea.height);

    return {
      scaleFactor: display.scaleFactor,
      width: display.bounds.width,
      height: display.bounds.height,
      workAreaWidth: display.workArea.width,
      workAreaHeight: display.workArea.height
    };
  });

  // Yeni handler: Zoom faktörünü manuel olarak ayarlamak için
  ipcMain.handle('set-zoom-factor', (event, factor) => {
    if (mainWindow) {
      mainWindow.webContents.setZoomFactor(factor);
      return true;
    }
    return false;
  });

  ipcMain.handle('copy-default-board', async (event, boardId) => {
    return await copyDefaultBoard(boardId, mainWindow);
  });

  ipcMain.handle('update-board-settings', async (event, action) => {
    return await updateBoardSettings(action, mainWindow);
  });

  ipcMain.handle('delete-board', async (event, boardId: string) => {
    try {
      const result = await deleteBoard(boardId);
      return result;
    } catch (error) {
      console.error('Pano silinirken hata:', error);
      throw error;
    }
  });

  ipcMain.handle('toggle-favorite-board', async (event, boardId: string) => {
    try {
      const result = await toggleFavoriteBoard(boardId);
      return result;
    } catch (error) {
      console.error('Pano silinirken hata:', error);
      throw error;
    }
  });

  ipcMain.handle('get-boards', async () => {
    let settings = getSettings();

    if (!settings.boards || settings.boards.length === 0) {
      await loadBoard();
      settings = getSettings();
    }

    return settings.boards;
  });
}

function setupShortcuts() {
  globalShortcut.register('F12', () => {
    if (!mainWindow) return;
    const webContents = mainWindow.webContents;
    if (webContents.isDevToolsOpened()) {
      webContents.closeDevTools();
    }
  });
}

function setupMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Düzenle',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Uygulama yaşam döngüsü
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      showFromTray(mainWindow);
    }
  });

  // macOS'te Dock simgesini göster
  if (process.platform === 'darwin') {
    //app.dock?.show();
  }

  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => {
    globalShortcut.unregisterAll();
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('before-quit', async (event) => {
    if (mainWindow) {
      try {
        event.preventDefault();
        mainWindow.hide();

        if (tray) {
          try {
            tray.destroy();
            tray = null;
          } catch (error) {
            console.error('Tray temizleme hatası:', error);
          }
        }

        app.exit(0);
      } catch (error) {
        console.error('Kritik hata:', error);
        app.exit(1);
      }
    } else {
      app.exit(0);
    }
  });
}