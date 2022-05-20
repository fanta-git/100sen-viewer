import fetch from 'node-fetch';
import type { PlaylistContents } from './types';

type getAPITypes = {
    (url: 'https://cafe.kiite.jp/api/playlists/contents/detail', param: { list_id: string }): Promise<PlaylistContents>
};

const getAPI: getAPITypes = async (url, param) => {
    const response = await fetch(url + parseParam(param));
    return response.json() as any;
};

const parseParam = (param?: Record<string, any>) => {
    if (param === undefined) return '';
    const ret: [string, string][] = [];
    for (const [key, value] of Object.entries(param)) {
        if (value instanceof Array) {
            ret.push([key, value.join(',')])
        } else if (value instanceof Object) {
            ret.push([key, JSON.stringify(value)]);
        } else {
            ret.push([key, value]);
        }
    }
    return ret.length ? '?' + ret.map(([a, b]) => `${a}=${encodeURIComponent(b)}`).join('&') : '';
}

export default getAPI;
