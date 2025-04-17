import React, { useState, useEffect } from 'react';
import styles from '../Styles/LabourProcess.module.css'
import Axios from 'axios';

const LabourProcess = () => {

    const [labourProcess, setLabourProcess] = useState([]);
    const [labourData, setLabourData] = useState({
        srNo: "",
        Process: "",
        Type: "",
        Shape: "",
        Cut: "",
        Pol: "",
        Sym: "",
        FromSize: "",
        ToSize: "",
        Rate: "",
        LType: "P"
    });

    // DropDown Data
    const [processData, setProcessData] = useState([]);
    const [shapeData, setShapeData] = useState([]);
    const [cutData, setCutData] = useState([]);

    const fetchLabourProcess = async () => {
        try {
            const response = await Axios.get("http://localhost:3002/api/labourprocess");
            setLabourProcess(response.data);
        } catch (error) {
            console.error("server Error");
        }
    }


    const fetchDropDownData = async () => {
        try {
            const [processRes, shapeRes, cutRes] = await Promise.all([
                Axios.get("http://localhost:3002/api/process"),
                Axios.get("http://localhost:3002/api/shape"),
                Axios.get("http://localhost:3002/api/cut")
            ]);
            setProcessData(processRes.data);
            setShapeData(shapeRes.data);
            setCutData(cutRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchDropDownData();
        fetchLabourProcess();
    }, []);

    const handleLabourProcessChange = (e) => {
        const { name, value } = e.target;
        setLabourData(prev => ({ ...prev, [name]: value }));
    };

    const submitLabourProcess = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.post("http://localhost:3002/api/add-labourprocess", labourData);
            if (response.data.error) {
                alert(response.data.error);  // If there is an error, show the message
                return;
            }
            alert("Labour Process Added");
            setLabourData({
                srNo: "",
                Process: "",
                Type: "",
                Shape: "",
                Cut: "",
                Pol: "",
                Sym: "",
                FromSize: "",
                ToSize: "",
                Rate: "",
                LType: "P"
            });

            fetchLabourProcess();
        } catch (error) {
            if (error.response && error.response.data?.error) {
                alert(error.response.data.error);
            } else {
                alert("Server error. Please try again later.");
            }
            console.error("Error adding labour process:", error);
        }
    }

    return (
        <>
            {/* <h1>Labour process</h1> */}
            <div className={styles.labour}>
                <h1>Labour Process</h1>
                <div>
                    <input
                        type="radio"
                        name="LType"
                        id="PerPiece"
                        value="P"
                        checked={labourData.LType === "P"}
                        onChange={handleLabourProcessChange}
                    />
                    <label htmlFor="PerPiece">Per Piece</label>

                    <input
                        type="radio"
                        name="LType"
                        id="weight"
                        value="W"
                        checked={labourData.LType === "W"}
                        onChange={handleLabourProcessChange}
                    />
                    <label htmlFor="weight">Weight</label>

                    <input
                        type="radio"
                        name="LType"
                        id="lessWeight"
                        value="L"
                        checked={labourData.LType === "L"}
                        onChange={handleLabourProcessChange}
                    />
                    <label htmlFor="lessWeight">Less Weight</label>

                    <input
                        type="radio"
                        name="LType"
                        id="polishWeight"
                        value="O"
                        checked={labourData.LType === "O"}
                        onChange={handleLabourProcessChange}
                    />
                    <label htmlFor="polishWeight">Polish Weight</label>

                    <input
                        type="radio"
                        name="LType"
                        id="Sawing"
                        value="S"
                        checked={labourData.LType === "S"}
                        onChange={handleLabourProcessChange}
                    />
                    <label htmlFor="Sawing">Sawing</label>
                </div>

                <form action="" onSubmit={submitLabourProcess}>
                    <table border="1" className={styles.labourTable}>
                        <thead>
                            <tr>
                                <td>
                                    <input type="number" name='srNo' value={labourData.srNo} onChange={handleLabourProcessChange} />
                                </td>
                                <td colSpan={2}>
                                    <select style={{ width: "120px" }} name="Process" id="process" value={labourData.Process} onChange={handleLabourProcessChange}>
                                        <option value="">Process</option>
                                        {
                                            processData.map((p) => (
                                                <option key={p.SEQ} value={p.PROCESS}>{p.PROCESS}</option>
                                            ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <select name="Type" id="" value={labourData.Type} onChange={handleLabourProcessChange} >
                                        <option value="">Type</option>
                                        <option value="real">Real</option>
                                        <option value="CVD">CVD</option>
                                    </select>
                                </td>
                                <td>
                                    <select name="Shape" value={labourData.Shape} onChange={handleLabourProcessChange}>
                                        <option value="">Shape</option>
                                        {
                                            shapeData.map((shape) => (
                                                <option key={shape.SID} value={shape.SHAPE}>{shape.SHAPE}</option>
                                            ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <select name="Cut" value={labourData.Cut} onChange={handleLabourProcessChange}>
                                        <option value="">Cut</option>
                                        {
                                            cutData.map((cut) => (
                                                <option key={cut.CID} value={cut.CUT}>{cut.CUT}</option>
                                            ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <select name="Pol" value={labourData.Pol} onChange={handleLabourProcessChange}>
                                        <option value="">Pol</option>
                                        {
                                            cutData.map((cut) => (
                                                <option key={cut.CID} value={cut.CUT}>{cut.CUT}</option>
                                            ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <select name="Sym" value={labourData.Sym} onChange={handleLabourProcessChange}>
                                        <option value="">Sym</option>
                                        {
                                            cutData.map((cut) => (
                                                <option key={cut.CID} value={cut.CUT}>{cut.CUT}</option>
                                            ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <input type="number" name='FromSize' value={labourData.FromSize} onChange={handleLabourProcessChange} />
                                </td>
                                <td>
                                    <input type="number" name='ToSize' value={labourData.ToSize} onChange={handleLabourProcessChange} />
                                </td>
                                <td>
                                    <input type="number" name='Rate' value={labourData.Rate} onChange={handleLabourProcessChange} />
                                </td>
                                <td className={styles.submitCol}>
                                    <input type="submit" />
                                </td>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th>Srno</th>
                                <th>Process</th>
                                <th>Proc</th>
                                <th>Type</th>
                                <th>Shape</th>
                                <th>Cut</th>
                                <th>Pol</th>
                                <th>Sym</th>
                                <th>From Size</th>
                                <th>To Size</th>
                                <th>Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                labourProcess.map((Data, index) => (
                                    <tr key={index}>
                                        <td>{Data.SRNO}</td>
                                        <td>{Data.PROCESS}</td>
                                        <td>{Data.LTYPE}</td>
                                        <td>{Data.TYPE}</td>
                                        <td>{Data.SHAPE}</td>
                                        <td>{Data.CUT}</td>
                                        <td>{Data.POL}</td>
                                        <td>{Data.SYM}</td>
                                        <td>{Data.FSIZE}</td>
                                        <td>{Data.TSIZE}</td>
                                        <td>{Data.RATE}</td>
                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>
                </form>
            </div>
        </>
    )
}

export default LabourProcess
