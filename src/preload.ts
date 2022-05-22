import { contextBridge } from "electron";

import getListData from './apis/getListData';
import getVideoData from "./apis/getVideoData";
import electronPrompt from "./apis/electronPrompt";

const preload = {
    getListData,
    getVideoData,
    electronPrompt
};

contextBridge.exposeInMainWorld('api', preload);

export default preload;
