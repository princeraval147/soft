import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import styles from '../Styles/Rough.module.css';
import MuiTable from './MuiTable';
import { NavLink } from 'react-router-dom';

const Rough = () => {
    const [parties, setParties] = useState([]);
    const [rough, setRough] = useState([]);
    const [roughData, setRoughData] = useState({
        srNo: '',
        Kapan: '',
        Party: '',
        IDate: '',
        Pcs: '',
        Weight: '',
        Size: '',
        Type: '',
        Cmpl: 'N',
        Remark: ''
    });

    const fetchParty = () => {
        Axios.get('http://localhost:3002/api/parties')
            .then((response) => setParties(response.data))
            .catch((error) => console.error('Error fetching Party:', error));
    };

    const fetchRough = () => {
        Axios.get('http://localhost:3002/api/rough')
            .then((response) => setRough(response.data))
            .catch((error) => console.error('Error fetching Rough data:', error));
    };

    useEffect(() => {
        fetchParty();
        fetchRough();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRoughData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 'Y' : 'N') : value
        }));
    };

    // const formatDateTime = (datetime) => {
    //     const pad = (n) => (n < 10 ? '0' + n : n);

    //     const date = new Date(datetime);
    //     const year = date.getFullYear();
    //     const month = pad(date.getMonth() + 1);
    //     const day = pad(date.getDate());
    //     const hours = pad(date.getHours());
    //     const minutes = pad(date.getMinutes());
    //     const seconds = pad(date.getSeconds());

    //     return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`; // SQL-friendly format
    // };

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        if (isNaN(date.getTime())) return ''; // ⛔ safeguard
        const pad = (n) => (n < 10 ? '0' + n : n);
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const formatDateForDisplay = (datetime) => {
        const date = new Date(datetime);
        if (isNaN(date.getTime())) return '';
        const pad = (n) => (n < 10 ? '0' + n : n);
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };



    const handleRough = async (e) => {
        e.preventDefault();
        const now = new Date();
        const formattedDate = formatDateTime(now); // ✔️ now outputs '2025-04-15 13:47:21'
        const dataToSend = {
            ...roughData,
            IDate: formattedDate // Set current date and time here
        };
        try {
            await Axios.post('http://localhost:3002/api/add-rough', dataToSend);
            alert('Rough inserted successfully!');
            fetchRough(); // Refresh table
            setRoughData({
                srNo: '',
                Kapan: '',
                Party: '',
                IDate: '',
                Pcs: '',
                Weight: '',
                Size: '',
                Type: '',
                Cmpl: 'N',
                Remark: ''
            });
        } catch (error) {
            console.error('Error while inserting into rough:', error);
            alert('Error! Please Try Again');
        }
    };



    return (
        <>
            <h1>Rough Entry</h1>
            <NavLink to='/packet'>Packet Creation</NavLink>
            <br /><br /><br />
            <form className={styles.roughForm} onSubmit={handleRough}>
                <div className={styles.formRow}>
                    <label>
                        Kapan:
                        <input
                            required
                            type="text"
                            name="Kapan"
                            placeholder="Kapan"
                            value={roughData.Kapan}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Party:
                        <select name="Party" value={roughData.Party} onChange={handleChange}>
                            <option value="">Select Party</option>
                            {parties.map((party, index) => (
                                <option key={index} value={party.PARTY}>
                                    {party.PARTY}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Pcs:
                        <input
                            type="number"
                            name="Pcs"
                            placeholder="Pcs"
                            value={roughData.Pcs}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Weight:
                        <input
                            type="number"
                            name="Weight"
                            placeholder="Weight"
                            value={roughData.Weight}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Size:
                        <input
                            type="text"
                            name="Size"
                            placeholder="Size"
                            value={roughData.Size}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Type:
                        <select name="Type" value={roughData.Type} onChange={handleChange}>
                            <option value="">Select Type</option>
                            <option value="Real">Real</option>
                            <option value="CVD">CVD</option>
                        </select>
                    </label>

                    <label className={styles.checkboxLabel}>
                        Completed:
                        <input
                            type="checkbox"
                            name="Cmpl"
                            checked={roughData.Cmpl === 'Y'}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Remark:
                        <input
                            type="text"
                            name="Remark"
                            placeholder="Remark"
                            value={roughData.Remark}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <button type="submit" className={styles.submitBtn}>Submit</button>
            </form>

            <hr />

            <h2>Rough Records</h2>
            <table className={styles.roughTable}>
                <thead>
                    <tr>
                        <th>Kapan</th>
                        <th>Party</th>
                        <th>Inward Date</th>
                        <th>Pcs</th>
                        <th>Weight</th>
                        <th>Size</th>
                        <th>Type</th>
                        <th>Cmp</th>
                        <th>Remark</th>
                    </tr>
                </thead>
                <tbody>
                    {rough.map((data, index) => (
                        <tr key={index}>
                            <td>{data.ID}</td>
                            <td>{data.PARTY}</td>
                            <td>{formatDateForDisplay(data.IDATE)}</td>
                            <td>{data.PCS}</td>
                            <td>{parseFloat(data.WEIGHT).toFixed(2)}</td>
                            <td>{data.SIZE}</td>
                            <td>{data.TYPE}</td>
                            <td>{data.CMPL}</td>
                            <td>{data.REMARK}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Rough;
