import React from 'react';
import TableData from './TableData';

type Props = {
    tableData: TableData,
    selectedItem: number,
    setSelectedItem: React.Dispatch<React.SetStateAction<number>>
};

const UPDATE_TARGET_ALL = [['thumbnail', 'サムネ'], ['title', 'タイトル'], ['userName', '投稿者名']] as const;
const TABLE_STYLE_DEFAULT = {
    titleFontSize: '0.9',
    userNameFontSize: '0.75',
    backGroundColor: '#ffffff'
};

const EditItem: React.FC<Props> = (props) => {
    return (
        <div id="edit-item" className="viewer-menu">
            <EditItemData {...props} />
            <EditItemStyle {...props} />
            <EditSelector {...props} />
        </div>
    );
};

const EditItemData: React.FC<Props> = ({ tableData, selectedItem }) => {
    const [updateTarget, setUpdateTarget] = React.useState<typeof UPDATE_TARGET_ALL[number][0]>('title');
    const [updateInput, setUpdateInput] = React.useState<string>('');

    React.useEffect(
        () => setUpdateInput(tableData.getData(selectedItem)?.current[updateTarget] ?? ''),
        [updateTarget, selectedItem]
    );

    const updateTableData = (input: string) => {
        setUpdateInput(input);
        tableData.overWrite(selectedItem, { [updateTarget]: input });
    };

    return (
        <div id="update-item">
            <div className="item-wrapper">
                <select id="update-target" onChange={e => setUpdateTarget(e.target.value as typeof updateTarget)} value={updateTarget}>
                    {
                        UPDATE_TARGET_ALL.map(([name, jp], i) => (
                            <option key={i} value={name}>
                                {jp}
                            </option>
                        ))
                    }
                </select>
                <button onClick={() => updateTableData(tableData.getData(selectedItem)?.original[updateTarget] ?? '')}>変更取消</button>
            </div>
            <div className="item-wrapper">
                <textarea id="update-input" value={updateInput} onChange={e => updateTableData(e.target.value)} />
            </div>
        </div>
    );
};

const EditItemStyle: React.FC<Props> = ({ tableData, selectedItem }) => {
    const [titleFontSize, setTitleFontSize] = React.useState(tableData.getData(selectedItem)?.current.titleFontSize ?? TABLE_STYLE_DEFAULT.titleFontSize);
    const [userNameFontSize, setUserNameFontSize] = React.useState(tableData.getData(selectedItem)?.current.userNameFontSize ?? TABLE_STYLE_DEFAULT.userNameFontSize);
    const [backGroundColor, setBackGroundColor] = React.useState(tableData.getData(selectedItem)?.current.backgroundColor ?? TABLE_STYLE_DEFAULT.backGroundColor);

    React.useEffect(
        () => {
            setTitleFontSize(tableData.getData(selectedItem)?.current.titleFontSize ?? TABLE_STYLE_DEFAULT.titleFontSize);
            setUserNameFontSize(tableData.getData(selectedItem)?.current.userNameFontSize ?? TABLE_STYLE_DEFAULT.userNameFontSize);
            setBackGroundColor(tableData.getData(selectedItem)?.current.backgroundColor ?? TABLE_STYLE_DEFAULT.backGroundColor);
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
                <label>背景色<input type="color" id="background-color" value={backGroundColor} onChange={itemStyleUpdate(setBackGroundColor, 'backgroundColor')} /></label>
            </div>
            <div className="item-wrapper">
                <label>タイトル文字サイズ<input type="number" className="char-size" step={0.1} value={titleFontSize} onChange={itemStyleUpdate(setTitleFontSize, 'title')} /></label>
            </div>
            <div className="item-wrapper">
                <label>投稿者名文字サイズ<input type="number" className="char-size" step={0.1} value={userNameFontSize} onChange={itemStyleUpdate(setUserNameFontSize, 'userName')} /></label>
            </div>
        </div>
    );
};

const EditSelector: React.FC<Props> = ({ setSelectedItem }) => {
    return (
        <div id="select-item">
            <div className="item-wrapper">
                <label><input type="checkbox" id="multiple-selection" />複数選択</label>
            </div>
            <div className="item-wrapper">
                <button onClick={() => setSelectedItem(-1)}>選択解除</button>
            </div>
        </div>
    );
};

export default EditItem;
