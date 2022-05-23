import { ipcRenderer } from "electron";
import type electronPromptT from 'electron-prompt';

type funcT = (...args: Parameters<typeof electronPromptT>) => Promise<string>;
const electronPrompt: funcT = (...args) => ipcRenderer.invoke('electronPrompt', ...args);

export default electronPrompt;
