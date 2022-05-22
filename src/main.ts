import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import electronPrompt from 'electron-prompt';

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1054,
        height: 740,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    mainWindow.loadFile('dist/index.html');
    mainWindow.once('closed', app.quit);
};

ipcMain.handle('electronPrompt', (event: Electron.IpcMainInvokeEvent, ...args: Parameters<typeof electronPrompt>) => {
    return electronPrompt(...args);
});

app.whenReady().then(createWindow);
