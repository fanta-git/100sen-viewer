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
        const videoIds = await window.api.getPlaylistSongs('Kiite', getPlaylistId);
        if (videoIds === undefined) throw Error('プレイリストの取得に失敗しました');
        const result = await window.api.getSongDetails(videoIds);
        if (result === undefined) throw Error('楽曲の読み込みに失敗しました');
        const requiredData = result.data.map(v => ({
            title: v.title,
            thumbnail: v.thumbnailUrl,
            userName: v.userId + ""
        }));
        const playlistTable = makePlaylistTable(requiredData)!;
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
