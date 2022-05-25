import { contextBridge } from "electron";

import getListData from './apis/getListData';
import getVideoData from "./apis/getVideoData";
import ipcRenderInvoke from "./apis/ipcRenderInvoke";

const preload = {
    getListData,
    getVideoData,
    ...ipcRenderInvoke
};

contextBridge.exposeInMainWorld('api', preload);

export default preload;
