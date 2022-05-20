import React from 'react';

import './style.css';
import { SongDataForTable } from './types';

const makePlaylistTable = (tableDatas: SongDataForTable[]) => {
    const items: React.ReactElement[] = [];
    for (const videoData of tableDatas) {
        items.push(
            <div className="song">
                <div className="thumbnail" style={{ backgroundImage: `url("${videoData.thumbnail}")` }}></div>
                <div className="title">{videoData.title}</div>
                <div className="creator">{videoData.userName}</div>
            </div>
        );
    }

    return (
        <div id="listdata-table">{items}</div>
    );
};

export default makePlaylistTable;
