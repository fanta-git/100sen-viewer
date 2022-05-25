import React, { DragEventHandler } from 'react';
import PlaylistDataManager from './PlaylistDataManager';

import './style.css';

type Props = {
    playlistManager: PlaylistDataManager
}

const DND_ITEM_PREFIX = '100sen-viewer';
const TYPE_JP = { title: 'タイトル', userName: '投稿者名' };

const PlaylistTable: React.FC<Props> = ({ playlistManager }) => {
    const items: React.ReactElement[] = [];
    for (const videoData of playlistManager.playlist) {
        const updateContent = async (key: number, type: keyof typeof TYPE_JP) => {
            const newContent = await window.api.electronPrompt({
                title: TYPE_JP[type] + 'を変更',
                label: '変更後の' + TYPE_JP[type],
                value: videoData.original[type]
            });
            if (newContent !== null) playlistManager.overWrite(key, { [type]: newContent });
        };

        const dragEvents: Record<string, DragEventHandler<HTMLDivElement>> = {
            onDragStart: e => {
                e.dataTransfer.setData('text', `${DND_ITEM_PREFIX},${videoData.key}`);
            },
            onDragOver: e => {
                e.stopPropagation();
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                if (e.clientX - rect.left < rect.width / 2) {
                    // insert left
                } else {
                    // insert right
                };
            },
            onDragLeave: e => {

            },
            onDrop: e => {
                const [prefix, data] = e.dataTransfer.getData('text').split(',');
                if (prefix !== DND_ITEM_PREFIX) return;
                e.stopPropagation();
                e.preventDefault();
                playlistManager.move(Number(data), videoData.key);
            },
        };
        
        items.push(
            <div className="song" key={videoData.key} draggable='true' {...dragEvents}>
                <img className="thumbnail" src={videoData.thumbnail} draggable="false" />
                <div className="title" onClick={() => updateContent(videoData.key, 'title')}>{videoData.title}</div>
                <div className="user-name" onClick={() => updateContent(videoData.key, 'userName')}>{videoData.userName}</div>
            </div>
        );
    }

    return <div id="listdata-table">{items}</div>;
};

export default PlaylistTable;
