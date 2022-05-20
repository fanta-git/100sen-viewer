import React from "react";
import { createRoot } from 'react-dom/client';

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

    return (
        <>
            <input type="text" onChange={handleOnChange} />
            <button onClick={handleOnClick}>表示</button>
            {getPlaylistTable}
        </>
    );
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<RootDiv/>);
