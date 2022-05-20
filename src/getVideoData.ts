import fetch from 'node-fetch';
import { SongDataForTable } from './types';


const CALL_API_INTERVAL = 10;
const API_URL = 'https://ext.nicovideo.jp/api/getthumbinfo/';

const timer = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const XMLReader = (doc: Document) => (tagName: string) => doc.querySelector(tagName)?.textContent ?? 'NoData';

const getVideoData = async (videoIds: string[]) => {
    const ret: SongDataForTable[] = [];
    for (const videoId of videoIds) {
        const response = await fetch(API_URL + videoId);
        if (!response.ok) continue;
        const resText = await response.text();
        const resXml = new DOMParser().parseFromString(resText, 'text/xml');
        const resReader = XMLReader(resXml);
        ret.push({
            title: resReader('title'),
            userName: resReader('user_nickname'),
            thumbnail: resReader('thumbnail_url')
        })
        
        await timer(CALL_API_INTERVAL);
    }

    return ret;
};

export default getVideoData;
