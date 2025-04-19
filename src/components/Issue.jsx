import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import styles from '../Styles/Issue.module.css';

const Issue = () => {
    // DropDown Data
    const [processData, setProcessData] = useState([]);
    const [shapeData, setShapeData] = useState([]);
    const [colorData, setColorData] = useState([]);
    const [clarityData, setClarityData] = useState([]);
    const [cutData, setCutData] = useState([]);
    const [FLData, setFLData] = useState([]);

    const fetchDropDownData = async () => {
        try {
            const [processRes, shapeRes, colorRes, clarityRes, cutRes, flRes] = await Promise.all([
                Axios.get("http://localhost:3002/api/process"),
                Axios.get("http://localhost:3002/api/shape"),
                Axios.get("http://localhost:3002/api/color"),
                Axios.get("http://localhost:3002/api/clarity"),
                Axios.get("http://localhost:3002/api/cut"),
                Axios.get("http://localhost:3002/api/fl")
            ]);
            setProcessData(processRes.data);
            setShapeData(shapeRes.data);
            setCutData(cutRes.data);
            setColorData(colorRes.data);
            setFLData(flRes.data);
            setClarityData(clarityRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const [empmanager, setEmpManager] = useState([]);
    const fetchEmpManager = () => {
        Axios.get("http://localhost:3002/api/emp/manager")
            .then((response) => {
                setEmpManager(response.data);
            })
            .catch((error) => {
                console.error("Error fetching employee-manager data:", error);
            });
    };

    useEffect(() => {
        fetchDropDownData();
        fetchEmpManager();
        fetchIssueData();
    }, []);






    // Process selection + filter
    // const [selectedProcess, setSelectedProcess] = useState('');
    // const selectedProcess = formData.process;
    // const filteredManagers = empmanager.filter((mgr) => mgr.PROCESS === selectedProcess);






    const [formData, setFormData] = useState({
        barcode: '',
        Process: '',
        kapan: '',
        lot: '',
        tag: '',
        weight: '',
        shape: '',
        color: '',
        clarity: '',
        cut: '',
        pol: '',
        sym: '',
        floro: '',
        ewgt: '',
        rwgt: '',
        saw: '',
        mid: '',
        remark: '',
    });
    const selectedProcess = formData.Process;
    const filteredManagers = empmanager.filter((mgr) => mgr.PROCESS === selectedProcess);
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({ ...prev, [name]: value }));
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedForm = {
            ...formData,
            [name]: value
        };

        setFormData(updatedForm);

        if (name === 'mid' || name === 'Process') {
            fetchFilteredEmployees(
                name === 'mid' ? value : updatedForm.mid,
                name === 'Process' ? value : updatedForm.Process
            );
        }

        // Prevent RWGT from being greater than IWGT
        if (name === "rwgt") {
            const iwgt = parseFloat(formData.weight) || 0;
            const newRwgt = parseFloat(value) || 0;
            if (newRwgt > iwgt) return; // Don't update if rwgt > iwgt
        }
    };

    // const handleIssue = async (e) => {
    //     e.preventDefault();
    //     try {
    //         await Axios.post("http://localhost:3002/api/add/issue", formData);
    //         alert("Data inserted successfully!");
    //         // Optionally reset form
    //         setFormData({
    //             barcode: '',
    //             Process: '',
    //             kapan: '',
    //             lot: '',
    //             tag: '',
    //             weight: '',
    //             shape: '',
    //             color: '',
    //             clarity: '',
    //             cut: '',
    //             pol: '',
    //             sym: '',
    //             floro: '',
    //             ewgt: '',
    //             rwgt: '',
    //             saw: '',
    //             mid: '',
    //             remark: '',
    //         });
    //         fetchIssueData();
    //     } catch (error) {
    //         console.error("Error inserting data:", error);
    //         alert("Failed to insert data.");
    //     }
    // };

    const [issueMap, setIssueMap] = useState({});
    const [issueData, setIssueData] = useState([]);
    const [returnData, setReturnData] = useState([]);
    const fetchIssueData = async () => {
        try {
            const response = await Axios.get("http://localhost:3002/api/get/issue");
            const returnResponse = await Axios.get("http://localhost:3002/api/get/return");
            setReturnData(returnResponse.data);
            const issues = response.data;
            setIssueData(issues);
            // Convert to barcode lookup object
            const map = {};
            issues.forEach(issue => {
                map[issue.BARCODE] = issue;
            });
            setIssueMap(map);
        } catch (error) {
            console.error("Server Error", error);
        }
    }




    const [filteredEmployees, setFilteredEmployees] = useState([]);
    // const fetchFilteredEmployees = async (mid, process) => {
    //     if (!mid || !process) return;
    //     try {
    //         const response = await Axios.post("http://localhost:3002/api/empbyprocess", {
    //             Mid: mid,
    //             Process: process
    //         });
    //         setFilteredEmployees(response.data);
    //     } catch (error) {
    //         console.error("Error fetching employees by manager and process:", error);
    //     }
    // };
    const fetchFilteredEmployees = async (mid, process) => {
        if (!process) return;
        try {
            if (!mid) {
                // No manager selected, fetch from prate table
                const response = await Axios.post("http://localhost:3002/api/partybyprocess", {
                    Process: process
                });
                setFilteredEmployees(response.data);
            } else {
                // Manager selected, fetch from emp table
                const response = await Axios.post("http://localhost:3002/api/empbyprocess", {
                    Mid: mid,
                    Process: process
                });
                setFilteredEmployees(response.data);
            }
        } catch (error) {
            console.error("Error fetching employees/parties:", error);
        }
    };




    const rwgtRef = useRef(null);
    const barcodeRef = useRef(null);
    // const handleBarcodeEnter = async (e) => {
    //     if (e.key === "Enter" && document.getElementById("return").checked) {
    //         e.preventDefault();
    //         try {
    //             const response = await axios.get(`http://localhost:3001/api/getIssueByBarcode/${formData.barcode}`);
    //             const issueData = response.data;
    //             if (issueData) {
    //                 setFormData({
    //                     ...formData,
    //                     kapan: issueData.KAPAN || '',
    //                     lot: issueData.LOT || '',
    //                     tag: issueData.TAG || '',
    //                     weight: issueData.WEIGHT || '',
    //                     shape: issueData.SHAPE || '',
    //                     color: issueData.COLOR || '',
    //                     clarity: issueData.CLARITY || '',
    //                     cut: issueData.CUT || '',
    //                     pol: issueData.POL || '',
    //                     sym: issueData.SYM || '',
    //                     floro: issueData.FLORO || '',
    //                     ewgt: issueData.EWGT || '',
    //                     rwgt: '', // RWGT should be empty so user can enter it
    //                     remark: ''
    //                 });
    //                 // Focus on RWGT input
    //                 setTimeout(() => {
    //                     rwgtRef.current?.focus();
    //                 }, 100);
    //             } else {
    //                 alert("No issue data found for the given barcode.");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching issue data:", error);
    //             alert("Failed to fetch issue data.");
    //         }
    //     }
    // };
    const handleBarcodeEnter = async (e) => {
        if ((e.key === "Enter" || e.key === "Tab") && document.getElementById("return").checked) {
            e.preventDefault();
            try {
                const response = await Axios.get("http://localhost:3002/api/get/issue");
                const allIssues = response.data;
                console.log(allIssues);
                const matchedIssue = allIssues.find(issue => issue.BARCODE === formData.barcode);
                // const matchedIssue = issueMap[formData.barcode];
                // if (!matchedIssue) {
                //     alert("No matching issue found for this barcode.");
                //     return;
                // }
                if (matchedIssue) {
                    setFormData({
                        ...formData,
                        kapan: matchedIssue.KAPAN || '',
                        lot: matchedIssue.PACKET || '',
                        tag: matchedIssue.TAG || '',
                        weight: matchedIssue.IWGT || '',
                        shape: matchedIssue.ISHAPE || '',
                        color: matchedIssue.ICOLOR || '',
                        clarity: matchedIssue.ICLARITY || '',
                        cut: matchedIssue.ICUT || '',
                        pol: matchedIssue.IPOL || '',
                        sym: matchedIssue.ISYM || '',
                        floro: matchedIssue.IFL || '',
                        ewgt: matchedIssue.EWGT || '',
                        rwgt: '', // empty so user can enter
                        remark: matchedIssue.REMARK || ''
                    });

                    // Focus RWGT input
                    setTimeout(() => {
                        rwgtRef.current?.focus();
                    }, 100);
                } else {
                    alert("No matching issue found for this barcode.");
                }

            } catch (error) {
                console.error("Error fetching issue data:", error);
                alert("Failed to fetch issue data.");
            }
        }
    };




    const [mode, setMode] = useState("issue"); // 'issue' or 'return'
    // const handleIssue = async (e) => {
    //     e.preventDefault();
    //     const existing = issueData.find(issue => issue.BARCODE === formData.barcode);
    //     if (mode === "issue" && existing) {
    //         // alert("Barcode already exists. Please use a unique one.");
    //         alert("Packet Aleady Issue");
    //         setTimeout(() => {
    //             barcodeRef.current?.focus();
    //         }, 100);
    //         return;
    //     }
    //     // 🚫 Prevent RWGT > IWGT
    //     if (mode === "return" && parseFloat(formData.rwgt) > parseFloat(formData.weight)) {
    //         alert("Return weight cannot be more than issue weight.");
    //         return;
    //     }
    //     if (parseFloat(formData.rwgt) < 0) {
    //         alert("Return weight cannot be negative.");
    //         return;
    //     }
    //     const matchedIssue = issueMap[formData.barcode];
    //     // console.log(matchedIssue);
    //     console.log("Barcode entered:", formData.barcode);
    //     console.log("All barcodes in map:", Object.keys(issueMap));
    //     console.log("Matched issue:", matchedIssue);

    //     if (parseFloat(matchedIssue.rwgt) > 0) {
    //         alert("Packet already returned.");
    //         setTimeout(() => {
    //             barcodeRef.current?.focus();
    //         }, 100);
    //         return;
    //     }
    //     try {
    //         if (mode === "issue") {
    //             await Axios.post("http://localhost:3002/api/add/issue", formData);
    //             alert("Data inserted successfully!");
    //         } else {
    //             await Axios.put("http://localhost:3002/api/update-issue", formData);
    //             alert("Return successfully!");
    //         }
    //         setFormData({
    //             barcode: '',
    //             Process: '',
    //             kapan: '',
    //             lot: '',
    //             tag: '',
    //             weight: '',
    //             shape: '',
    //             color: '',
    //             clarity: '',
    //             cut: '',
    //             pol: '',
    //             sym: '',
    //             floro: '',
    //             ewgt: '',
    //             rwgt: '',
    //             saw: '',
    //             mid: '',
    //             remark: '',
    //         });
    //         fetchIssueData();
    //     } catch (error) {
    //         console.error("Error submitting data:", error);
    //         alert("Failed to submit data.");
    //     }
    // };

    const handleIssue = async (e) => {
        e.preventDefault();

        // Empty barcode check
        if (!formData.barcode.trim()) {
            alert("Please enter a barcode.");
            return;
        }

        const existing = issueData.find(issue => issue.BARCODE === formData.barcode);
        const matchedIssue = issueMap[formData.barcode];

        // Prevent issuing again
        if (mode === "issue" && existing) {
            alert("Packet already issued.");
            setTimeout(() => barcodeRef.current?.focus(), 100);
            return;
        }

        // Prevent re-returning the same packet
        if (mode === "return") {
            if (!matchedIssue) {
                // alert("No issue found for this barcode.");
                alert("Packet Not issued.");
                return;
            }

            const returnedWeight = parseFloat(matchedIssue.RWGT || matchedIssue.rwgt || 0);
            if (returnedWeight > 0) {
                alert("Packet already returned.");
                setTimeout(() => barcodeRef.current?.focus(), 100);
                return;
            }

            const iwgt = parseFloat(formData.weight || 0);
            const rwgt = parseFloat(formData.rwgt || 0);

            if (rwgt > iwgt) {
                alert("Return weight cannot be more than issue weight.");
                return;
            }
            if (rwgt < 0) {
                alert("Return weight cannot be negative.");
                return;
            }
        }
        try {
            if (mode === "issue") {
                await Axios.post("http://localhost:3002/api/add/issue", formData);
                alert("Issued successfully!");
            } else {
                await Axios.put("http://localhost:3002/api/update-issue", formData);
                alert("Returned successfully!");
            }
            // Reset form
            setFormData({
                barcode: '',
                Process: '',
                kapan: '',
                lot: '',
                tag: '',
                weight: '',
                shape: '',
                color: '',
                clarity: '',
                cut: '',
                pol: '',
                sym: '',
                floro: '',
                ewgt: '',
                rwgt: '',
                saw: '',
                mid: '',
                remark: '',
            });
            fetchIssueData(); // Refresh map and table
            // Auto focus barcode again
            setTimeout(() => barcodeRef.current?.focus(), 100);
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Failed to submit data.");
        }
    };


    return (
        <>
            {/* <form onSubmit={handleIssue} className={styles.issueForm}>
                    <h2>Issue Entry</h2>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label htmlFor="process">Process</label>
                            <select id="process" name="Process" value={formData.Process} onChange={handleChange}>
                                <option value="">-- Select Process --</option>
                                {processData.map((pr) => (
                                    <option key={pr.SEQ} value={pr.PROCESS}>{pr.PROCESS}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="manager">Manager</label>
                            <select id="manager" name="mid" value={formData.mid} onChange={handleChange}>
                                <option value="">--</option>
                                {filteredManagers.map((manager, index) => (
                                    <option key={index} value={manager.MID}>{manager.ENAME}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="employee">Employee/Party</label>
                            <select name="employee">
                                <option value="">-- Select --</option>
                                {filteredEmployees.map((item) => (
                                    <option key={item.EMPID || item.PID} value={item.EMPID || item.PID}>
                                        {item.ENAME || item.PARTY}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles.radioGroup}>
                        <label><input type="radio" name="issueReturn" id="issue" /> Issue</label>
                        <label><input type="radio" name="issueReturn" id="return" /> Return</label>
                    </div>
                    <div className={styles.grid}>
                        <input type="text" name="barcode" placeholder="Barcode" value={formData.barcode} onChange={handleChange} />
                        <input type="text" name="kapan" placeholder="Kapan" value={formData.kapan} onChange={handleChange} />
                        <input type="text" name="lot" placeholder="Lot" value={formData.lot} onChange={handleChange} />
                        <input type="text" name="tag" placeholder="Tag" value={formData.tag} onChange={handleChange} />
                        <input type="number" name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} />
                        <select name="shape" value={formData.shape} onChange={handleChange}>
                            <option value="">Shape</option>
                            {shapeData.map((shape) => (
                                <option key={shape.SID} value={shape.SHAPE}>{shape.SHAPE}</option>
                            ))}
                        </select>
                        <select name="color" value={formData.color} onChange={handleChange}>
                            <option value="">Color</option>
                            {colorData.map((color) => (
                                <option key={color.CID} value={color.COLOR}>{color.COLOR}</option>
                            ))}
                        </select>
                        <select name="clarity" value={formData.clarity} onChange={handleChange}>
                            <option value="">Clarity</option>
                            {clarityData.map((clarity) => (
                                <option key={clarity.CID} value={clarity.CLARITY}>{clarity.CLARITY}</option>
                            ))}
                        </select>
                        <select name="cut" value={formData.cut} onChange={handleChange}>
                            <option value="">Cut</option>
                            {cutData.map((cut) => (
                                <option key={cut.CID} value={cut.CUT}>{cut.CUT}</option>
                            ))}
                        </select>
                        <select name="pol" value={formData.pol} onChange={handleChange}>
                            <option value="">Pol</option>
                            {cutData.map((pol) => (
                                <option key={pol.CID} value={pol.CUT}>{pol.CUT}</option>
                            ))}
                        </select>
                        <select name="sym" value={formData.sym} onChange={handleChange}>
                            <option value="">Sym</option>
                            {cutData.map((sym) => (
                                <option key={sym.CID} value={sym.CUT}>{sym.CUT}</option>
                            ))}
                        </select>
                        <select name="floro" value={formData.floro} onChange={handleChange}>
                            <option value="">Floro</option>
                            {FLData.map((fl) => (
                                <option key={fl.FID} value={fl.FL}>{fl.FL}</option>
                            ))}
                        </select>
                        <input type="number" name="ewgt" placeholder="Ewgt" value={formData.ewgt} onChange={handleChange} />
                        <input type="number" name="rwgt" placeholder="Rwgt" value={formData.rwgt} onChange={handleChange} />
                        <input type="text" name="remark" placeholder="Remark" value={formData.remark} onChange={handleChange} />
                    </div>
                    <div className={styles.submitWrapper}>
                        <button type="submit">Submit</button>
                    </div>
                </form> */}

            <form onSubmit={handleIssue} className={styles.issueForm}>
                <h1>Issue Return</h1>
                <div className={styles.row}>
                    <div className={styles.field}>
                        <label htmlFor="process">Process: </label>
                        <select
                            id="process"
                            name="Process"
                            value={formData.Process}
                            onChange={handleChange}
                        >
                            <option value="">Select Process</option>
                            {processData.map((pr) => (
                                <option key={pr.SEQ} value={pr.PROCESS}>
                                    {pr.PROCESS}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.field}>

                        <label htmlFor="manager">Manager: </label>
                        <select id="manager" name="mid" value={formData.mid} onChange={handleChange}>
                            <option value="">Select Manager</option>
                            <option value="">--</option>
                            {filteredManagers.map((manager, index) => (
                                <option key={index + 1} value={manager.MID}>
                                    {manager.ENAME}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="employee">Employee/Party</label>
                        <select name="employee">
                            <option value="">Select Employee/Party</option>
                            {filteredEmployees.map((item) => (
                                <option key={item.EMPID || item.PID} value={item.EMPID || item.PID}>
                                    {item.ENAME || item.PARTY}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <input
                    type="radio"
                    id="issue"
                    name="issueReturn"
                    value="issue"
                    checked={mode === "issue"}
                    onChange={() => setMode("issue")}
                />
                <label htmlFor="issue">Issue</label>

                <input
                    type="radio"
                    id="return"
                    name="issueReturn"
                    value="return"
                    checked={mode === "return"}
                    onChange={() => setMode("return")}
                />
                <label htmlFor="return">Return</label>

                <br /><br />
                {/* <input type="radio" id='issue' name='issueReturn' />
                <label htmlFor="issue">Issue</label>
                <input type="radio" id='return' name='issueReturn' />
                <label htmlFor="return">Return</label> */}
                {/* <select name="employee">
                        <option value="">-- Select Employee --</option>
                        {filteredEmployees.map((emp) => (
                            <option key={emp.EMPID} value={emp.EMPID}>
                                {emp.ENAME}
                            </option>
                        ))}
                    </select> */}
                <br /><br /><br /><br />

                <table className={styles.issueTable} border='1'>
                    <thead>
                        <tr>
                            <td>
                                {/* <input type="text" name="barcode" placeholder='Barcode' value={formData.barcode} onChange={handleChange} /> */}
                                <input
                                    required
                                    type="text"
                                    name="barcode"
                                    placeholder="Barcode"
                                    value={formData.barcode}
                                    onChange={handleChange}
                                    onKeyDown={handleBarcodeEnter}
                                    ref={barcodeRef}
                                />

                            </td>
                            <td>
                                <input type="text" name="kapan" placeholder='Kapan' value={formData.kapan} onChange={handleChange} />
                            </td>
                            <td>
                                <input type="text" name="lot" placeholder='Lot' value={formData.lot} onChange={handleChange} />
                            </td>
                            <td>
                                <input type="text" name="tag" placeholder='Tag' value={formData.tag} onChange={handleChange} />
                            </td>
                            <td>
                                <input type="number" name="weight" placeholder='Weight' value={formData.weight} onChange={handleChange} />
                            </td>
                            <td>
                                <select name="shape" id="" value={formData.shape} onChange={handleChange}>
                                    <option value="">Shape</option>
                                    {
                                        shapeData.map((shape) => (
                                            <option key={shape.SID} value={shape.SHAPE}>{shape.SHAPE}</option>
                                        ))
                                    }
                                </select>
                            </td>
                            <td>
                                <select name="color" id="" value={formData.color} onChange={handleChange}>
                                    <option value="">Color</option>
                                    {
                                        colorData.map((color) => (
                                            <option key={color.CID} value={color.COLOR}>{color.COLOR}</option>
                                        ))
                                    }
                                </select>
                            </td>
                            <td>
                                <select name="clarity" id="" value={formData.clarity} onChange={handleChange}>
                                    <option value="">Clarity</option>
                                    {
                                        clarityData.map((clarity) => (
                                            <option key={clarity.CID} value={clarity.CLARITY}>{clarity.CLARITY}</option>
                                        ))
                                    }
                                </select>
                            </td>
                            <td>
                                <select name="cut" id="" value={formData.cut} onChange={handleChange}>
                                    <option value="">Cut</option>
                                    {
                                        cutData.map((cut) => (
                                            <option key={cut.CID} value={cut.CUT}>{cut.CUT}</option>
                                        ))
                                    }
                                </select>
                            </td>
                            <td>
                                <select name="pol" id="" value={formData.pol} onChange={handleChange}>
                                    <option value="">Pol</option>
                                    {
                                        cutData.map((pol) => (
                                            <option key={pol.CID} value={pol.CUT}>{pol.CUT}</option>
                                        ))
                                    }
                                </select>
                            </td>
                            <td>
                                <select name="sym" id="" value={formData.sym} onChange={handleChange}>
                                    <option value="">Sym</option>
                                    {
                                        cutData.map((sym) => (
                                            <option key={sym.CID} value={sym.CUT}>{sym.CUT}</option>
                                        ))
                                    }
                                </select>
                            </td>
                            <td>
                                <select name="floro" id="" value={formData.floro} onChange={handleChange}>
                                    <option value="">Floro</option>
                                    {
                                        FLData.map((fl) => (
                                            <option key={fl.FID} value={fl.FL}>{fl.FL}</option>
                                        ))
                                    }
                                </select>
                            </td>
                            <td>
                                <input type="number" name="ewgt" placeholder='Ewgt' value={formData.ewgt} onChange={handleChange} />
                            </td>
                            <td>
                                {/* <input type="number" name="rwgt" placeholder='Rwgt' value={formData.rwgt} onChange={handleChange} /> */}
                                <input
                                    type="number"
                                    name="rwgt"
                                    placeholder="Rwgt"
                                    value={formData.rwgt}
                                    onChange={handleChange}
                                    ref={rwgtRef}
                                    step="any"
                                // max={formData.weight}
                                />
                            </td>
                            {/* <td>
                                    <input type="text" name="saw" placeholder='Saw' value={formData.saw} onChange={handleChange} />
                                </td>
                                <td>
                                    <input type="number" name="mid" placeholder='Mid' value={formData.mid} onChange={handleChange} />
                                </td> */}
                            <td>
                                <input type="text" name="remark" placeholder='Remark' value={formData.remark} onChange={handleChange} />
                            </td>
                            <td style={{ display: "none" }}>
                                <input type="submit" />
                            </td>
                        </tr>
                        <tr>
                            <th>Barcode</th>
                            <th>Kapan</th>
                            <th>Lot</th>
                            <th>Tag</th>
                            <th>Weight</th>
                            <th>Shape</th>
                            <th>Color</th>
                            <th>Clarity</th>
                            <th>Cut</th>
                            <th>Pol</th>
                            <th>Sym</th>
                            <th>Floro</th>
                            <th>Ewgt</th>
                            <th>Rwgt</th>
                            {/* <th>Saw</th>
                                <th>Mid</th> */}
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {
                            issueData.map((issue) => (
                                <tr key={issue.ISSUEID}>
                                    <td>{issue.BARCODE}</td>
                                    <td>{issue.KAPAN}</td>
                                    <td>{issue.PACKET}</td>
                                    <td>{issue.TAG}</td>
                                    <td>{issue.IWGT}</td>
                                    <td>{issue.ISHAPE}</td>
                                    <td>{issue.ICOLOR}</td>
                                    <td>{issue.ICLARITY}</td>
                                    <td>{issue.ICUT}</td>
                                    <td>{issue.IPOL}</td>
                                    <td>{issue.ISYM}</td>
                                    <td>{issue.IFL}</td>
                                    <td>{issue.EWGT}</td>
                                    <td>{issue.RWGT}</td>
                                    <td>{issue.SAW}</td>
                                        <td>{issue.MID}</td>
                                    <td>{issue.REMARK}</td>
                                </tr>
                            ))
                        } */}

                        {mode === "issue" ? (
                            issueData.map((issue) => (
                                <tr key={issue.ISSUEID}>
                                    <td>{issue.BARCODE}</td>
                                    <td>{issue.KAPAN}</td>
                                    <td>{issue.PACKET}</td>
                                    <td>{issue.TAG}</td>
                                    <td>{issue.IWGT}</td>
                                    <td>{issue.ISHAPE}</td>
                                    <td>{issue.ICOLOR}</td>
                                    <td>{issue.ICLARITY}</td>
                                    <td>{issue.ICUT}</td>
                                    <td>{issue.IPOL}</td>
                                    <td>{issue.ISYM}</td>
                                    <td>{issue.IFL}</td>
                                    <td>{issue.EWGT}</td>
                                    <td>{issue.RWGT}</td>
                                    <td>{issue.REMARK}</td>
                                </tr>
                            ))
                        ) : (
                            returnData.map((ret, i) => (
                                <tr key={ret.BARCODE || i}>
                                    <td>{ret.BARCODE}</td>
                                    <td>{ret.KAPAN}</td>
                                    <td>{ret.PACKET}</td>
                                    <td>{ret.TAG}</td>
                                    <td>{ret.IWGT}</td>
                                    <td>{ret.ISHAPE}</td>
                                    <td>{ret.ICOLOR}</td>
                                    <td>{ret.ICLARITY}</td>
                                    <td>{ret.ICUT}</td>
                                    <td>{ret.IPOL}</td>
                                    <td>{ret.ISYM}</td>
                                    <td>{ret.IFL}</td>
                                    <td>{ret.EWGT}</td>
                                    <td>{ret.RWGT}</td>
                                    <td>{ret.REMARK}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </form>
        </>
    );
};

export default Issue;
