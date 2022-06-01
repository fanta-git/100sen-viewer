import React from 'react';
import domtoimage from 'dom-to-image';
import TableData from './TableData';

type Props = {
    tableData: TableData
};

const pick = <T extends Record<string, unknown>, U extends keyof T>(from: T, keys: readonly U[]) =>
    keys.reduce((p, c) => Object.assign(p, { [c]: from[c] }), {}) as Pick<T, U>;

const ORIGINAL_KEYS = ['title', 'userName', 'thumbnail', 'postDate', 'videoId', 'backgroundColor', 'titleFontSize', 'userNameFontSize'] as const;

const EditTable: React.FC<Props> = ({ tableData }) => {
    return (
        <div id="edit-table" className="viewer-menu">
            <FromMenu tableData={tableData} />
            <EditMenu tableData={tableData} />
            <ToMenu tableData={tableData} />
        </div>
    );
};

const FromMenu: React.FC<Props> = ({ tableData }) => {
    const urlInputRef = React.useRef<HTMLInputElement>(null!);
    const csvInputRef = React.useRef<HTMLInputElement>(null!);
    const isJoinSongsRef = React.useRef<HTMLInputElement>(null!);
    const fromTypeRef = React.useRef<string>('from-url');
    const [isloadbtnDisabled, setIsLoadbtnDisabled] = React.useState(false);

    const loadPlaylist = async () => {
        setIsLoadbtnDisabled(true);
        switch (fromTypeRef.current) {
        case 'from-url': {
            const videoIds = await window.api.getListData(urlInputRef.current.value);
            if (videoIds === undefined) {
                setIsLoadbtnDisabled(false);
                await window.api.showErrorBox('URLが間違っています', 'KiiteのプレイリストのURLか、ニコニコ動画のマイリストのURLを入力してください');
                return;
            }
            if (!isJoinSongsRef.current.checked) tableData.clear();
            for (const videoId of videoIds) {
                const songData = await window.api.getVideoData(videoId);
                if (songData === undefined) continue;
                tableData.add(songData);
            }
            break;
        }
        case 'form-csv': {
            const filePaths = csvInputRef.current.files;
            if (filePaths === null) return;
            if (!isJoinSongsRef.current.checked) tableData.clear();
            for (const { path } of filePaths) {
                const csvData = await window.api.csvParseSync(path, { columns: true }) as Record<string, string>[];
                for (const songData of csvData) tableData.add(pick(songData, ORIGINAL_KEYS));
            }
            break;
        }
        }
        setIsLoadbtnDisabled(false);
    };

    const updateRadio: React.ChangeEventHandler = event => {
        fromTypeRef.current = event.target.id;
        const inputs = [urlInputRef, csvInputRef];
        for (const { current } of inputs) current.disabled = !current.id.startsWith(event.target.id);
    };

    return (
        <div id="from-wrapper">
            <div className="from-item-wrapper">
                <label><input type="radio" name="from" id="from-url" onChange={updateRadio} defaultChecked />URLから読み込み</label>
                <input type="text" id="from-url-inputbox" ref={urlInputRef} />
            </div>
            <div className="from-item-wrapper">
                <label><input type="radio" name="from" id="form-csv" onChange={updateRadio} />CSVから読み込み</label>
                <input type="file" id="form-csv-filebox" accept=".csv" ref={csvInputRef} disabled />
            </div>
            <div className="from-load">
                <label><input type="checkbox" id="isJoinSongs" ref={isJoinSongsRef} />追加で読み込む</label>
                <button id="load-btn" onClick={loadPlaylist} disabled={isloadbtnDisabled}>表示</button>
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

    return (
        <div id="edit-wrapper">
            <div className="edit-item-wrapper">
                <button id="trim-title-btn" onClick={() => tableData.trimTitle()}>タイトルの自動抜き出し</button>
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
