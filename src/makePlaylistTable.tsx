import React from 'react';

import './style.css';
import { SongDataForTable } from './types';
import InputToggle from './InputToggle';

type funcType = (
    tableDatas: SongDataForTable[],
    getPlaylistCells: JSX.Element[],
    setPlaylistCells: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    inputBoxRef: React.RefObject<HTMLInputElement>
) => JSX.Element[];

const makePlaylistTable: funcType = (tableDatas, getPlaylistCells, setPlaylistCells, inputBoxRef) => {
    const items: React.ReactElement[] = [];
    for (const videoData of tableDatas) {
        items.push(
            <div className="song" key={items.length}>
                <img className="thumbnail" src={videoData.thumbnail} />
                {/* <div className="title">{videoData.title}</div> */}
                <InputToggle
                    className='title'
                    setter={setPlaylistCells}
                    getter={items}
                    inputboxRef={inputBoxRef}
                    key_={items.length}
                >{videoData.title}</InputToggle>
                    
                <div className="creator">{videoData.userName}</div>
            </div>
        );
    }

    return items;
};

export default makePlaylistTable;
