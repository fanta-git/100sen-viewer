import fetch from 'node-fetch';
import { originalData, vocadbReturnData } from '../types';

const CALL_API_INTERVAL = 10;
const API_URL = 'https://vocadb.net/api/songs';
const QUERY = 'query';

const timer = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getVideoData = async (videoId: string) => {
    const encorded = encodeURI(`https://www.nicovideo.jp/watch/${videoId}`);
    const response = await fetch(`${API_URL}?${QUERY}=${encorded}&maxResults=10&fields=ThumbUrl&lang=Japanese`);
    if (!response.ok) return;
    const resJsom = await response.json() as vocadbReturnData;
    if (resJsom.items.length === 0) return;
    const [itemData] = resJsom.items;

    const ret: originalData = {
        title: itemData.name,
        userName: itemData.artistString.split(' feat.')[0],
        thumbnail: itemData.thumbUrl,
        postDate: itemData.createDate,
        videoId
    };

    await timer(CALL_API_INTERVAL);

    return ret;
};

export default getVideoData;
