import React from 'react';
import TableData from './TableData';

type Props = {
    tableData: TableData,
    selectedItem: number,
    setSelectedItem: React.Dispatch<React.SetStateAction<number>>
};

const UPDATE_TARGET_ALL = [['thumbnail', 'サムネ'], ['title', 'タイトル'], ['userName', '投稿者名']] as const;

const EditItem: React.FC<Props> = ({ tableData, selectedItem, setSelectedItem }) => {
    const [updateTarget, setUpdateTarget] = React.useState<typeof UPDATE_TARGET_ALL[number][0]>('thumbnail');
    const [updateInput, setUpdateInput] = React.useState<string>('');

    React.useEffect(
        () => setUpdateInput(tableData.getData(selectedItem)?.current[updateTarget] ?? ''),
        [updateTarget, selectedItem]
    );

    const updateInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const newInput = e.target.value;
        setUpdateInput(newInput);
        tableData.overWrite(selectedItem, { [updateTarget]: newInput });
    };

    return (
        <div id="edit-item" className="viewer-menu">
            <div id="update-item">
                <div className="item-wrapper">
                    {
                        UPDATE_TARGET_ALL.map(([name, jp], i) => (
                            <label key={i}>
                                <input type="radio" name="update-target" value={name} onChange={() => setUpdateTarget(name)} checked={updateTarget === name} />
                                {jp}
                            </label>
                        ))
                    }
                </div>
                <div className="item-wrapper">
                    <input type="text" id="update-input" value={updateInput} onChange={updateInputChange} />
                </div>
                <button onClick={() => setSelectedItem(-1)}>選択解除</button>
            </div>
        </div>
    );
};

export default EditItem;
