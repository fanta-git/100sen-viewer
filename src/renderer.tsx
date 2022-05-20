import html2canvas from "html2canvas";
import React from "react";
import { createRoot } from 'react-dom/client';

import makePlaylistTable from './makePlaylistTable';

const RootDiv: React.FC = () => {
    const [getPlaylistURL, setPlaylistURL] = React.useState('');
    const [getPlaylistTable, setPlaylistTable] = React.useState(<></>);

    const listUrlClick: React.ChangeEventHandler<HTMLInputElement> = event => {
        setPlaylistURL(event.target.value);
    };

    const loadListClick = async () => {
        const videoIds = await window.api.getListData(getPlaylistURL);
        if (videoIds === undefined) throw Error('URLが間違っています！');
        const result = await window.api.getVideoData(videoIds);
        const playlistTable = makePlaylistTable(result)!;
        setPlaylistTable(playlistTable);
    }

    const convertPhotoClick = async () => {
        const songTable = document.getElementById('listdata-table');
        if (songTable === null) return;
        const canvas = await html2canvas(songTable, { useCORS: true });
        const downloadElement = document.createElement('a');
        downloadElement.href = canvas.toDataURL('image/png');
        downloadElement.download = '100sen-png';
        downloadElement.click();
    }

    return (
        <>
            <input type="text" onChange={listUrlClick} />
            <button onClick={loadListClick}>表示</button>
            <button onClick={convertPhotoClick}>画像化</button>
            {getPlaylistTable}
        </>
    );
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<RootDiv/>);
