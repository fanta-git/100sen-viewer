import { ipcRenderer } from "electron";
import type { stringifier, parser } from "csv";
import type electronPromptT from 'electron-prompt';
import type { dialog } from 'electron';

type eleProT = (...args: Parameters<typeof electronPromptT>) => Promise<string>;
const electronPrompt: eleProT = (...args) => ipcRenderer.invoke('electronPrompt', ...args);

type stringfyT = (input: stringifier.Input, option: stringifier.Options) => Promise<string>;
const csvStringifySync: stringfyT = (input, option) => ipcRenderer.invoke('csvStringifySync', input, option);

type parserT = (filePath: string, option: parser.Options) => Promise<Record<string, string>[]>;
const csvParseSync: parserT = (filePath, option) => ipcRenderer.invoke('csvParseSync', filePath, option);

const showErrorBox = (title: string, text: string) => ipcRenderer.invoke('showErrorBox', title, text);

export default {
    electronPrompt,
    csvStringifySync,
    csvParseSync,
    showErrorBox
};
