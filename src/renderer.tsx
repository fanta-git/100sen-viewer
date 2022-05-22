import React from "react";
import { createRoot } from 'react-dom/client';
import domtoimage from 'dom-to-image';

import PlaylistTable from './PlaylistTable';
import { SongDataForTable } from './types';
import ViewerMenu from "./ViewerMenu";

const RootDiv: React.FC = () => {
    const [playlistData, setPlaylistData] = React.useState<SongDataForTable[]>([]);
    const urlInputBox = React.useRef<HTMLInputElement>(null!);
    const csvInpurBox = React.useRef<HTMLInputElement>(null!);

    const handleOnClick = async () => {
        const videoIds = await window.api.getListData(urlInputBox.current.value);
        if (videoIds === undefined) throw Error('URLが間違っています！');
        const result = await window.api.getVideoData(videoIds);
        setPlaylistData(result);
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
            <ViewerMenu
                urlInputRef={urlInputBox}
                csvInputRef={csvInpurBox}
                loadList={handleOnClick}
                outputJpeg={convertPhotoClick}
            />
            <PlaylistTable tableData={playlistData}/>
        </>
    );
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<RootDiv/>);
