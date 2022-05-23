import React from 'react';
import PlaylistDataManager from './PlaylistDataManager';

import './style.css';

type Props = {
    playlistManager: PlaylistDataManager
}

const TYPE_JP = { title: 'タイトル', userName: '投稿者名' };

const PlaylistTable: React.FC<Props> = ({ playlistManager }) => {
    const items: React.ReactElement[] = [];
    for (const [i, videoData] of Object.entries(playlistManager.playlist)) {
        const updateContent = async (key: number, type: keyof typeof TYPE_JP) => {
            const newContent = await window.api.electronPrompt({
                title: TYPE_JP[type] + 'を変更',
                label: '変更後の' + TYPE_JP[type],
                value: videoData.original[type]
            });
            if (newContent !== null) playlistManager.overWrite(key, { [type]: newContent });
        };
        items.push(
            <div className="song" key={videoData.key}>
                <img className="thumbnail" src={videoData.thumbnail} />
                <div className="title" onClick={() => updateContent(videoData.key, 'title')}>{videoData.title}</div>
                <div className="user-name" onClick={() => updateContent(videoData.key, 'userName')}>{videoData.userName}</div>
            </div>
        );
    }

    return <div id="listdata-table">{items}</div>;
};

export default PlaylistTable;
