import React from "react";
import { SongDataForTable } from "./types";
import domtoimage from 'dom-to-image';

type Props = {
    playlistData: SongDataForTable[],
    setPlaylistData: React.Dispatch<React.SetStateAction<SongDataForTable[]>>
};

const ViewerMenu: React.FC<Props> = props => {
    const urlInputRef = React.useRef<HTMLInputElement>(null!);
    const csvInputRef = React.useRef<HTMLInputElement>(null!);

    const loadPlaylist = async () => {
        const videoIds = await window.api.getListData(urlInputRef.current.value);
        if (videoIds === undefined) throw Error('URLが間違っています！');
        const result = await window.api.getVideoData(videoIds);
        props.setPlaylistData(result);
    };

    const outputJpeg = async () => {
        const songTable = document.getElementById('listdata-table');
        if (songTable === null) return;
        const imageUrl = await domtoimage.toJpeg(songTable);
        saveFile(imageUrl, '100sen');
    };

    const outputCsv = async () => {
        const outputData = await window.api.csvStringifySync(props.playlistData);
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
        <div id="viewer-menu">
            <div id="from-wrapper">
                <div className="from-item-wrapper">
                    <label><input type="radio" id="fromUrl" defaultChecked />URLから読み込み</label>
                    <input type="text" id="url-inputbox" ref={urlInputRef} />
                </div>
                <div className="from-item-wrapper">
                    <label><input type="radio" id="fromCSV" />CSVから読み込み</label>
                    <input type="file" id="csv-filebox" ref={csvInputRef} />
                </div>
                <div className="from-load">
                    <button id="load-btn" onClick={loadPlaylist}>表示</button>
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
