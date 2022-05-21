import { contextBridge } from "electron";

import getListData from './apis/getListData';
import getVideoData from "./apis/getVideoData";

const preload = {
    getListData,
    getVideoData
};

contextBridge.exposeInMainWorld('api', preload);

export default preload;
