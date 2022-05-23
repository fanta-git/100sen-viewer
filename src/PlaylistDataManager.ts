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

    setList (playlistData: originalData[]) {
        const res = [];
        for (const playlist of playlistData){
            const songData: SongDataForTable = {
                ...playlist,
                key: this.key,
                original: { ...playlist }
            };
            res.push(songData);
            this.key++;
        }
        this.setPlaylist(res);
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
