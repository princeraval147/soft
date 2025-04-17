import React, { useEffect, useState, useRef } from 'react';
import Axios from 'axios'
import '../../Styles/Report.css'
import ExportExample from '../ExportExample';
import Export from '../Export';

const Report = () => {

    // For Print
    const printRef = useRef();
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        const content = printRef.current.innerHTML;
        printWindow.document.write(`
          <html>
          <head>
            <title>Print Report</title>
            <link rel="stylesheet" href="../../Styles/Report.css">
          </head>
          <body>
            ${content}
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

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

    const totalAmount = issue.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);


    return (
        <>
            <h1>Report</h1>
            <div id="printSection" ref={printRef}>
                <table border={1} className="report">
                    <thead>
                        <th>Party</th>
                        <th>Issue Wt</th>
                        <th>Kapan</th>
                        <th>Packet</th>
                        <th>Amount</th>
                    </thead>
                    <tbody>
                        {
                            issue.map((p, index) => (
                                <tr key={index + 1}>
                                    <td>{p.party}</td>
                                    <td>{p.kapan}</td>
                                    <td>{p.iwgt}</td>
                                    <td>{p.packet}</td>
                                    <td>{p.amount}</td>
                                </tr>
                            ))
                        }
                        <tr className="reportFooter">
                            <td>Total:</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{totalAmount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button onClick={handlePrint}>Print</button>


            <br /><br /><br /><br />
            <div>
                <h1>Export : </h1>
                {/* <ExportExample /> ag-grid*/}

                {/* Easy Library Export =  */}
                <Export />
            </div>
        </>
    );
}

export default Report;