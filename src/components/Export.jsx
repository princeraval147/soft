import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Export = () => {
    const [issue, setIssue] = useState([]);

    // 1️⃣ Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        Axios.get("http://localhost:3002/api/issue")
            .then((response) => {
                setIssue(response.data);
            })
            .catch((error) => {
                console.error("Error while fetching issue data:", error);
            });
    };

    // 2️⃣ Build and download the Excel file
    const exportToExcel = () => {
        // Convert JSON array → worksheet
        const worksheet = XLSX.utils.json_to_sheet(issue);
        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Issues');

        // Write workbook to binary array
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        // Create a Blob and trigger download
        const dataBlob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });
        saveAs(dataBlob, 'issues_export.xlsx');
    };

    return (
        <div className="p-4">
            {/* Optional: render your issues in a table */}
            {/* <table className="mb-4 border-collapse border">
                <thead>
                    <tr>
                        <th className="border px-2">ID</th>
                        <th className="border px-2">Title</th>
                        <th className="border px-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {issue.map((item) => (
                        <tr key={item.id}>
                            <td className="border px-2">{item.id}</td>
                            <td className="border px-2">{item.title}</td>
                            <td className="border px-2">{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table> */}

            {/* 3️⃣ Export button */}
            <button
                onClick={exportToExcel}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Export to Excel
            </button>
        </div>
    );
};

export default Export;
