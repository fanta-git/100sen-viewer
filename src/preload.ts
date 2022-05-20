import { contextBridge } from "electron";
import fetch from 'node-fetch';

import getAPI from "./getAPI";
import getNicovideoData from "./getNicovideoData";

import type { nicoParam, nicoResponse, NicoVitaUserData, PlaylistContents } from './types';

type getAPITypes = {
    (url: 'https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search', param: nicoParam): Promise<nicoResponse>;
    (url: 'https://cafe.kiite.jp/api/playlists/contents/detail', param: { list_id: string }): Promise<PlaylistContents>
    (url: 'http://api.ce.nicovideo.jp/api/v1/user.info', param: { user_id: number, __format: 'json' }): Promise<NicoVitaUserData>
};

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
            fields: ['title', 'thumbnailUrl', 'userId'] as const,
            _sort: "+viewCounter",
            _limit: 100,
            _context: "100sen-viewer"
        } as const;
        const videoIdsEntries = videoIds.map((v, k) => [`filters[contentId][${k}]`, v] as const);
        const videoIdsQuery = Object.fromEntries(videoIdsEntries);
        const test = await getAPI('https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search', { ...stableQuery, ...videoIdsQuery });
        if ('data' in test) return test;
    },
    getAPI,
    getNicovideoData
}

contextBridge.exposeInMainWorld('api', preload);

export default preload;
