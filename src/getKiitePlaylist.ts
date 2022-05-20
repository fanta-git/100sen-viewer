import fetch from 'node-fetch';
import type { PlaylistContents } from './types';

type getAPITypes =  (listId: string) => Promise<string[]>;
const END_POINT = 'https://cafe.kiite.jp/api/playlists/contents/detail';

const getAPI: getAPITypes = async listId => {
    const response = await fetch(`${END_POINT}?list_id=${listId}`);
    if (!response.ok) throw Error('プレイリストの取得に失敗しました');
    const json = await response.json() as PlaylistContents;
    if (json.status === 'failed') throw Error('プレイリストの取得に失敗しました');
    return json.songs.map(v => v.video_id);
};

export default getAPI;
