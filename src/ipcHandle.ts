import { ipcMain } from 'electron';
import handles from './handleData';

const ipcMainHandle = () => {
    for (const [channel, func] of Object.entries(handles)) ipcMain.handle(channel, ((event, ...args) => func(...args)));
};

export default ipcMainHandle;
