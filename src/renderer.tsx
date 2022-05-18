import React from "react";
import ReactDOM from 'react-dom';

import makePlaylistTable from './makePlaylistTable';

type States = {
    filename: string
};

const RootDiv: React.FC = prop => {
    const [getPlaylistId, setPlaylistId] = React.useState('');
    const [getPlaylistTable, setPlaylistTable] = React.useState(<></>);

    const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        setPlaylistId(event.target.value);
    };

    const handleOnClick = async () => {
        const result = await window.api.getPlaylistSongs(getPlaylistId);
        setPlaylistTable(result ? makePlaylistTable({ videoDataList: result })! : <>プレイリストの取得に失敗しました</>);
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
