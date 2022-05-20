import { contextBridge } from "electron";

import * as getListData from './getListData';
import getVideoData from "./getVideoData";

const preload = {
    ...getListData,
    getVideoData
};

contextBridge.exposeInMainWorld('api', preload);

export default preload;
