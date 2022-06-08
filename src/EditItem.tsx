import React from 'react';
import TableData from './TableData';
import { originalData } from './types';

type Props = {
    tableData: TableData,
    selectedItem: number,
    setSelectedItem: React.Dispatch<React.SetStateAction<number>>
};

type EditItemDataProps = {
    tableData: TableData,
    selectedItem: number,
    selectedItemData: Required<originalData>
};

type UtilItemProps = {
    tableData: TableData,
    selectedItemData: Required<originalData>
};

type EditSelectorProps = {
    setSelectedItem: React.Dispatch<React.SetStateAction<number>>
};

const UPDATE_TARGET_ALL = [['thumbnail', 'サムネ'], ['title', 'タイトル'], ['userName', '投稿者名'], ['postDate', '投稿日'], ['videoId', '動画ID']] as const;

const EditItem: React.FC<Props> = ({ tableData, selectedItem, setSelectedItem }) => {
    const selectedItemData = tableData.getData(selectedItem);

    return (
        <div id="edit-item" className="viewer-menu">
            <EditItemData {...{ tableData, selectedItem, selectedItemData }} />
            <EditItemStyle {...{ tableData, selectedItem, selectedItemData }} />
            <UtilItem {...{ tableData, selectedItem, setSelectedItem, selectedItemData }} />
            <EditSelector {...{ setSelectedItem }} />
        </div>
    );
};

const EditItemData: React.FC<EditItemDataProps> = ({ tableData, selectedItem, selectedItemData }) => {
    const [updateTarget, setUpdateTarget] = React.useState<typeof UPDATE_TARGET_ALL[number][0]>('title');
    const [updateInput, setUpdateInput] = React.useState<string>('');

    React.useEffect(
        () => setUpdateInput(tableData.getData(selectedItem)[updateTarget]),
        [updateTarget, selectedItem]
    );

    const changeUpdateTarget: React.ChangeEventHandler<HTMLSelectElement> = e => {
        setUpdateTarget(e.target.value as typeof updateTarget);
        setUpdateInput(selectedItemData[updateTarget]);
    };

    const updateTableData = (input: string) => {
        setUpdateInput(input);
        tableData.overWrite(selectedItem, { [updateTarget]: input });
    };

    return (
        <div id="update-item">
            <div className="item-wrapper">
                <select id="update-target" onChange={changeUpdateTarget} value={updateTarget}>
                    {
                        UPDATE_TARGET_ALL.map(([name, jp], i) => (
                            <option key={i} value={name}>{jp}</option>
                        ))
                    }
                </select>
                <button onClick={() => updateTableData(tableData.getData(selectedItem, true)[updateTarget])}>変更取消</button>
            </div>
            <div className="item-wrapper">
                <textarea id="update-input" value={updateInput} onChange={e => updateTableData(e.target.value)} />
            </div>
        </div>
    );
};

const EditItemStyle: React.FC<EditItemDataProps> = ({ tableData, selectedItem, selectedItemData }) => {
    const [titleFontSize, setTitleFontSize] = React.useState(selectedItemData.titleFontSize);
    const [userNameFontSize, setUserNameFontSize] = React.useState(selectedItemData.userNameFontSize);
    const [backgroundColor, setBackGroundColor] = React.useState(selectedItemData.backgroundColor);

    React.useEffect(
        () => {
            const newSelectedItemData = tableData.getData(selectedItem);
            setTitleFontSize(newSelectedItemData.titleFontSize);
            setUserNameFontSize(newSelectedItemData.userNameFontSize);
            setBackGroundColor(newSelectedItemData.backgroundColor);
        },
        [selectedItem]
    );

    const itemStyleUpdate = (setState: React.Dispatch<React.SetStateAction<string>>, type: string): React.ChangeEventHandler<HTMLInputElement> => e => {
        setState(e.target.value);
        tableData.overWrite(selectedItem, { [type]: e.target.value });
    };

    return (
        <div id="change-display">
            <div className="item-wrapper">
                <label>背景色<input type="color" id="background-color" value={backgroundColor} onChange={itemStyleUpdate(setBackGroundColor, 'backgroundColor')} /></label>
            </div>
            <div className="item-wrapper">
                <label>タイトル文字サイズ<input type="number" className="char-size" step={0.1} value={titleFontSize} onChange={itemStyleUpdate(setTitleFontSize, 'titleFontSize')} /></label>
            </div>
            <div className="item-wrapper">
                <label>投稿者名文字サイズ<input type="number" className="char-size" step={0.1} value={userNameFontSize} onChange={itemStyleUpdate(setUserNameFontSize, 'userNameFontSize')} /></label>
            </div>
        </div>
    );
};

const UtilItem: React.FC<UtilItemProps> = ({ tableData, selectedItemData }) => {
    const applyAll: React.MouseEventHandler<HTMLButtonElement> = e => {
        for (const key of tableData.keys()) {
            const { backgroundColor, titleFontSize, userNameFontSize } = selectedItemData;
            tableData.overWrite(key, { backgroundColor, titleFontSize, userNameFontSize });
        }
    };

    return (
        <div id="style-multi">
            <div className="item-wrapper">
                <button
                    disabled={!selectedItemData.videoId}
                    onClick={() => window.api.openExternal(`https://www.nicovideo.jp/watch/${selectedItemData.videoId}`)}
                >動画を開く</button>
            </div>
            <div className="item-wrapper">
                <button onClick={applyAll}>全てに反映</button>
            </div>
        </div>
    );
};

const EditSelector: React.FC<EditSelectorProps> = ({ setSelectedItem }) => {
    return (
        <div id="select-item">
            <div className="item-wrapper">
                <button onClick={() => setSelectedItem(-1)}>選択解除</button>
            </div>
        </div>
    );
};

export default EditItem;
