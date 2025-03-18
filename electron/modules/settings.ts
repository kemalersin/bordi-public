import * as fs from 'fs';
import { app } from 'electron';
import * as path from 'path';

export interface Settings {
  server: {
    port: number;
  };
  display: {
    id: number;
  };
  boards: Array<{
    id: string;
    displayName: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    isFavorite?: boolean;
  }>;
  activeBoard: string;
}

const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json');
const DEFAULT_SETTINGS: Settings = {
  server: { port: 22222 },
  display: {
    id: 0
  },
  boards: [],
  activeBoard: ''
};

export function validateSettings(settings: Settings): Settings {
  // Ekran id'si geçerli mi kontrol et
  if (typeof settings.display.id !== 'number') {
    settings.display.id = require('electron').screen.getPrimaryDisplay().id;
  }

  // Port numarası geçerli mi kontrol et
  if (typeof settings.server.port !== 'number' || 
      settings.server.port < 22222 || 
      settings.server.port > 23221) {
    settings.server.port = DEFAULT_SETTINGS.server.port;
  }

  return settings;
}

export function getSettings(): Settings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
      const mergedSettings = { ...DEFAULT_SETTINGS, ...settings };
      return validateSettings(mergedSettings);
    }
  } catch (error) {
    console.error('Settings dosyası okunamadı:', error);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings): void {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Settings kaydedilemedi:', error);
  }
} 