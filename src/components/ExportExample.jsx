import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    useEffect
} from "react";
import Axios from 'axios'
import { AgGridReact } from "ag-grid-react";
import "../Styles/ExportExample.css";
import {
    ClientSideRowModelModule,
    CsvExportModule,
    ModuleRegistry,
    NumberFilterModule,
    TextFilterModule,
    ValidationModule,
} from "ag-grid-community";
import {
    ColumnMenuModule,
    ContextMenuModule,
    ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
    TextFilterModule,
    NumberFilterModule,
    ClientSideRowModelModule,
    CsvExportModule,
    ExcelExportModule,
    ColumnMenuModule,
    ContextMenuModule,
    ValidationModule /* Development Only */,
]);
import { useFetchJson } from './UseFetchJson';

const ExportExample = () => {
    const gridRef = useRef(null);
    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Athlete",
            children: [
                { field: "athlete", filter: true },
                { field: "age" },
                { field: "country", filter: true },
            ],
        },
        {
            headerName: "Medals",
            children: [{ field: "gold" }, { field: "silver" }, { field: "bronze" }],
        },
        { field: "total" },
    ]);
    const defaultColDef = useMemo(() => {
        return {
            filter: false,
            minWidth: 100,
            flex: 1,
        };
    }, []);
    const defaultExcelExportParams = useMemo(() => {
        return {
            exportAsExcelTable: true,
        };
    }, []);

    const { data, loading } = useFetchJson(
        "https://www.ag-grid.com/example-assets/small-olympic-winners.json",
    );

    const onBtExport = useCallback(() => {
        gridRef.current.api.exportDataAsExcel();
    }, []);

    const [issue, setIssue] = useState([]);
    const fetchData = () => {
        Axios.get("http://localhost:3002/api/issue")
            .then((response) => {
                setIssue(response.data);
            })
            .catch((error) => {
                console.log("Error while Fetching Issue Data", error);
            })
    }
    useEffect(() => {
        fetchData();
    }, []);
    console.log("Report = ", issue);

    return (
        <>
            <div style={containerStyle}>
                <div className="container">
                    <div>
                        <button
                            onClick={onBtExport}
                            style={{ marginBottom: "5px", fontWeight: "bold" }}
                        >
                            Export to Excel
                        </button>
                    </div>
                    <div className="grid-wrapper">
                        <div style={gridStyle}>
                            <AgGridReact
                                ref={gridRef}
                                rowData={data}
                                loading={loading}
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                defaultExcelExportParams={defaultExcelExportParams}
                            />

                            {/* <AgGridReact
                                ref={gridRef}
                                rowData={issue}
                                loading={loading}
                                // columnDefs={columnDefs}
                                // defaultColDef={defaultColDef}
                                defaultExcelExportParams={defaultExcelExportParams}
                            /> */}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ExportExample
