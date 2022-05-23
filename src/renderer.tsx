import React from "react";
import { createRoot } from 'react-dom/client';

import PlaylistTable from './PlaylistTable';
import { SongDataForTable } from './types';
import ViewerMenu from "./ViewerMenu";

const RootDiv: React.FC = () => {
    const [playlistData, setPlaylistData] = React.useState<SongDataForTable[]>([]);

    return (
        <>
            <ViewerMenu playlistData={playlistData} setPlaylistData={setPlaylistData} />
            <PlaylistTable tableData={playlistData} setTableData={setPlaylistData} />
        </>
    );
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<RootDiv/>);
