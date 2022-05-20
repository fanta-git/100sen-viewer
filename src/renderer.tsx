import React from "react";
import ReactDOM from 'react-dom';

import makePlaylistTable from './makePlaylistTable';

const RootDiv: React.FC = prop => {
    const [getPlaylistId, setPlaylistId] = React.useState('');
    const [getPlaylistTable, setPlaylistTable] = React.useState(<></>);

    const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        setPlaylistId(event.target.value);
    };

    const handleOnClick = async () => {
        const videoIds = await window.api.getAPI('https://cafe.kiite.jp/api/playlists/contents/detail', { list_id: getPlaylistId });
        if (videoIds.status === 'failed') throw Error('プレイリストの取得に失敗しました');
        // const result = await window.api.getSongDetails(videoIds.songs.map(v => v.video_id));
        const listIds = videoIds.songs.map(v => v.video_id);
        const result = await window.api.getNicovideoData(listIds);
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
