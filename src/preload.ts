import { contextBridge } from "electron";

import getListData from './apis/getListData';
import getVideoData from "./apis/getVideoData";
import electronPrompt from "./apis/electronPrompt";
import csvStringifySync from "./apis/csvStringifySync";
import csvParseSync from "./apis/csvParserSync";

const preload = {
    getListData,
    getVideoData,
    electronPrompt,
    csvStringifySync,
    csvParseSync
};

contextBridge.exposeInMainWorld('api', preload);

export default preload;
