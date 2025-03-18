import { Tray, nativeImage, BrowserWindow, Menu, app } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import * as fs from 'fs';
import { getTranslation } from './translations';

export function createTrayIcon(mainWindow: BrowserWindow, tray: Tray | null): Tray | null {
  if (!tray && mainWindow) {
    try {
      const iconPath = isDev
        ? path.join(process.cwd(), `src/assets/tray-icon-${process.platform === 'darwin' ? 'apple' : 'windows'}.png`)
        : path.join(__dirname, `../../assets/tray-icon-${process.platform === 'darwin' ? 'apple' : 'windows'}.png`);

      if (!fs.existsSync(iconPath)) {
        console.error('Tray icon dosyası bulunamadı:', iconPath);
        return null;
      }

      let newTray: Tray;
      if (process.platform === 'darwin') {
        const image = nativeImage.createFromPath(iconPath);
        
        // Normal ve Retina ekranlar için görüntüler oluştur
        const normalImage = image.resize({ width: 20, height: 20, quality: 'best' });
        const retinaImage = image.resize({ width: 40, height: 40, quality: 'best' });
        
        // İki boyutu da içeren yeni bir nativeImage oluştur
        const trayImage = nativeImage.createEmpty();
        trayImage.addRepresentation({ scaleFactor: 1, buffer: normalImage.toPNG() });
        trayImage.addRepresentation({ scaleFactor: 2, buffer: retinaImage.toPNG() });
        
        trayImage.setTemplateImage(true);
        newTray = new Tray(trayImage);
      } else {
        newTray = new Tray(iconPath);
      }

      setupTrayMenu(newTray, mainWindow);
      return newTray;
    } catch (error) {
      console.error('Tray oluşturma hatası:', error);
      return null;
    }
  }
  return tray;
}

function setupTrayMenu(tray: Tray, mainWindow: BrowserWindow) {
  tray.setToolTip('Bordi');
  
  // Windows'ta sadece tıklama olayı
  if (process.platform === 'win32') {
    tray.on('click', () => showFromTray(mainWindow));
    return;
  }

  const updateContextMenu = async () => {
    try {
      const areItemsVisible = await mainWindow.webContents.executeJavaScript('window.areItemsVisible');
      console.log('areItemsVisible:', areItemsVisible);
      
      const contextMenu = Menu.buildFromTemplate([
        {
          label: getTranslation(areItemsVisible && mainWindow.isFocused() ? 'tray.hide' : 'tray.show'),
          click: () => {
            if (areItemsVisible && mainWindow.isFocused()) {
              mainWindow.webContents.send('hide-from-tray');
            } else {
              showFromTray(mainWindow);
            }
          }
        },
        { type: 'separator' },
        {
          label: getTranslation('tray.quit'),
          click: () => {
            app.quit();
            process.exit(0);
          }
        }
      ]);

      tray.setContextMenu(contextMenu);
    } catch (error) {
      console.error('Menü güncelleme hatası:', error);
    }
  };

  // İlk menü oluşturma
  updateContextMenu();

  // Pencere gösterildiğinde veya gizlendiğinde menüyü güncelle
  mainWindow.on('show', updateContextMenu);
  mainWindow.on('blur', updateContextMenu);
  mainWindow.on('focus', updateContextMenu);

  mainWindow.webContents.on('ipc-message', (event, channel) => {
    if (channel === 'items-visibility-changed') {
      updateContextMenu();
    }
  });
}

export function showFromTray(mainWindow: BrowserWindow) {
  mainWindow.show();
  
  mainWindow.webContents.executeJavaScript('window.areItemsVisible')
    .then((areItemsVisible) => {
      if (!areItemsVisible) {    
        mainWindow.webContents.send('show-from-tray');
      }
    });
} 