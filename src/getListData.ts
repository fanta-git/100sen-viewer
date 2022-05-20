import fetch from 'node-fetch';
import type { PlaylistContents } from './types';

type getAPITypes =  (listId: string) => Promise<string[]>;
const KIITE_END_POINT = 'https://cafe.kiite.jp/api/playlists/contents/detail';
const NICO_END_POINT = 'https://www.nicovideo.jp/user/97223463/mylist/';
const RSS_QUERY = '?rss=2.0';
const VIDEOID_EXTRACTER = /https:\/\/www.nicovideo.jp\/watch\/(\w*)?ref=rss_mylist_rss2/;

const getKiitePlaylist: getAPITypes = async listId => {
    const response = await fetch(`${KIITE_END_POINT}?list_id=${listId}`);
    if (!response.ok) throw Error('プレイリストの取得に失敗しました');
    const json = await response.json() as PlaylistContents;
    if (json.status === 'failed') throw Error('プレイリストの取得に失敗しました');
    return json.songs.map(v => v.video_id);
};

const getNicoMylist: getAPITypes = async listId => {
    const response = await fetch(NICO_END_POINT + listId + RSS_QUERY);
    if (!response.ok) throw Error('マイリストの取得に失敗しました');
    const text = await response.text();
    const xml = new DOMParser().parseFromString(text, 'text/xml');
    const linksXML = Array.from(xml.querySelectorAll('channel>item>link'));
    return linksXML.map(v => v.textContent!.match(VIDEOID_EXTRACTER)![1]);
};

export { getKiitePlaylist, getNicoMylist };
