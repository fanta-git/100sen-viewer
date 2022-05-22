import { ipcRenderer } from "electron";
import type electronPrpmptT from 'electron-prompt';

const electronPrompt = async (options?: electronPrpmptT.Options) => {
    const result = await ipcRenderer.invoke('electronPrompt', options) as string | null;
    return result;
};

export default electronPrompt;
