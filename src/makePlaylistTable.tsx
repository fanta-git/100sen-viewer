import React from 'react';

import type { SongData } from './types';
import './style.css';

type Props = {
    videoDataList: SongData[]
};

const range = (size: number) => Array.from(Array(size).keys());

const makePhotoHTML: React.FC<Props> = props => {
    const { videoDataList } = props;
    const items: React.ReactElement[] = [];
    for (const videoData of videoDataList) {
        const bgiStyle: React.CSSProperties = {
            backgroundImage: `url("${videoData.video_thumbnail}")`
        };
        items.push(
            <div className="song">
                <div className="thumbnail" style={bgiStyle}></div>
                <div className="title">{videoData.title}</div>
                <div className="creator">{videoData.artist_name}</div>
            </div>
        );
    }

    
    return (
        <div id="listdata-table">{items}</div>
    );
};

export default makePhotoHTML;
