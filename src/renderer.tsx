import React from "react";
import { createRoot } from 'react-dom/client';

import PlaylistTable from './PlaylistTable';
import ViewerMenu from "./ViewerMenu";
import PlaylistDataManager from './PlaylistDataManager';

const RootDiv: React.FC = () => {
    const listManager = new PlaylistDataManager();

    return (
        <>
            <ViewerMenu playlistManager={listManager} />
            <PlaylistTable playlistManager={listManager} />
        </>
    );
};

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<RootDiv/>);
