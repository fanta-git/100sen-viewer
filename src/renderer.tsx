import React from "react";
import { createRoot } from 'react-dom/client';
import domtoimage from 'dom-to-image';

import makePlaylistTable from './makePlaylistTable';

const RootDiv: React.FC = () => {
    const [getPlaylistURL, setPlaylistURL] = React.useState('');
    const [getPlaylistTable, setPlaylistTable] = React.useState(<></>);

    const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        setPlaylistURL(event.target.value);
    };

    const handleOnClick = async () => {
        const videoIds = await window.api.getListData(getPlaylistURL);
        if (videoIds === undefined) throw Error('URLが間違っています！');
        const result = await window.api.getVideoData(videoIds);
        const playlistTable = makePlaylistTable(result)!;
        setPlaylistTable(playlistTable);
    }

    const convertPhotoClick = async () => {
        const songTable = document.getElementById('listdata-table');
        if (songTable === null) return;
        const imageUrl = await domtoimage.toJpeg(songTable);
        const downloadElement = document.createElement('a');
        downloadElement.href = imageUrl;
        downloadElement.download = '100sen';
        downloadElement.click();
    }

    return (
        <>
            <div id="viewer-menu">
                <input id="url-inputbox" type="text" onChange={handleOnChange} />
                <button id="load-btn" onClick={handleOnClick}>表示</button>
                <button id="convert-btn" onClick={convertPhotoClick}>画像化</button>
            </div>
            {getPlaylistTable}
        </>
    );
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<RootDiv/>);
