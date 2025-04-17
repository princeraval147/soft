import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import '../Styles/EmpMaster.css';

const EmpMaster = () => {

    const [showEmp, setShowEmp] = useState([]);
    const [manager, setManager] = useState([]);
    const [processData, setProcessData] = useState([]);
    const [selectedProcesses, setSelectedProcesses] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [empData, setEmpData] = useState({
        EmpId: '',
        Name: '',
        Add: '',
        Add2: '',
        Mobile: '',
        Salary: '',
        Manager: false,
        ManagerId: '',
        AccountNo: '',
        IFSC: '',
        BankName: '',
        Branch: ''
    });




    // const handleEmpChange = (e) => {
    //     setEmpData({ ...empData, [e.target.name]: e.target.value });
    //}
    const handleEmpChange = (e) => {
        setEmpData({
            ...empData,
            [e.target.name]: e.target.value
        });
    };


    const handleCheckboxChange = (e) => {
        setEmpData({ ...empData, Manager: e.target.checked });
    };

    const handleProcessChange = (e, processName) => {
        let updatedProcesses;
        if (e.target.checked) {
            updatedProcesses = [...selectedProcesses, processName];
        } else {
            updatedProcesses = selectedProcesses.filter(p => p !== processName);
        }
        setSelectedProcesses(updatedProcesses);
        setCheckAll(updatedProcesses.length === processData.length);
    };


    const handleCheckAllChange = (e) => {
        const isChecked = e.target.checked;
        setCheckAll(isChecked);
        if (isChecked) {
            const allProcesses = processData.map(p => p.PROCESS);
            setSelectedProcesses(allProcesses);
        } else {
            setSelectedProcesses([]);
        }
    };




    const SaveEmpData = async (e) => {
        e.preventDefault();

        const data = {
            EmpId: empData.EmpId,
            Name: empData.Name,
            Address: empData.Add,
            Address2: empData.Add2,
            Mobile: empData.Mobile,
            Salary: empData.Salary,
            Manager: empData.Manager ? "Y" : "N",
            ManagerId: empData.Manager ? empData.EmpId : empData.ManagerId,
            AccountNo: empData.AccountNo,
            IFSC: empData.IFSC,
            BankName: empData.BankName,
            Branch: empData.Branch
        };

        const processData = {
            EmpId: empData.EmpId,
            Process: selectedProcesses
        };

        try {
            const response = await Axios.post('http://localhost:3002/api/add-emp', data);
            console.log('Employee data saved successfully:', response.data);

            if (response.data.error) {
                alert(response.data.error);
                return; // Stop if there's an error like duplicate EmpId
            }

            // Save Processes (if any)
            if (selectedProcesses.length > 0) {
                const processResponse = await Axios.post('http://localhost:3002/api/add-empprocess', processData);
                console.log('Processes saved:', processResponse.data);
            }

            alert(response.data.message || 'Employee data saved successfully!');

            // Clear form
            setEmpData({
                EmpId: '',
                Name: '',
                Add: '',
                Add2: '',
                Mobile: '',
                Salary: '',
                Manager: false,
                ManagerId: '',
                AccountNo: '',
                IFSC: '',
                BankName: '',
                Branch: ''
            });
            setSelectedProcesses([]);
            setCheckAll(false);

            // Refresh data
            fetchEmpData();
            fetchManager();

        } catch (error) {
            console.error('Error saving employee data:', error);
            if (error.response) {
                alert(error.response.data.error || "Server error occurred.");
            } else if (error.request) {
                alert("No response from server.");
            } else {
                alert("Error: " + error.message);
            }
        }
    };


    const updateEmpData = async () => {
        const data = {
            EmpId: empData.EmpId,
            Name: empData.Name,
            Address: empData.Add,
            Address2: empData.Add2,
            Mobile: empData.Mobile,
            Salary: empData.Salary,
            Manager: empData.Manager ? "Y" : "N",
            ManagerId: empData.Manager ? empData.EmpId : empData.ManagerId,
            AccountNo: empData.AccountNo,
            IFSC: empData.IFSC,
            BankName: empData.BankName,
            Branch: empData.Branch
        };

        const processData = {
            EmpId: empData.EmpId,
            Process: selectedProcesses
        };

        try {
            const res = await Axios.put(`http://localhost:3002/api/update-emp/${empData.EmpId}`, data);
            if (res.data.error) {
                alert(res.data.error);  // If there is an error, show the message
                return;
            }

            console.log("Employee updated:", res.data);
            alert("Employee data updated!");

            // Update processes
            await Axios.put("http://localhost:3002/api/update-empprocess", processData);
            console.log("Processes updated successfully.");

            fetchEmpData();
            fetchManager();

            // Clear form
            setEmpData({
                EmpId: '',
                Name: '',
                Add: '',
                Add2: '',
                Mobile: '',
                Salary: '',
                Manager: false,
                ManagerId: '',
                AccountNo: '',
                IFSC: '',
                BankName: '',
                Branch: ''
            });
            setSelectedProcesses([]);
            setCheckAll(false);
        } catch (err) {
            console.error("Error updating employee:", err);
            alert("Failed to update employee.");
        }
    };


    // Function to delete an employee
    const deleteEmpData = async (EmpId) => {
        console.log("Id = ", EmpId);
        const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
        if (confirmDelete) {
            try {
                const response = await Axios.delete(`http://localhost:3002/api/delete-emp/${EmpId}`);
                console.log("Employee deleted:", response.data);
                fetchEmpData();
                alert("Employee deleted successfully!");
            } catch (error) {
                console.error("Error deleting employee:", error);
                alert("Failed to delete employee.");
            }
        }
    }


    const handleRowClick = (emp) => {
        // Set emp data with the selected employee's details
        setEmpData({
            EmpId: emp.EMPID,
            Name: emp.ENAME,
            Add: emp.ADDRESS || '',
            Add2: emp.ADDRESS2 || '',
            Mobile: emp.MOBILE || '',
            Salary: emp.SALARY || '',
            Manager: emp.MANAGER === "Y", // Check if the employee is a manager
            ManagerId: emp.MANAGERID || '', // This is the MID of Rahul's manager (e.g., 102)
            AccountNo: emp.ACCOUNTNO || '',
            IFSC: emp.IFSC || '',
            BankName: emp.BANK || '',
            Branch: emp.BRANCH || ''
        });

        // Fetch processes for the selected employee
        Axios.get(`http://localhost:3002/api/get-empprocess/${emp.EMPID}`)
            .then(res => {
                const processes = res.data.map(p => p.PROCESS);
                setSelectedProcesses(processes);
                setCheckAll(processes.length === processData.length);
            })
            .catch(err => {
                console.error("Error fetching emp processes:", err);
                setSelectedProcesses([]);
                setCheckAll(false);
            });

        // Optional: Check if the manager exists in the manager list and preselect it in the dropdown
        const selectedManager = manager.find(m => m.MID === emp.MANAGERID);
        if (selectedManager) {
            setEmpData(prevData => ({
                ...prevData,
                ManagerId: selectedManager.MID // Set the manager's ID in empData for dropdown selection
            }));
        }
    };

    const handleIFSCBlur = async () => {
        try {
            const response = await fetch(`http://localhost:3002/api/bank/${empData.IFSC}`);
            const data = await response.json();
            if (data && data.BankName && data.Branch) {
                setEmpData(prev => ({
                    ...prev,
                    BankName: data.BankName,
                    Branch: data.Branch,
                }));
            }
        } catch (error) {
            console.error("Error fetching bank details:", error);
        }
    };



    const fetchBankDetails = async () => {
        if (empData.IFSC.trim().length === 11) { // typical IFSC length
            try {
                const res = await Axios.get(`http://localhost:3002/api/bank/${empData.IFSC}`);
                setEmpData(prev => ({
                    ...prev,
                    BankName: res.data.BankName,
                    Branch: res.data.Branch
                }));
            } catch (err) {
                console.error("IFSC fetch error:", err);
            }
        }
    }
    const fetchEmpData = async () => {
        try {
            const response = await Axios.get("http://localhost:3002/api/show-emp");
            setShowEmp(response.data);
        } catch (error) {
            console.error("Error while fetching EMP data:", error);
        }
    }
    const fetchManager = async () => {
        try {
            const response = await Axios.get("http://localhost:3002/api/manager");
            setManager(response.data);
        } catch (error) {
            console.error("Error while Fetching Manager");
        }
    }
    const fetchProcess = async () => {
        try {
            const response = await Axios.get("http://localhost:3002/api/process");
            setProcessData(response.data);
        } catch (error) {
            console.error("Error while fetch Process");
        }
    }
    useEffect(() => {
        fetchEmpData();
        fetchManager();
        fetchProcess();
        fetchBankDetails();
    }, []);

    return (
        <div className="empContainer">
            <h2>Employee Master</h2>
            <form className="empForm" onSubmit={SaveEmpData}>
                <div className="row">
                    <label htmlFor="EmpId" >Emp Id:</label>
                    <input type="number" id="EmpId" className="idInput" name="EmpId" value={empData.EmpId} onChange={handleEmpChange} required />
                    <span>
                        <input
                            type="checkbox"
                            id="manager"
                            checked={empData.Manager}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="manager">Manager</label>

                    </span>
                    <span>
                        <div className="managerGroup">
                            <label htmlFor="Mid">Manager Id: </label>
                            <input
                                type="text"
                                id="Mid"
                                name="ManagerId"
                                className="idInput"
                                value={empData.ManagerId}  // This will show the MID (e.g., 102)
                                onChange={handleEmpChange}  // This allows editing the ManagerId
                            />
                            <select
                                id="ManagerSelect"
                                className="managerSelect"
                                name="ManagerId"
                                value={empData.ManagerId}  // This binds the dropdown value to ManagerId
                                onChange={handleEmpChange}  // Updates empData when selecting a manager
                            >
                                <option value="">Select Manager</option>
                                {manager.map((m, index) => (
                                    <option key={index} value={m.MID}>
                                        {m.ENAME}
                                    </option>
                                ))}
                            </select>
                        </div>



                    </span>
                </div>

                <div className="row">
                    <label htmlFor="Name">Name:</label>
                    <input type="text" id="Name" name="Name" value={empData.Name} onChange={handleEmpChange} required />
                </div>

                <div className="row">
                    <label htmlFor="Address">Address:</label>
                    <input type="text" id="Address" placeholder="Address Line 1" name="Add" value={empData.Add} onChange={handleEmpChange} />
                    <input type="text" id="Address2" placeholder="Address Line 2" name="Add2" value={empData.Add2} onChange={handleEmpChange} />
                </div>

                <div className="row">
                    <label htmlFor="Mobile">Mobile:</label>
                    <input type="number" id="Mobile" name="Mobile" value={empData.Mobile} onChange={handleEmpChange} />
                    <label htmlFor="Salary">Salary:</label>
                    <input type="number" id="Salary" name="Salary" value={empData.Salary} onChange={handleEmpChange} />
                </div>


                <div className="fieldset">
                    <fieldset className="bankDetails">
                        <legend>Bank Details</legend>

                        <div className="row">
                            <label htmlFor="No">Account No:</label>
                            <input type="text" id="No" name="AccountNo" value={empData.AccountNo} onChange={handleEmpChange} />
                        </div>
                        <div className="row">
                            <label htmlFor="IFSC">IFSC Code:</label>
                            {/* <input type="text" id="IFSC" name="IFSC" value={empData.IFSC} onChange={handleEmpChange} /> */}
                            <input
                                type="text"
                                id="IFSC"
                                name="IFSC"
                                value={empData.IFSC}
                                onChange={handleEmpChange}
                                onBlur={handleIFSCBlur}
                            />

                        </div>
                        <div className="row">
                            <label htmlFor="Bank">Bank Name:</label>
                            <input type="text" id="Bank" name="BankName" value={empData.BankName} onChange={handleEmpChange} />
                        </div>
                        <div className="row">
                            <label htmlFor="Branch">Branch:</label>
                            <input type="text" id="Branch" name="Branch" value={empData.Branch} onChange={handleEmpChange} />
                        </div>
                    </fieldset>

                    {/* <fieldset>
                    <legend>Process</legend>
                    {
                        processData.map((p, index) => (
                            <div key={index + 1}>
                                <input type="checkbox" />
                                <label htmlFor="">{p.PROCESS}</label>
                            </div>
                        ))
                    }
                </fieldset> */}

                    <fieldset className='process'>
                        <legend>Process</legend>
                        <input
                            type="checkbox"
                            id='checkAll'
                            checked={checkAll}
                            onChange={handleCheckAllChange}
                        />
                        <b>
                            <label htmlFor="checkAll">Check All</label>
                        </b>
                        {
                            processData.map((p, index) => (
                                <div key={index + 1}>
                                    <input
                                        type="checkbox"
                                        id={`process-${index}`}
                                        checked={selectedProcesses.includes(p.PROCESS)}
                                        onChange={(e) => handleProcessChange(e, p.PROCESS)}
                                    />
                                    <label htmlFor={`process-${index}`}>{p.PROCESS}</label>
                                </div>
                            ))
                        }
                    </fieldset>

                </div>


                <div className="buttonGroup">
                    <button type="submit" className="btn saveEmpBtn">Save</button>
                    <button type="button" onClick={updateEmpData} className="btn updateBtn">Update</button>
                    <button type="button" onClick={() => deleteEmpData(empData.EmpId)} className="btn deleteBtn">Delete</button>
                </div>
            </form >

            <br /><br /><br />
            <table border="1" className='empTable'>
                <thead>
                    <tr>
                        <th>Emp Id</th>
                        <th>Manager</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        showEmp.map((emp, index) => (
                            <tr key={index + 1} onClick={() => handleRowClick(emp)} style={{ cursor: 'pointer' }}>
                                <td>{emp.EMPID}</td>
                                <td>{emp.MANAGER}</td>
                                <td>{emp.ENAME}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </div >
    );
};

export default EmpMaster;
