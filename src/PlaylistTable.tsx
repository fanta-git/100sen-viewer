import React from 'react';

import './style.css';
import { SongDataForTable } from './types';

type Props = {
    tableData: SongDataForTable[]
}

const toCamelCase = (str: string) => {
    return str.split('-').map((word, index) => index
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase()
    ).join('');
};

const PlaylistTable: React.FC<Props> = ({ tableData }) => {
    const items: React.ReactElement[] = [];
    const updateContent: React.MouseEventHandler<HTMLDivElement> = async (event) => {
        const elm = event.currentTarget;
        const fullContent = elm.parentElement!.dataset[toCamelCase(elm.className)];
        const newContent = await window.api.electronPrompt({
            title: 'title',
            label: 'label',
            value: fullContent
        });
        if (newContent !== null) elm.textContent = newContent;
    };
    for (const videoData of tableData) {
        items.push(
            <div className="song" key={items.length} data-title={videoData.title} data-user-name={videoData.userName}>
                <img className="thumbnail" src={videoData.thumbnail} />
                <div className="title" onClick={updateContent}>{videoData.title}</div>
                <div className="user-name" onClick={updateContent}>{videoData.userName}</div>
            </div>
        );
    }

    return <div id="listdata-table">{items}</div>;
};

export default PlaylistTable;
