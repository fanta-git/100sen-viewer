import React from 'react';

import './style.css';
import { SongDataForTable } from './types';

type Props = {
    tableData: SongDataForTable[],
    setTableData: React.Dispatch<React.SetStateAction<SongDataForTable[]>>
}

const TYPE_JP = { title: 'タイトル', userName: '投稿者名' };
const toCamelCase = (str: string) => {
    return str.split('-').map((word, index) => index
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase()
    ).join('');
};

const PlaylistTable: React.FC<Props> = ({ tableData, setTableData }) => {
    const items: React.ReactElement[] = [];
    for (const [i, videoData] of Object.entries(tableData)) {
        const updateContent = (type: keyof typeof TYPE_JP): React.MouseEventHandler<HTMLDivElement> => async (event) => {
            const elm = event.currentTarget;
            const fullContent = videoData[type];
            const newContent = await window.api.electronPrompt({
                title: TYPE_JP[type] + 'を変更',
                label: '変更後の' + TYPE_JP[type],
                value: fullContent
            });
            if (newContent !== null) {
                tableData[+i][type] = newContent;
                setTableData([...tableData]);
            }
        };
        items.push(
            <div className="song" key={i}>
                <img className="thumbnail" src={videoData.thumbnail} />
                <div className="title" onClick={updateContent('title')}>{videoData.title}</div>
                <div className="user-name" onClick={updateContent('userName')}>{videoData.userName}</div>
            </div>
        );
    }

    return <div id="listdata-table">{items}</div>;
};

export default PlaylistTable;
