import React from 'react';
import domtoimage from 'dom-to-image';
import TableData from './TableData';

type Props = {
    tableData: TableData
};

const EditTable: React.FC<Props> = (props) => {
    return (
        <div id="edit-table" className="viewer-menu">
            <FromMenu {...props} />
            <EditMenu {...props} />
            <ToMenu {...props} />
        </div>
    );
};

const FromMenu: React.FC<Props> = ({ tableData }) => {
    const fromTypeRef = React.useRef<HTMLSelectElement>(null!);
    const isJoinSongsRef = React.useRef<HTMLInputElement>(null!);
    const [isloadbtnDisabled, setIsLoadbtnDisabled] = React.useState(false);

    const loadPlaylist = async () => {
        setIsLoadbtnDisabled(true);
        switch (fromTypeRef.current.value) {
        case 'from-url': {
            const listUrl = await window.api.electronPrompt({
                type: 'input',
                label: 'KiiteのプレイリストかニコニコのマイリストのURLを入力してください',
                title: 'URLからリストを読み込み'
            });
            if (!listUrl) break;
            const videoIds = await window.api.getListData(listUrl);
            if (videoIds === undefined) {
                await window.api.showErrorBox('URLが間違っています', 'KiiteのプレイリストのURLか、ニコニコ動画のマイリストのURLを入力してください');
                break;
            }
            if (!isJoinSongsRef.current.checked) tableData.clear();
            for (const videoId of videoIds) {
                const songData = await window.api.getVideoData(videoId);
                if (songData === undefined) continue;
                tableData.add(songData);
            }
            break;
        }
        case 'from-csv': {
            const filePaths = await window.api.showOpenDialogSync({
                title: 'CSVからリストを読み込み',
                message: 'このアプリで出力したCSVを選択してください',
                filters: [
                    { name: 'CSV', extensions: ['csv'] }
                ]
            });
            if (filePaths === undefined) break;
            if (!isJoinSongsRef.current.checked) tableData.clear();
            for (const path of filePaths) {
                const csvData = await window.api.csvParseSync(path, { columns: true }) as Record<string, string>[];
                for (const songData of csvData) tableData.add(songData);
            }
            break;
        }
        case 'add-url': {
            const songUrl = await window.api.electronPrompt({
                type: 'input',
                label: '曲のURLを入力してください',
                title: 'URLから曲の追加'
            });
            if (!songUrl) break;
            const [videoId] = songUrl.match(/(?<=https:\/\/www.nicovideo.jp\/watch\/)\w*/) ?? [];
            if (videoId === undefined) {
                setIsLoadbtnDisabled(false);
                await window.api.showErrorBox('URLが間違っています', 'ニコニコ動画の動画ページのURLを入力してください');
                return;
            }
            const songData = await window.api.getVideoData(videoId);
            if (songData === undefined) break;
            tableData.add(songData);
            break;
        }
        }
        setIsLoadbtnDisabled(false);
    };

    return (
        <div id="from-wrapper">
            <div className="from-item-wrapper">
                <label>
                    読み込みタイプ
                    <select id="from-type" ref={fromTypeRef}>
                        <option value="from-url">リストのURL</option>
                        <option value="from-csv">CSVデータ</option>
                        <option value="add-url">曲のURL</option>
                    </select>
                </label>
            </div>
            <div className="from-load">
                <label><input type="checkbox" id="isJoinSongs" ref={isJoinSongsRef} />追加で読み込む</label>
                <button id="load-btn" onClick={loadPlaylist} disabled={isloadbtnDisabled}>読み込み</button>
            </div>
        </div>
    );
};

const EditMenu: React.FC<Props> = ({ tableData }) => {
    const sortTypeRef = React.useRef<HTMLSelectElement>(null!);
    const sortRevRef = React.useRef<HTMLInputElement>(null!);
    const sortList = () => {
        tableData.sort(sortTypeRef.current.value, sortRevRef.current.checked);
    };

    const addSong = () => {
        tableData.add({});
    };

    const trimTitle = async () => {
        const ret = await window.api.showMessageBoxSync({
            type: 'info',
            buttons: ['キャンセル', '実行'],
            message: 'タイトルの自動抜き出しを実行しますか？',
            detail: 'うまく曲名を抜き出せなかった曲は手直しが必要になります。',
            defaultId: 1,
            cancelId: 0
        });
        if (ret) tableData.trimTitle();
    };

    return (
        <div id="edit-wrapper">
            <div className="edit-item-wrapper">
                <button id="trim-title-btn" onClick={trimTitle}>タイトルの自動抜き出し</button>
            </div>
            <div className="edit-item-wrapper">
                <select id="sort-type-slc" onChange={sortList} ref={sortTypeRef}>
                    <option value="key">読み込み順</option>
                    <option value="postDate">投稿日順</option>
                    <option value="title">タイトル順</option>
                    <option value="userName">投稿者順</option>
                </select>
                <label><input type="checkbox" id="sort-rev-che" onChange={sortList} ref={sortRevRef} />逆順</label>
            </div>
            <div className="edit-item-wrapper">
                <button onClick={addSong}>曲の追加</button>
            </div>
        </div>
    );
};

const ToMenu: React.FC<Props> = ({ tableData }) => {
    const outputJpeg = async () => {
        const songTable = document.getElementById('listdata-table');
        if (songTable === null) return;
        songTable.classList.add('double');
        const imageUrl = await domtoimage.toBlob(songTable);
        songTable.classList.remove('double');
        saveFile(URL.createObjectURL(imageUrl), '100sen');
    };

    const outputCsv = async () => {
        const outputData = await window.api.csvStringifySync(
            tableData.getPlaylist(),
            { header: true, quoted: true }
        );
        const blob = new Blob([outputData], { type: 'text/csv' });
        const uri = URL.createObjectURL(blob);
        saveFile(uri, '100sen_data');
    };

    const saveFile = (dataUrl: string, fileName: string) => {
        const downloadElement = document.createElement('a');
        downloadElement.href = dataUrl;
        downloadElement.download = fileName;
        downloadElement.click();
    };

    return (
        <div id="to-wrapper">
            <div className="to-item-wrapper">
                <button id="output-jpeg-btn" onClick={outputCsv}>CSVファイルとして出力</button>
            </div>
            <div className="to-item-wrapper">
                <button id="convert-btn" onClick={outputJpeg}>画像として出力</button>
            </div>
        </div>
    );
};

export default EditTable;
