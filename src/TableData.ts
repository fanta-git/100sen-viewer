import React from 'react';
import { originalData, SongDataForTable } from './types';

class TableData {
    #playlist: SongDataForTable[];
    #setPlaylist: React.Dispatch<React.SetStateAction<SongDataForTable[]>>;
    #key: React.MutableRefObject<number>;

    static TABLEDATA_DEFAULT: Required<originalData> = {
        title: '',
        userName: '',
        thumbnail: '',
        videoId: '',
        postDate: '',
        titleFontSize: '0.9',
        userNameFontSize: '0.75',
        backgroundColor: '#ffffff'
    };

    constructor () {
        [this.#playlist, this.#setPlaylist] = React.useState<SongDataForTable[]>([]);
        this.#key = React.useRef(0);
    }

    getPlaylist (isOriginal: boolean = false) {
        return this.#playlist.map(v => v[isOriginal ? 'original' : 'current']);
    }

    getData (key: number, isOriginal: boolean = false) {
        return this.#playlist.find(v => v.key === key)![isOriginal ? 'original' : 'current'];
    }

    clear () {
        this.#setPlaylist([]);
        this.#key.current = 0;
    }

    * keys () {
        for (const item of this.#playlist) {
            yield item.key;
        }
    }

    deleat (key: number) {
        this.#setPlaylist(list => {
            const newList = [...list];
            const index = newList.findIndex(v => v.key === key);
            if (index === -1) return list;
            newList.splice(index, 1);
            return newList;
        });
    }

    add (songData: originalData) {
        const key = this.#key;
        this.#setPlaylist(list => {
            if (songData.videoId && list.some(v => v.current.videoId === songData.videoId)) return list;
            return ([
                ...list,
                {
                    key: key.current++,
                    current: { ...TableData.TABLEDATA_DEFAULT, ...songData },
                    original: { ...TableData.TABLEDATA_DEFAULT, ...songData }
                }
            ]);
        });
    }

    overWrite (key: number, data: Partial<originalData>) {
        this.#setPlaylist(list => {
            const newlist = [...list];
            const target = newlist.find(v => v.key === key);
            if (target === undefined) return list;
            Object.assign(target.current, data);
            return newlist;
        });
    }

    move (fromKey: number, toKey: number, isRight: boolean) {
        this.#setPlaylist(list => {
            const insertArray = <T>(array: T[], data: T, index: number) => [...array.slice(0, index), data, ...array.slice(index)];
            const newList = [...list];
            const fromIndex = newList.findIndex(v => v.key === fromKey);
            const [fromData] = newList.splice(fromIndex, 1);
            const toIndex = newList.findIndex(v => v.key === toKey);
            if (toIndex === -1) return list;
            return insertArray(newList, fromData, toIndex + (isRight ? 1 : 0));
        });
    }

    trimTitle () {
        const newData = [...this.#playlist];
        const regs: RegExp[] = [
            /【.*?】|\[.*?\]/g,
            /.*(「|｢|『)/,
            /(」|｣|』).*/,
            /(\/|／).*/,
            /.*-/,
            /(feat|ft) ?\..*/
        ];
        for (const item of newData) {
            const trimedTitle = regs.reduce((tit, reg) => tit.replace(reg, ''), item.current.title ?? '').trim();
            this.overWrite(item.key, { title: trimedTitle });
        }
    }

    sort (type: string, isReverse: boolean) {
        const rev = isReverse ? -1 : 1;
        const sortFunc = <T>(convFunc: (from: T) => number | string | undefined) => (fromA: T, fromB: T) => {
            const [a, b] = [convFunc(fromA), convFunc(fromB)];
            if (a === undefined || b === undefined) return 1;
            if (a === b) return 0;
            if (a < b) return -1 * rev;
            return 1 * rev;
        };
        switch (type) {
        case 'key': {
            this.#setPlaylist(list => [...list].sort(
                sortFunc(v => v.key)
            ));
            break;
        }
        case 'title':
        case 'userName':{
            this.#setPlaylist(list => [...list].sort(
                sortFunc(v => v.current[type])
            ));
            break;
        }
        case 'postDate': {
            this.#setPlaylist(list => [...list].sort(
                sortFunc(v => v.current.postDate && Date.parse(v.current.postDate))
            ));
            break;
        }
        }
    }
}

export default TableData;
