import React, { useEffect } from "react";
import { createRoot } from 'react-dom/client';
import domtoimage from 'dom-to-image';

import makePlaylistTable from './makePlaylistTable';

const RootDiv: React.FC = () => {
    const [playlistCells, setPlaylistCells] = React.useState<JSX.Element[]>([]);
    const urlInputBox = React.useRef<HTMLInputElement>(null!);
    const textUpdateInputBox = React.useRef<HTMLInputElement>(null);
    useEffect(() => {
        console.log('useEffect');
        textUpdateInputBox.current?.select()
    }, [textUpdateInputBox.current])

    const handleOnClick = async () => {
        const videoIds = await window.api.getListData(urlInputBox.current.value);
        if (videoIds === undefined) throw Error('URLが間違っています！');
        const result = await window.api.getVideoData(videoIds);
        const playlistTable = makePlaylistTable(result, playlistCells, setPlaylistCells, textUpdateInputBox)!;
        setPlaylistCells(playlistTable);
    };

    const convertPhotoClick = async () => {
        const songTable = document.getElementById('listdata-table');
        if (songTable === null) return;
        const imageUrl = await domtoimage.toJpeg(songTable);
        const downloadElement = document.createElement('a');
        downloadElement.href = imageUrl;
        downloadElement.download = '100sen';
        downloadElement.click();
    };

    return (
        <>
            <div id="viewer-menu">
                <input id="url-inputbox" type="text" ref={urlInputBox} />
                <button id="load-btn" onClick={handleOnClick}>表示</button>
                <button id="convert-btn" onClick={convertPhotoClick}>画像化</button>
            </div>
            <div id="listdata-table">{playlistCells}</div>
        </>
    );
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<RootDiv/>);
