import React from 'react';
import { originalData, SongDataForTable } from './types';

class TableData {
    playlist: SongDataForTable[];
    setPlaylist: React.Dispatch<React.SetStateAction<SongDataForTable[]>>;
    key: React.MutableRefObject<number>;

    constructor () {
        [this.playlist, this.setPlaylist] = React.useState<SongDataForTable[]>([]);
        this.key = React.useRef(0);
    }

    clear () {
        this.setPlaylist([]);
        this.key.current = 0;
    }

    deleat (key: number) {
        this.setPlaylist(list => {
            const newList = [...list];
            const index = newList.findIndex(v => v.key === key);
            if (index === -1) return list;
            newList.splice(index, 1);
            return newList;
        });
    }

    add (songData: originalData) {
        const key = this.key.current;
        this.setPlaylist(list => [
            ...list,
            {
                ...songData,
                key,
                original: { ...songData }
            }
        ]);
        this.key.current += 1;
    }

    overWrite (key: number, data: Partial<originalData>) {
        this.setPlaylist(list => {
            const newlist = [...list];
            const targetIndex = newlist.findIndex(v => v.key === key);
            newlist[targetIndex] = { ...newlist[targetIndex], ...data };
            return newlist;
        });
    }

    move (fromKey: number, toKey: number) {
        this.setPlaylist(list => {
            const newList = [...list];
            const fromIndex = newList.findIndex(v => v.key === fromKey);
            const [fromData] = newList.splice(fromIndex, 1);
            const toIndex = newList.findIndex(v => v.key === toKey);
            if (toIndex === -1) return list;
            const insertedList = [...newList.slice(0, toIndex), fromData, ...newList.slice(toIndex)];
            return insertedList;
        });
    }

    trimTitle () {
        const newData = [...this.playlist];
        const regs: RegExp[] = [
            /【.*?】|\[.*?\]/g,
            /.*(「|｢|『)/,
            /(」|｣|』).*/,
            /(\/|／).*/,
            /.*-/,
            /(feat|ft) ?\..*/
        ];
        for (const item of newData) {
            const trimedTitle = regs.reduce((tit, reg) => tit.replace(reg, ''), item.title ?? '').trim();
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
        case 'key':
        case 'title':
        case 'userName':{
            this.setPlaylist(list => [...list].sort(
                sortFunc(v => v[type])
            ));
            break;
        }
        case 'postDate': {
            this.setPlaylist(list => [...list].sort(
                sortFunc(v => v.postDate && Date.parse(v.postDate))
            ));
            break;
        }
        }
    }
}

export default TableData;
