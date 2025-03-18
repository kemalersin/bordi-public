import * as net from 'net';
import * as path from 'path';
const express = require('express');
import { app } from 'electron';
import { getSettings, saveSettings } from './settings';

const expressApp = express();

export function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        server.close();
        resolve(true);
      })
      .listen(port);
  });
}

export async function startServer(): Promise<number> {
  expressApp.use(express.static(path.join(__dirname, '../../dist')));

  try {
    const savedPort = getSettings().server.port;
    if (savedPort) {
      const isAvailable = await isPortAvailable(savedPort);
      if (isAvailable) {
        await new Promise<void>((resolve, reject) => {
          expressApp.listen(savedPort, () => {
            console.log(`Server başlatıldı (kayıtlı port): http://localhost:${savedPort}`);
            resolve();
          }).on('error', reject);
        });
        return savedPort;
      }
    }

    let port = 22222;

    while (!(await isPortAvailable(port))) {
      port++;
      if (port > 23221) {
        console.error('Kullanılabilir port bulunamadı');
        app.exit(1);
        throw new Error('No available port found.');
      }
    }

    await new Promise<void>((resolve, reject) => {
      expressApp.listen(port, () => {
        console.log(`Server başlatıldı (yeni port): http://localhost:${port}`);
        resolve();
      }).on('error', reject);
    });

    saveSettings({ ...getSettings(), server: { port } });
    return port;
  } catch (error) {
    console.error('Server başlatılamadı:', error);
    app.exit(1);
    throw error;
  }
} 