import React from "react";
import { originalData, SongDataForTable } from "./types";
import domtoimage from 'dom-to-image';
import PlaylistDataManager from './PlaylistDataManager';

type Props = {
    playlistManager: PlaylistDataManager
};

const isOriginalData = (data: Record<string, string>[]): data is originalData[] => {
    const keys: (keyof SongDataForTable)[] = ['title', 'userName', 'thumbnail'];
    return data.every(v => keys.every(k => k in v));
}

const ViewerMenu: React.FC<Props> = ({ playlistManager }) => {
    const urlInputRef = React.useRef<HTMLInputElement>(null!);
    const csvInputRef = React.useRef<HTMLInputElement>(null!);
    const radioSelectedRef = React.useRef<string>('from-url');

    const [isloadbtnDisabled, setIsLoadbtnDisabled] = React.useState(false);

    const loadPlaylist = async () => {
        setIsLoadbtnDisabled(true);
        switch (radioSelectedRef.current) {
            case 'from-url': {
                const videoIds = await window.api.getListData(urlInputRef.current.value);
                if (videoIds === undefined) {
                    setIsLoadbtnDisabled(false);
                    throw Error('URLが間違っています！');
                }
                playlistManager.clear();
                for (const videoId of videoIds) {
                    const songData = await window.api.getVideoData(videoId);
                    if (songData === undefined) continue;
                    playlistManager.add(songData);
                }
                break;
            }
            case 'form-csv': {
                const filePaths = csvInputRef.current.files;
                if (filePaths === null) return;
                for (const { path } of filePaths) {
                    const csvData = await window.api.csvParseSync(path, { columns: true });
                    if (!isOriginalData(csvData)) return;
                    for (const songData of csvData) playlistManager.add(songData);
                }
                break;
            }
        }
        setIsLoadbtnDisabled(false);
    };

    const outputJpeg = async () => {
        const songTable = document.getElementById('listdata-table');
        if (songTable === null) return;
        const imageUrl = await domtoimage.toJpeg(songTable);
        saveFile(imageUrl, '100sen');
    };

    const outputCsv = async () => {
        const outputData = await window.api.csvStringifySync(playlistManager.playlist, { header: true, quoted: true });
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

    const updateRadio: React.ChangeEventHandler = event => {
        radioSelectedRef.current = event.target.id;
        const inputs = [urlInputRef, csvInputRef];
        for (const { current } of inputs) current.disabled = !current.id.startsWith(event.target.id);
    };
    
    return (
        <div id="viewer-menu">
            <div id="from-wrapper">
                <div className="from-item-wrapper">
                    <label><input type="radio" name="from" id="from-url" onChange={updateRadio} defaultChecked />URLから読み込み</label>
                    <input type="text" id="from-url-inputbox" ref={urlInputRef} />
                </div>
                <div className="from-item-wrapper">
                    <label><input type="radio" name="from" id="form-csv" onChange={updateRadio} />CSVから読み込み</label>
                    <input type="file" id="form-csv-filebox" accept=".csv" ref={csvInputRef} disabled/>
                </div>
                <div className="from-load">
                    <button id="load-btn" onClick={loadPlaylist} disabled={isloadbtnDisabled}>表示</button>
                </div>
            </div>
            <div className="edit-wrapper">
                <div className="edit-item-wrapper">
                    <button id="trim-title-btn" onClick={() => playlistManager.trimTitle()}>タイトルの自動抜き出し</button>
                </div>
            </div>
            <div className="to-wrapper">
                <div className="to-item-wrapper">
                    <button id="convert-btn" onClick={outputJpeg}>画像として出力</button>
                </div>
                <div className="to-item-wrapper">
                    <button id="output-jpeg-btn" onClick={outputCsv}>CSVファイルとして出力</button>
                </div>
            </div>
        </div>
    );
};

export default ViewerMenu;
