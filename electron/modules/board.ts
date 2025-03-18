import * as fs from 'fs';
import * as path from 'path';
import { app, BrowserWindow } from 'electron';
import * as isDev from 'electron-is-dev';
import { getSettings, saveSettings, Settings } from './settings';
import { getTranslation } from './translations';

const USER_DATA_PATH = app.getPath('userData');
const BOARDS_DIR = path.join(USER_DATA_PATH, 'boards');
const DEFAULT_BOARD_PATH = path.join(BOARDS_DIR, 'default.board');

function findLocalizedBoardFile(): string | null {
  const locale = app.getLocale();
  const sourceFile = `default.${locale}.board`;
  const fallbackSourceFile = `default.${locale.split('-')[0]}.board`;

  const sourcePath = isDev
    ? path.join(process.cwd(), 'src', 'assets', 'boards', sourceFile)
    : path.join(__dirname, '../../assets', 'boards', sourceFile);

  const fallbackSourcePath = isDev
    ? path.join(process.cwd(), 'src', 'assets', 'boards', fallbackSourceFile)
    : path.join(__dirname, '../../assets', 'boards', fallbackSourceFile);

  const enSourcePath = isDev
    ? path.join(process.cwd(), 'src', 'assets', 'boards', 'default.en.board')
    : path.join(__dirname, '../../assets', 'boards', 'default.en.board');

  if (fs.existsSync(sourcePath)) {
    return sourcePath;
  } else if (fs.existsSync(fallbackSourcePath)) {
    return fallbackSourcePath;
  } else if (fs.existsSync(enSourcePath)) {
    return enSourcePath;
  }

  return null;
}

export function initializeBoardsDirectory() {
  if (!fs.existsSync(BOARDS_DIR)) {
    fs.mkdirSync(BOARDS_DIR, { recursive: true });
  }

  if (!fs.existsSync(DEFAULT_BOARD_PATH)) {
    try {
      const sourcePath = findLocalizedBoardFile();

      if (sourcePath) {
        fs.copyFileSync(sourcePath, DEFAULT_BOARD_PATH);
      } else {
        fs.writeFileSync(DEFAULT_BOARD_PATH, JSON.stringify({
          notes: [], medias: [], pins: [], ropes: [], maxZIndex: 0
        }, null, 2));
      }
    } catch (error) {
      console.error('Board dosyası oluşturulurken hata:', error);
      fs.writeFileSync(DEFAULT_BOARD_PATH, JSON.stringify({
        notes: [], medias: [], pins: [], ropes: [], maxZIndex: 0
      }, null, 2));
    }
  }
}

export async function loadBoard(boardId?: string) {
  try {
    const settings = getSettings();
    const defaultBoardName = getTranslation('board.defaultName');

    // Eğer boardId belirtilmemişse, settings'ten aktif board'u al
    if (!boardId) {
      boardId = settings.activeBoard;
    }

    // Eğer boardId varsa ve dosya mevcutsa, o board'u yükle
    if (boardId) {
      const boardPath = path.join(BOARDS_DIR, `${boardId}.board`);

      if (fs.existsSync(boardPath)) {
        const data = fs.readFileSync(boardPath, 'utf-8');
        return JSON.parse(data);
      }
    }

    if (!settings.boards || settings.boards.length === 0) {
      settings.boards = [];

      const defaultBoard = {
        id: 'default',
        displayName: defaultBoardName,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      settings.boards.push(defaultBoard);
    }

    // Aktif board'u boards array'inden sil
    if (settings.activeBoard !== 'default') {
      settings.boards = settings.boards.filter(board => board.id !== settings.activeBoard);
      settings.activeBoard = 'default';

      saveSettings(settings);
    }

    // Aktif board yoksa veya yüklenemezse default board'u yükle
    if (fs.existsSync(DEFAULT_BOARD_PATH)) {
      const data = fs.readFileSync(DEFAULT_BOARD_PATH, 'utf-8');
      return JSON.parse(data);
    }

    // Default board yoksa dile uygun saf board'u yükle
    const sourcePath = findLocalizedBoardFile();
    if (sourcePath) {
      const data = fs.readFileSync(sourcePath, 'utf-8');
      return JSON.parse(data);
    }

    // Hiçbir dosya bulunamazsa boş board döndür
    return { notes: [], medias: [], pins: [], ropes: [], maxZIndex: 0 };
  } catch (error) {
    console.error('Board yüklenirken hata:', error);
    return { notes: [], medias: [], pins: [], ropes: [], maxZIndex: 0 };
  }
}

export async function saveBoard(data: any, boardId?: string) {
  try {
    let settings = getSettings();
    
    // Eğer boardId belirtilmemişse, settings'ten aktif board'u al
    if (!boardId) {
      boardId = settings.activeBoard;
    }

    // Board'u kaydet (boardId yoksa default board'a kaydet)
    const boardPath = boardId
      ? path.join(BOARDS_DIR, `${boardId}.board`)
      : DEFAULT_BOARD_PATH;

    fs.writeFileSync(boardPath, JSON.stringify(data, null, 2));

    // Settings'teki ilgili board kaydının güncelleme tarihini güncelle
    if (boardId && settings.boards) {
      settings.boards = settings.boards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            updatedAt: new Date().toISOString()
          };
        }
        return board;
      });
      saveSettings(settings);
    }

    return true;
  } catch (error) {
    console.error('Board kaydedilirken hata:', error);
    throw error;
  }
}

