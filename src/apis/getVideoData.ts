import fetch from 'node-fetch';
import { originalData } from '../types';


const CALL_API_INTERVAL = 10;
const API_URL = 'https://ext.nicovideo.jp/api/getthumbinfo/';

const timer = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const XMLReader = (doc: Document) => (tagName: string) => doc.querySelector(tagName)?.textContent ?? '';

const getVideoData = async (videoId: string) => {
    const response = await fetch(API_URL + videoId);
    if (!response.ok) return;
    const resText = await response.text();
    const resXml = new DOMParser().parseFromString(resText, 'text/xml');
    const resReader = XMLReader(resXml);
    const ret: originalData = {
        title: resReader('title'),
        userName: resReader('user_nickname'),
        thumbnail: resReader('thumbnail_url'),
        postDate: resReader('first_retrieve')
    };
    
    await timer(CALL_API_INTERVAL);

    return ret;
};

export default getVideoData;
