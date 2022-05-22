import { ipcRenderer } from 'electron';
import handles from './handleData';

type funcT = <T extends keyof typeof handles>(channel: T) => (...args: Parameters<typeof handles[T]>) => Promise<ReturnType<typeof handles[T]>>;
const ipcMainInvoke: funcT = channel => (...args) => ipcRenderer.invoke(channel, ...args);

export default ipcMainInvoke;
