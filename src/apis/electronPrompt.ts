import { ipcRenderer } from "electron";
import type electronPrpmptT from 'electron-prompt';

const electronPrompt = async (options?: electronPrpmptT.Options) => {
    const result = await ipcRenderer.invoke('electronPrompt', options);
    return result;
};

export default electronPrompt;
