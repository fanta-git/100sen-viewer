import { contextBridge } from "electron";
import fetch from 'node-fetch';

import type { PlaylistContents, SongData } from './types';

type playlistTypes = 'Kiite' | 'niconico';
type typeParseQueryParam = (url: string, param?: Record<string, number | string | number[] | string[]>) => string;

const urlConnectParam: typeParseQueryParam = (url, param) => {
    if (param === undefined) return url;
    const queryStr: string[] = [];
    for (const [key, value] of Object.entries(param)) queryStr.push(
        `${key}=${Array.isArray(value) ? value.join(',') : value}`
    );
    return `${url}?${queryStr.join('&')}`;
};

const preload = {
    getPlaylistSongs: async (type: playlistTypes, listId: string) => {
        if (type = 'Kiite') {
            const url = urlConnectParam('https://cafe.kiite.jp/api/playlists/contents/detail', { list_id: listId });
            console.log(url);
            const res = await fetch(url).then(v => v.json()) as PlaylistContents;
            if (res.status === 'failed') return;
            return res.songs.map(v => v.video_id);
        }
    },
    getSongDetails: async (videoIds: string[]) => {
        const stableQuery = {
            q: '',
            fields: ['title', 'thumbnailUrl'],
            _sort: "+viewCounter",
            _limit: "100",
            _context: "100sen-viewer"
        };
        const videoIdsEntries: [string, string][] = videoIds.map((v, k) => [`filters[contentId][${k}]`, v]);
        const videoIdsQuery = Object.fromEntries(videoIdsEntries);
        const url = urlConnectParam(
            'https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search',
            { ...stableQuery, ...videoIdsQuery }
        );
        const songDatas = await fetch(url).then(v => v.json()) as SongData[];
        return songDatas;
    }
}

contextBridge.exposeInMainWorld('api', preload);

export default preload;
