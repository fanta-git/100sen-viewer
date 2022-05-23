import React from "react";
import { originalData, SongDataForTable } from "./types";

class PlaylistDataManager {
    playlist: SongDataForTable[];
    setPlaylist: React.Dispatch<React.SetStateAction<SongDataForTable[]>>;
    key: number;

    constructor () {
        [this.playlist, this.setPlaylist] = React.useState<SongDataForTable[]>([]);
        this.key = 0;
    }

    clear () {
        this.setPlaylist([]);
    }

    add (songData: originalData) {
        this.setPlaylist(list => [
            ...list,
            {
                ...songData,
                key: this.key,
                original: { ...songData }
            }
        ]);
        this.key++;
    }

    overWrite (key: number, data: Partial<originalData>) {
        this.setPlaylist(list => {
            const newlist = [...list];
            const targetIndex = newlist.findIndex(v => v.key === key);
            newlist[targetIndex] = { ...newlist[targetIndex], ...data };
            return newlist;
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
            /(feat|ft) ?\..*/,
        ];
        for (const item of newData) {
            const trimedTitle = regs.reduce((tit, reg) => tit.replace(reg, ''), item.title).trim();
            this.overWrite(item.key, { title: trimedTitle });
        }
    }

    update () {
        this.setPlaylist([...this.playlist]);
    }
}

export default PlaylistDataManager;
