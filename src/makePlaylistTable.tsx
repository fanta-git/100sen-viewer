import React from 'react';

import './style.css';
import { SongDataForTable } from './types';

const makePlaylistTable = (tableDatas: SongDataForTable[]) => {
    const items: React.ReactElement[] = [];
    for (const videoData of tableDatas) {
        items.push(
            <div className="song" key={items.length}>
                <img className="thumbnail" src={videoData.thumbnail} />
                <div className="title">{videoData.title}</div>
                <div className="creator">{videoData.userName}</div>
            </div>
        );
    }

    return items;
};

export default makePlaylistTable;
