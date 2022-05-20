import React from "react";
import ReactDOM from 'react-dom';

import makePlaylistTable from './makePlaylistTable';

const RootDiv: React.FC = () => {
    const [getPlaylistURL, setPlaylistURL] = React.useState('');
    const [getPlaylistTable, setPlaylistTable] = React.useState(<></>);

    const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        setPlaylistURL(event.target.value);
    };

    const handleOnClick = async () => {
        const listIdExtracter = {
            kiite: /https:\/\/kiite.jp\/playlist\/(\w*)/
        };
        const listId = getPlaylistURL.match(listIdExtracter.kiite)?.[1];
        if (!listId) return;
        console.log(listId);
        const videoIds = await window.api.getKiitePlaylist(listId);
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

ReactDOM.render(<RootDiv />, document.getElementById('root'));
