import React, { DragEventHandler, MouseEventHandler } from 'react';
import PlaylistDataManager from './PlaylistDataManager';

import './style.css';

type Props = {
    playlistManager: PlaylistDataManager
}

const isKey = <T extends Object>(key: string | number | symbol, obj: T): key is keyof T => key in obj;

const DND_ITEM_PREFIX = '100sen-viewer';
const TYPE_JP = { title: 'タイトル', userName: '投稿者名', thumbnail: 'サムネイルのURL' };
const DRAG_OVER_CLASSES = { left: 'drag-over-left', right: 'drag-over-right' };

const PlaylistTable: React.FC<Props> = ({ playlistManager }) => {
    const items: React.ReactElement[] = [];
    for (const videoData of playlistManager.playlist) {
        const updateContent: MouseEventHandler<HTMLDivElement | HTMLImageElement> = async e => {
            const type = e.currentTarget.className;
            if (!isKey(type, TYPE_JP)) return;
            const newContent = await window.api.electronPrompt({
                title: TYPE_JP[type] + 'を変更',
                label: '変更後の' + TYPE_JP[type],
                value: videoData.original[type]
            });
            if (newContent !== null) playlistManager.overWrite(videoData.key, { [type]: newContent });
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
                    e.currentTarget.classList.remove(DRAG_OVER_CLASSES.right);
                    e.currentTarget.classList.add(DRAG_OVER_CLASSES.left);
                } else {
                    e.currentTarget.classList.add(DRAG_OVER_CLASSES.right);
                    e.currentTarget.classList.remove(DRAG_OVER_CLASSES.left);
                };
            },
            onDragLeave: e => {
                e.currentTarget.classList.remove(DRAG_OVER_CLASSES.left, DRAG_OVER_CLASSES.right);
            },
            onDrop: e => {
                const [prefix, data] = e.dataTransfer.getData('text').split(',');
                if (prefix !== DND_ITEM_PREFIX) return;
                e.stopPropagation();
                e.preventDefault();
                const isRight = e.currentTarget.classList.contains(DRAG_OVER_CLASSES.right);
                console.log(`from${data}\nto  ${videoData.key}\n${isRight}`);
                playlistManager.move(Number(data), videoData.key + (isRight ? 1 : 0));
                e.currentTarget.classList.remove(DRAG_OVER_CLASSES.left, DRAG_OVER_CLASSES.right);
            },
        };

        items.push(
            <div className="song" key={videoData.key} draggable='true' {...dragEvents}>
                <img className="thumbnail" onClick={updateContent} src={videoData.thumbnail} draggable="false" />
                <div className="title" onClick={updateContent}>{videoData.title}</div>
                <div className="user-name" onClick={updateContent}>{videoData.userName}</div>
            </div>
        );
    }

    return <div id="listdata-table">{items}</div>;
};

export default PlaylistTable;
