import React, { DragEventHandler, MouseEventHandler } from 'react';
import PlaylistDataManager from './PlaylistDataManager';

import noDataImage from './assets/no_data.png';
import './style.css';

type Props = {
    playlistManager: PlaylistDataManager
}

const isKey = <T extends Record<string, unknown>>(key: string | number | symbol, obj: T): key is keyof T => key in obj;
const toCamelCase = (str: string) => {
    return str.split('-').map((word, index) => index
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase()
    ).join('');
};

const TYPE_JP = { title: 'タイトル', userName: '投稿者名', thumbnail: 'サムネイルのURL' };
const DRAG_OVER_CLASSES = { left: 'drag-over-left', right: 'drag-over-right' };

const PlaylistTable: React.FC<Props> = ({ playlistManager }) => {
    const items: React.ReactElement[] = [];
    let dropKey = -1;
    for (const videoData of playlistManager.playlist) {
        const updateContent: MouseEventHandler<HTMLDivElement | HTMLImageElement> = async e => {
            const type = toCamelCase(e.currentTarget.className);
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
                e.dataTransfer.effectAllowed = 'move';
                dropKey = videoData.key;
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
                }
            },
            onDragLeave: e => {
                e.currentTarget.classList.remove(DRAG_OVER_CLASSES.left, DRAG_OVER_CLASSES.right);
            },
            onDrop: e => {
                if (dropKey < 0) return;
                e.stopPropagation();
                e.preventDefault();
                const isRight = e.currentTarget.classList.contains(DRAG_OVER_CLASSES.right);
                playlistManager.move(dropKey, videoData.key + (isRight ? 1 : 0));
                e.currentTarget.classList.remove(DRAG_OVER_CLASSES.left, DRAG_OVER_CLASSES.right);
                dropKey = -1;
            },
            onDragEnd: () => {
                if (dropKey < 0) return;
                playlistManager.deleat(dropKey);
                dropKey = -1;
            }
        };

        items.push(
            <div className='song' key={videoData.key} draggable='true' {...dragEvents}>
                <img className='thumbnail' onClick={updateContent} src={videoData.thumbnail} draggable='false' onError={e => { e.currentTarget.src = noDataImage; }} />
                <div className='title' onClick={updateContent}>{videoData.title}</div>
                <div className='user-name' onClick={updateContent}>{videoData.userName}</div>
            </div>
        );
    }

    return <div id='listdata-table'>{items}</div>;
};

export default PlaylistTable;
