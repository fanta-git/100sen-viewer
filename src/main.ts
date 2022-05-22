import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import electronPrompt from 'electron-prompt';
import { stringifier, stringify } from 'csv';

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

ipcMain.handle('electronPrompt', (event, ...args: Parameters<typeof electronPrompt>) => electronPrompt(...args));

ipcMain.handle('csvStringifySync', (event, input: stringifier.Input, option: stringifier.Options) => new Promise<string>(
    resolve => stringify(
        input,
        option,
        (err, output) => resolve(output)
    )
));

app.whenReady().then(createWindow);
