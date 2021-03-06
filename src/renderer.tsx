import React from 'react';
import { createRoot } from 'react-dom/client';

import ViewerTable from './ViewerTable';
import EditTable from './EditTable';
import TableData from './TableData';
import EditItem from './EditItem';

const RootDiv: React.FC = () => {
    const tableData = new TableData();
    const [selectedItem, setSelectedItem] = React.useState<number>(-1);

    return (
        <>
            <div id="editmenu-wrapper">
                {
                    selectedItem < 0
                        ? <EditTable tableData={tableData} />
                        : <EditItem tableData={tableData} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
                }
            </div>
            <div id="table-wrapper">
                <ViewerTable tableData={tableData} itemSelect={setSelectedItem} />
            </div>
        </>
    );
};

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<RootDiv />);
