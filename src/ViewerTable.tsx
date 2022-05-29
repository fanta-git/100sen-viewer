import React, { DragEventHandler } from 'react';
import TableData from './TableData';

import noDataImage from './assets/no_data.png';
import './style.css';

type Props = {
    tableData: TableData,
    itemSelect: React.Dispatch<React.SetStateAction<number>>
}

const DRAG_OVER_CLASSES = { left: 'drag-over-left', right: 'drag-over-right' };

const ViewerTable: React.FC<Props> = ({ tableData, itemSelect }) => {
    const items: React.ReactElement[] = [];
    let dropKey = -1;
    for (const { key, current } of tableData.playlist) {
        const dragEvents: Record<string, DragEventHandler<HTMLDivElement>> = {
            onDragStart: e => {
                e.dataTransfer.effectAllowed = 'move';
                dropKey = key;
            },
            onDragOver: e => {
                e.stopPropagation();
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                if (e.clientX - rect.left < rect.width / 2) {
                    e.currentTarget.classList.remove(DRAG_OVER_CLASSES.right);
                    e.currentTarget.classList.add(DRAG_OVER_CLASSES.left);
                } else {
                    e.currentTarget.classList.add(DRAG_OVER_CLASSES.right);
                    e.currentTarget.classList.remove(DRAG_OVER_CLASSES.left);
                }
            },
            onDragLeave: e => {
                e.currentTarget.classList.remove(DRAG_OVER_CLASSES.left, DRAG_OVER_CLASSES.right);
            },
            onDrop: e => {
                if (dropKey < 0) return;
                e.stopPropagation();
                e.preventDefault();
                const isRight = e.currentTarget.classList.contains(DRAG_OVER_CLASSES.right);
                tableData.move(dropKey, key, isRight);
                e.currentTarget.classList.remove(DRAG_OVER_CLASSES.left, DRAG_OVER_CLASSES.right);
                dropKey = -1;
            },
            onDragEnd: () => {
                if (dropKey < 0) return;
                tableData.deleat(dropKey);
                dropKey = -1;
            }
        };

        items.push(
            <div className='song' key={key} onClick={() => itemSelect(key)} draggable='true' {...dragEvents}>
                <img className='thumbnail' src={current.thumbnail} draggable='false' onError={e => { e.currentTarget.src = noDataImage; }} />
                <div className='title' style={{ fontSize: current.titleFontSize + 'em' }}>{current.title}</div>
                <div className='user-name' style={{ fontSize: current.userNameFontSize + 'em' }}>{current.userName}</div>
            </div>
        );
    }

    return <div id='listdata-table'>{items}</div>;
};

export default ViewerTable;
