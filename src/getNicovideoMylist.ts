import fetch from 'node-fetch';

type getAPITypes =  (listId: string) => Promise<string[]>;
const END_POINT = 'https://www.nicovideo.jp/user/97223463/mylist/';
const RSS_QUERY = '?rss=2.0';
const VIDEOID_EXTRACTER = /https:\/\/www.nicovideo.jp\/watch\/(\w*)?ref=rss_mylist_rss2/;

const getAPI: getAPITypes = async listId => {
    const response = await fetch(END_POINT + listId + RSS_QUERY);
    if (!response.ok) throw Error('マイリストの取得に失敗しました');
    const text = await response.text();
    const xml = new DOMParser().parseFromString(text, 'text/xml');
    const linksXML = Array.from(xml.querySelectorAll('channel>item>link'));
    return linksXML.map(v => v.textContent!.match(VIDEOID_EXTRACTER)![1]);
};

export default getAPI;
