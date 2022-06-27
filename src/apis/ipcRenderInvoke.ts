import { ipcRenderer, dialog, shell } from 'electron';
import type { stringifier, parser } from 'csv';
import type electronPromptT from 'electron-prompt';

type eleProT = (...args: Parameters<typeof electronPromptT>) => Promise<string>;
const electronPrompt: eleProT = (...args) => ipcRenderer.invoke('electronPrompt', ...args);

type stringfyT = (input: stringifier.Input, option: stringifier.Options) => Promise<string>;
const csvStringifySync: stringfyT = (input, option) => ipcRenderer.invoke('csvStringifySync', input, option);

type parserT = (filePath: string, option: parser.Options) => Promise<Record<string, string>[]>;
const csvParseSync: parserT = (filePath, option) => ipcRenderer.invoke('csvParseSync', filePath, option);

const showErrorBox = (title: string, text: string) => ipcRenderer.invoke('showErrorBox', title, text);

const showOpenDialogSync = (...args: Parameters<typeof dialog.showOpenDialogSync>) => ipcRenderer.invoke('showOpenDialogSync', ...args) as Promise<ReturnType<typeof dialog.showOpenDialogSync>>;

const showMessageBoxSync = (...args: Parameters<typeof dialog.showMessageBoxSync>) => ipcRenderer.invoke('showMessageBoxSync', ...args) as Promise<ReturnType<typeof dialog.showMessageBoxSync>>;

const { openExternal } = shell;

export default {
    electronPrompt,
    csvStringifySync,
    csvParseSync,
    showErrorBox,
    showOpenDialogSync,
    showMessageBoxSync,
    openExternal
};
