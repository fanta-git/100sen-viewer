import { contextBridge } from "electron";

import getAPI from "./getAPI";
import getNicovideoData from "./getNicovideoData";

const preload = {
    getAPI,
    getNicovideoData
};

contextBridge.exposeInMainWorld('api', preload);

export default preload;
