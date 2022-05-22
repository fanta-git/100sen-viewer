import { contextBridge } from "electron";

import getListData from './apis/getListData';
import getVideoData from "./apis/getVideoData";
import electronPrompt from "./apis/electronPrompt";
import csvStringifySync from "./apis/csvStringifySync";

const preload = {
    getListData,
    getVideoData,
    electronPrompt,
    csvStringifySync
};

contextBridge.exposeInMainWorld('api', preload);

export default preload;
