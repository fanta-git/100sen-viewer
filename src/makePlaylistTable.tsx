import React from 'react';

import './style.css';

type requiredData = {
    title: string | null,
    thumbnail: string | null,
    userName: string | null
};

const range = (size: number) => Array.from(Array(size).keys());

const makePlaylistTable = (tableDatas: requiredData[]) => {
    const items: React.ReactElement[] = [];
    for (const videoData of tableDatas) {
        const bgiStyle: React.CSSProperties = {
            backgroundImage: `url("${videoData.thumbnail}")`
        };
        items.push(
            <div className="song">
                <div className="thumbnail" style={bgiStyle}></div>
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
