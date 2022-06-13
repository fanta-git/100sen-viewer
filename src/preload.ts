import { contextBridge } from 'electron';

import getListData from './apis/getListData';
import getVideoData from './apis/getVideoData';
import getVocadbData from './apis/getVocadbData';
import ipcRenderInvoke from './apis/ipcRenderInvoke';

const preload = {
    getListData,
    getVideoData,
    getVocadbData,
    ...ipcRenderInvoke
};

contextBridge.exposeInMainWorld('api', preload);

export default preload;
