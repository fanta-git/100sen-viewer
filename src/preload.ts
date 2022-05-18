import { contextBridge } from "electron";
import fetch from 'node-fetch';

import type { PlaylistContents, SongData } from './types';

const preload = {
    getPlaylistSongs: async (listId: string) => {
        const res = await fetch('https://cafe.kiite.jp/api/playlists/contents/detail?list_id=' + listId).then(v => v.json()) as PlaylistContents;
        if (res.status === 'failed') return;
        const videoIdsStr = res.songs.map(v => v.video_id).join(',');
        const songDatas = await fetch('https://cafe.kiite.jp/api/songs/by_video_ids?video_ids=' + videoIdsStr).then(v => v.json()) as SongData[];
        return songDatas;
    }
}

contextBridge.exposeInMainWorld('api', preload);

export default preload;
