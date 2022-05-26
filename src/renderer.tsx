import React from 'react';
import { createRoot } from 'react-dom/client';

import ViewerTable from './ViewerTable';
import ViewerMenu from './ViewerMenu';
import TableData from './TableData';

const RootDiv: React.FC = () => {
    const tableData = new TableData();

    return (
        <>
            <ViewerMenu tableData={tableData} />
            <ViewerTable tableData={tableData} />
        </>
    );
};

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<RootDiv />);
