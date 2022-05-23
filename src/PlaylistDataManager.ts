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
            const songData: SongDataForTable = Object.assign({}, playlist, {
                key: this.key,
                original: Object.assign({}, playlist)
            });
            res.push(songData);
            this.key++;
        }
        this.setPlaylist(res);
    }

    overWrite (key: number, data: Partial<originalData>) {
        const targetIndex = this.playlist.findIndex(v => v.key === key);
        const newData = [...this.playlist];
        newData[targetIndex] = Object.assign({}, this.playlist[targetIndex], data);
        this.setPlaylist(newData);
    }

    update () {
        this.setPlaylist([...this.playlist]);
    }
}

export default PlaylistDataManager;
