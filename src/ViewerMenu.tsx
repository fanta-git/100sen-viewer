import React from "react";

type Props = {
    urlInputRef: React.MutableRefObject<HTMLInputElement>,
    csvInputRef: React.MutableRefObject<HTMLInputElement>,
    loadList: React.MouseEventHandler<HTMLButtonElement>,
    outputJpeg: React.MouseEventHandler<HTMLButtonElement>
};

const ViewerMenu: React.FC<Props> = props => {
    return (
        <div id="viewer-menu">
            <div id="from-wrapper">
                <div className="from-item-wrapper">
                    <label><input type="radio" name="from" id="fromUrl" defaultChecked />URLから読み込み</label>
                    <input type="text" id="url-inputbox" ref={props.urlInputRef} />
                </div>
                <div className="from-item-wrapper">
                    <label><input type="radio" name="from" id="fromCSV" />CSVから読み込み</label>
                    <input type="file" id="csv-filebox" ref={props.csvInputRef} />
                </div>
                <div className="from-load">
                    <button id="load-btn" onClick={props.loadList}>表示</button>
                </div>
            </div>
            <div className="to-wrapper">
                <div className="to-item-wrapper">
                    <button id="output-jpeg-btn" onClick={props.outputJpeg}>CSVファイルとして出力</button>
                </div>
                <div className="to-item-wrapper">
                    <button id="convert-btn" onClick={props.outputJpeg}>画像として出力</button>
                </div>
            </div>
        </div>
    );
};

export default ViewerMenu;
