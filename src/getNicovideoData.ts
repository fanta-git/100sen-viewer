import fetch from 'node-fetch';

type retType = {
    title: string,
    userName: string,
    thumbnail: string
};

const CALL_API_INTERVAL = 10;
const API_URL = 'https://ext.nicovideo.jp/api/getthumbinfo/';

const timer = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const range = (size: number) => Array(size).keys();
function* zip<T, U>(array1: T[], array2: U[]) {
    const length = Math.max(array1.length, array2.length);
    for (const i of range(length)) yield [array1[i], array2[i]] as const;
}
const getXMLContent = (doc: Document, tagName: string) => doc.querySelector(tagName)?.textContent ?? 'NoData';

const getNicovideoData = async (videoIds: string[]) => {
    const ret: retType[] = [];
    for (const videoId of videoIds) {
        const response = await fetch(API_URL + videoId);
        if (!response.ok) continue;
        const resText = await response.text();
        const resXml = new DOMParser().parseFromString(resText, 'text/xml');
        ret.push({
            title: getXMLContent(resXml, 'title'),
            userName: getXMLContent(resXml, 'user_nickname'),
            thumbnail: getXMLContent(resXml, 'thumbnail_url')
        })
        
        await timer(CALL_API_INTERVAL);
    }

    return ret;
};

export default getNicovideoData;
