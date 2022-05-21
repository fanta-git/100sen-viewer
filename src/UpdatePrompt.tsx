import React from "react";
import { SongDataForTable } from "./types";

type Props = {
    isOpen: boolean
    songData?: SongDataForTable
};

const UpdatePrompt: React.FC<Props> = props => {
    return (
        <div id="update-prompt" style={{ display: props.isOpen ? 'block' : 'none' }}>

            <input type="text" id="prompt-input" />
            <div id="prompt-btns">
                <button id="cancel">キャンセル</button>
                <button id="update">変更</button>
            </div>
        </div>
    );
};

export default UpdatePrompt;
