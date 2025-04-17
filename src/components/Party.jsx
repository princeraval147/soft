import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import styles from '../Styles/Party.module.css'

const Party = () => {

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        contactPerson: "",
        contactNumber: "",
        gst: ""
    });
    const [labourData, setLabourData] = useState({
        srNo: "",
        Party: "",
        LType: "",
        Process: "",
        Type: "",
        Shape: "",
        Cut: "",
        From: "",
        To: "",
        Rate: ""
    });


    const [parties, setParties] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [labourDisplay, setLabourDisplay] = useState([]);

    // Fetch data from backend
    const fetchParty = () => {
        Axios.get("http://localhost:3002/api/parties")
            .then((response) => {
                setParties(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }
    useEffect(() => {
        fetchParty();
    }, []);

    // DropDown Data
    const [processData, setProcessData] = useState([]);
    const [shapeData, setShapeData] = useState([]);
    const [cutData, setCutData] = useState([]);

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
    }, []);

    const fetchLabourData = () => {
        Axios.get("http://localhost:3002/api/show-labour")
            .then((response) => {
                setLabourDisplay(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }
    useEffect(() => {
        fetchLabourData();
    }, []);

    //  Update Data
    const handleEdit = (party) => {
        setFormData({
            name: party.PARTY, // Keep name fixed
            address: party.ADDRESS,
            contactPerson: party.CONTACT,
            contactNumber: party.MOBILE,
            gst: party.GST,
        });
        setIsEditing(true);
    };

    //  Delete
    const handleDelete = (name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            Axios.delete(`http://localhost:3002/api/delete/${name}`)
                .then(() => {
                    alert("Data deleted successfully!");
                    fetchParty();
                })
                .catch((error) => {
                    console.error("Error deleting data:", error);
                });
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Update
        if (isEditing) {
            Axios.put(`http://localhost:3002/api/update/${formData.name}`, formData)
                .then((response) => {
                    alert(response.data.message);
                    // alert("Record updated successfully!");
                    fetchParty();
                    setIsEditing(false);
                    setFormData({ name: "", address: "", contactPerson: "", contactNumber: "", gst: "" }); // Reset form
                })
                .catch((error) => {
                    console.error("Error updating record:", error);
                    alert("Failed to update record!");
                });

        } else {
            //  Insert
            Axios.post("http://localhost:3002/api/add-party", formData)
                .then(() => {
                    alert("Party added successfully!");
                    fetchParty();
                    setFormData({ name: "", address: "", contactPerson: "", contactNumber: "", gst: "" }); // Reset form
                });
        }
    };

    // const handleLabourChange = (e) => {
    //     const { name, value } = e.target;
    //     if (name === "labour") {
    //         setLabourData(prev => ({ ...prev, LType: value }));
    //     } else {
    //         setLabourData(prev => ({ ...prev, [name]: value }));
    //     }
    // };
    const handleLabourChange = (e) => {
        const { name, value } = e.target;
        setLabourData(prev => ({ ...prev, [name]: value }));
    };



    const handleLabour = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:3002/api/labour", labourData)
            .then(() => {
                alert("Labour data added successfully!");
                fetchLabourData();
                // Clear labour form
                setLabourData({
                    Process: "",
                    LType: "",
                    Type: "",
                    Shape: "",
                    Cut: "",
                    From: "",
                    To: "",
                    Rate: ""
                });
            })
            .catch((error) => {
                console.error("Error adding labour data:", error);
                alert("Failed to add labour data.");
            });
    };

    useEffect(() => {
        setLabourData(prev => ({
            ...prev,
            Party: formData.name // Sync party name
        }));
    }, [formData.name]);


    return (
        <>
            <div className={styles.formContainer}>
                <h2>Party Information</h2>
                <form className={styles.partyForm} onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td><label htmlFor="name">Party Name:</label></td>
                                <td><input type="text" name="name" value={formData.name} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="address">Address:</label></td>
                                <td><input type="text" name="address" value={formData.address} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="contactPerson">Contact Person:</label></td>
                                <td><input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="contactNumber">Contact Number:</label></td>
                                <td><input type="number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="gst">GST:</label></td>
                                <td><input type="text" name="gst" value={formData.gst} onChange={handleChange} required /></td>
                            </tr>
                            <tr>
                                <td colSpan="2" className={styles.submitRow}>
                                    <button type="submit" className={styles.submitBtn}>Save</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>

            <div className={styles.secondPart}>
                <span>
                    <h2>Party List</h2>
                    <table border="1" className={styles.partyData}>
                        <thead>
                            <tr>
                                {/* <th>ID</th> */}
                                <th>Name</th>
                                <th>Address</th>
                                <th>Contact Person</th>
                                <th>Contact Number</th>
                                <th>GST</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                parties.map((party, index) => (
                                    <tr key={index + 1}>
                                        <td align='center'>{party.PARTY}</td>
                                        <td align='center'>{party.ADDRESS}</td>
                                        <td align='center'>{party.CONTACT}</td>
                                        <td align='center'>{party.MOBILE}</td>
                                        <td align='center'>{party.GST}</td>
                                        <td align='center'>
                                            <button onClick={() => handleEdit(party)} className={styles.editBtn}>Edit</button>
                                        </td>
                                        <td align='center'>
                                            <button onClick={() => handleDelete(party.PARTY)} className={styles.editBtn}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </span>

                <div className={styles.labour}>
                    <h1>Labour</h1>
                    <div>
                        <input
                            type="radio"
                            name="LType"
                            id="PerPiece"
                            value="P"
                            checked={labourData.LType === "P"}
                            onChange={handleLabourChange}
                        />
                        <label htmlFor="PerPiece">Per Piece</label>

                        <input
                            type="radio"
                            name="LType"
                            id="weight"
                            value="W"
                            checked={labourData.LType === "W"}
                            onChange={handleLabourChange}
                        />
                        <label htmlFor="weight">Weight</label>

                        <input
                            type="radio"
                            name="LType"
                            id="lessWeight"
                            value="L"
                            checked={labourData.LType === "L"}
                            onChange={handleLabourChange}
                        />
                        <label htmlFor="lessWeight">Less Weight</label>

                        <input
                            type="radio"
                            name="LType"
                            id="polishWeight"
                            value="O"
                            checked={labourData.LType === "O"}
                            onChange={handleLabourChange}
                        />
                        <label htmlFor="polishWeight">Polish Weight</label>

                        <input
                            type="radio"
                            name="LType"
                            id="Sawing"
                            value="S"
                            checked={labourData.LType === "S"}
                            onChange={handleLabourChange}
                        />
                        <label htmlFor="Sawing">Sawing</label>
                    </div>

                    <form action="" onSubmit={handleLabour}>
                        <table border="1" className={styles.labourTable}>
                            <thead>
                                <tr>
                                    <td>
                                        <input type="text" name='srNo' value={labourData.srNo || ''} onChange={handleLabourChange} />
                                    </td>
                                    <td>
                                        <select name="Process" id="process" value={labourData.Process} onChange={handleLabourChange}>
                                            <option value="">Process</option>
                                            {
                                                processData.map((p) => (
                                                    <option key={p.SEQ} value={p.PROCESS}>{p.PROCESS}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                    <td>
                                        <select name="Type" id="" value={labourData.Type} onChange={handleLabourChange}>
                                            <option value="" disabled>Type</option>
                                            <option value="real">Real</option>
                                            <option value="CVD">CVD</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select name="Shape" value={labourData.Shape} onChange={handleLabourChange}>
                                            <option value="">Shape</option>
                                            {
                                                shapeData.map((shape) => (
                                                    <option key={shape.SID} value={shape.SHAPE}>{shape.SHAPE}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                    <td>
                                        <select name="Cut" value={labourData.Cut} onChange={handleLabourChange}>
                                            <option value="">Cut</option>
                                            {
                                                cutData.map((cut) => (
                                                    <option key={cut.CID} value={cut.CUT}>{cut.CUT}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text" name='From' value={labourData.From} onChange={handleLabourChange} />
                                    </td>
                                    <td>
                                        <input type="text" name='To' value={labourData.To} onChange={handleLabourChange} />
                                    </td>
                                    <td>
                                        <input type="text" name='Rate' value={labourData.Rate} onChange={handleLabourChange} />
                                    </td>
                                    <td>
                                        <input type="submit" />
                                    </td>
                                </tr>
                            </thead>
                            <thead>
                                <tr>
                                    <th>Srno</th>
                                    {/* <th>Party</th> */}
                                    {/* <th>LType</th> */}
                                    <th>Process</th>
                                    <th>Type</th>
                                    <th>Shape</th>
                                    <th>Cut</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    labourDisplay.map((Data, index) => (
                                        <tr key={index}>
                                            <td>{Data.SRNO}</td>
                                            {/* <td>{Data.PARTY}</td> */}
                                            {/* <td>{Data.LTYPE}</td> */}
                                            <td>{Data.TYPE}</td>
                                            <td>{Data.PROCESS}</td>
                                            <td>{Data.SHAPE}</td>
                                            <td>{Data.CUT}</td>
                                            <td>{Data.FROMSIZE}</td>
                                            <td>{Data.TOSIZE}</td>
                                            <td>{Data.RATE}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>

                        </table>
                    </form>
                </div>

            </div>
        </>
    )
}

export default Party
