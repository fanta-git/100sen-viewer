import { parser } from "csv";
import { ipcRenderer } from "electron";


type funcT = (filePath: string, option: parser.Options) => Promise<Record<string, string>[]>;
const csvParseSync: funcT = (filePath, option) => ipcRenderer.invoke('csvParseSync', filePath, option);

export default csvParseSync;
