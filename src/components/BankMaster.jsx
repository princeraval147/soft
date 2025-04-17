import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import '../Styles/BankMaster.css';

const BankMaster = () => {
  const [bankData, setBankData] = useState({
    IFSC: '',
    BankName: '',
    Address: ''
  });

  const [banks, setBanks] = useState([]);

  const handleChange = (e) => {
    setBankData({
      ...bankData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios.post("http://localhost:3002/api/add-bank", bankData);
      alert("Bank saved successfully!");
      setBankData(res.data);
      fetchBanks();
    } catch (error) {
      console.error("Error saving bank:", error);
      alert("Failed to save bank.");
    }
  };

  const fetchBanks = async () => {
    try {
      const res = await Axios.get("http://localhost:3002/api/banks");
      setBanks(res.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  return (
    <div className="bankContainer">
      <h2>Bank Master</h2>
      <form onSubmit={handleSubmit} className="bankForm">
        <div className="formGroup">
          <label htmlFor="IFSC">IFSC Code:</label>
          <input type="text" id="IFSC" name="IFSC" value={bankData.IFSC} onChange={handleChange} required />
        </div>
        <div className="formGroup">
          <label htmlFor="BankName">Bank Name:</label>
          <input type="text" id="BankName" name="BankName" value={bankData.BankName} onChange={handleChange} required />
        </div>
        <div className="formGroup">
          <label htmlFor="Address">Address:</label>
          <input type="text" id="Address" name="Address" value={bankData.Address} onChange={handleChange} required />
        </div>
        <button type="submit" className="saveBankBtn">Save</button>
      </form>
      <table border="1" className="bankTable">
        <thead>
          <tr>
            <th>IFSC</th>
            <th>Bank Name</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank, index) => (
            <tr key={index}>
              <td>{bank.IFSC}</td>
              <td>{bank.BANK}</td>
              <td>{bank.ADDRESS}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankMaster;