export async function copyDefaultBoard(boardId: string, mainWindow?: BrowserWindow) {
  try {
    mainWindow?.webContents.send('hide-from-tray');

    const sourcePath = findLocalizedBoardFile();
    const boardPath = path.join(BOARDS_DIR, `${boardId}.board`);

    if (sourcePath) {
      fs.copyFileSync(sourcePath, boardPath);
    } else {
      fs.writeFileSync(boardPath, JSON.stringify({
        notes: [], medias: [], pins: [], ropes: [], maxZIndex: 0
      }, null, 2));
    }

    setTimeout(() => {
      mainWindow?.webContents.send('show-from-tray');
    }, 300);

    return true;
  } catch (error) {
  }
}

export async function updateBoardSettings(action: { type: string; board?: Settings['boards'][0] }, mainWindow?: BrowserWindow) {
  try {
    // Mevcut ayarları al
    const settings = getSettings();

    switch (action.type) {
      case 'add':
        // Eski aktif panoyu deaktif et
        if (settings.boards.length > 0) {
          settings.boards = settings.boards.map(board => ({
            ...board,
            isActive: false
          }));
        }

        // Yeni panoyu ekle
        if (action.board) {
          settings.boards.push(action.board);
          settings.activeBoard = action.board.id;
        }

        break;

      case 'set-active':
        mainWindow?.webContents.send('hide-from-tray');

        if (action.board) {
          // Tüm panoları deaktif et
          settings.boards = settings.boards.map(board => ({
            ...board,
            isActive: board.id === action.board.id
          }));

          // Aktif panoyu güncelle
          settings.activeBoard = action.board.id;
        }

        setTimeout(() => {
          mainWindow?.webContents.send('show-from-tray');
        }, 300);

        break;

      default:
        throw new Error('Geçersiz işlem tipi');
    }

    // Ayarları kaydet
    saveSettings(settings);

    return true;
  } catch (error) {
    console.error('Pano ayarları güncellenirken hata:', error);
    throw error;
  }
}

export async function deleteBoard(boardId: string) {
  try {
    const boardPath = path.join(BOARDS_DIR, `${boardId}.board`);
    
    if (fs.existsSync(boardPath)) {
      fs.unlinkSync(boardPath);
    }
    const settings = getSettings();
    settings.boards = settings.boards.filter(board => board.id !== boardId);

    saveSettings(settings);
    return true;
  } catch (error) {
    console.error('Board silinirken hata:', error);
    throw error;
  }
}

export async function toggleFavoriteBoard(boardId: string) {
  try {
    const settings = getSettings();
    
    // Board'u bul ve favori durumunu değiştir
    settings.boards = settings.boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          isFavorite: board.isFavorite ? !board.isFavorite : true
        };
      }
      return board;
    });

    // Ayarları kaydet
    saveSettings(settings);
    return true;
  } catch (error) {
    console.error('Board favori durumu değiştirilirken hata:', error);
    throw error;
  }
} 