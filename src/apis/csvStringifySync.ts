import { stringifier } from "csv";
import { ipcRenderer } from "electron";

type funcT = (input: stringifier.Input, option: stringifier.Options) => Promise<string>;
const csvStringifySync: funcT = (input, option) => ipcRenderer.invoke('csvStringifySync', input, option);

export default csvStringifySync;
