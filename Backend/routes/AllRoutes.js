const express = require('express');
const db = require('../config/db');
const router = express.Router();
const {
    DailyStock,
    getProcess,
    getShape,
    getColor,
    getClarity,
    getCut,
    getFL,
    addParty,
    addLabour,
    showLabour,
    addEmp,
    showEmp,
    getManager,
    addEmpProcess,
    getEmpProcess,
    updateEmp,
    updateEmpProcess,
    deleteEmp,
    addBank,
    showBank,
    getBankDetailsByIFSC,
    updateParty,
    deleteParty,
    parties,
    addLabourProcess,
    showLabourProcess,
    addRough,
    rough,
    addPacket,
    Packets,
    deletePacket,
    getKapan,
    getNextBarcode,
    AllPackets,
    getEmpManager,
    addIssue,
    getIssue,
    getReturn,
    getEmpByProcess,
    getPartyByProcess,
    updateIssueReturn,
    printBarcode
} = require('../controller/AllController');



// GLobal Routes
router.get("/api/process", getProcess);
router.get("/api/shape", getShape);
router.get("/api/cut", getCut);
router.get("/api/color", getColor);
router.get("/api/clarity", getClarity);
router.get("/api/fl", getFL);

//  Party Master
router.post("/api/add-party", addParty);
router.put("/api/update/:name", updateParty);
router.delete("/api/delete/:name", deleteParty);
router.get("/api/parties", parties);

// Fetch Data from Daily Stock 
router.get("/api/dailyStock", DailyStock);

//  labour
router.post("/api/labour", addLabour);
router.get("/api/show-labour", showLabour);

// Emp Master
router.post("/api/add-emp", addEmp);
router.get("/api/show-emp", showEmp);
router.get("/api/manager", getManager);
router.post("/api/add-empprocess", addEmpProcess);
router.get("/api/get-empprocess/:empId", getEmpProcess);
// router.put("/api/update-emp/:EmpId", updateEmp);
// router.put("/api/update-empprocess", updateEmpProcess);
router.delete("/api/delete-emp/:EmpId", deleteEmp);

//  Bank
router.post("/api/add-bank", addBank);
router.get("/api/banks", showBank);
router.get("/api/bank/:ifsc", getBankDetailsByIFSC);

// Labour Process
router.post("/api/add-labourprocess", addLabourProcess);
router.get("/api/labourprocess", showLabourProcess);

//  Rough
router.post("/api/add-rough", addRough);
router.get("/api/rough", rough);

// Packet Creation
router.post("/api/add-packet", addPacket);
router.get("/api/rough/:kapan", getKapan);
router.get("/api/packet", AllPackets);
router.get("/api/packet/:kapan", Packets);
router.get("/api/max-barcode", getNextBarcode);
router.delete("/api/delete-packet/:packetId", deletePacket);

//  Issue / Return
router.get("/api/emp/manager", getEmpManager);
router.post("/api/add/issue", addIssue);
router.get("/api/get/issue", getIssue);
router.get("/api/get/return", getReturn);
router.post("/api/empbyprocess", getEmpByProcess);
router.post("/api/partybyprocess", getPartyByProcess);

//  Barcode
router.post("/api/print-label", printBarcode);

//issue return
router.put("/api/update-issue", (req, res) => {
    const { barcode, rwgt, remark } = req.body;
    const sql = "UPDATE rissue SET RWGT = ?, REMARK = ? WHERE BARCODE = ?";
    db.query(sql, [rwgt, remark, barcode], (err, result) => {
        if (err) return res.status(500).send("Update failed");
        res.send("Updated successfully");
    });
});

// Route to update employee
router.put("/api/update-emp/:EmpId", (req, res) => {
    const { EmpId } = req.params;
    const { Name, Address, Address2, Mobile, Salary, Manager, ManagerId, AccountNo, IFSC, BankName, Branch } = req.body;

    const sql = `
        UPDATE EMP SET
            ENAME = ?, ADD1 = ?, ADD2 = ?, MOBILE = ?, SALARY = ?,
            MANAGER = ?, MID = ?, ACCOUNTNO = ?, IFSC = ?, BANK = ?, BRANCH = ?
        WHERE EMPID = ?`;

    const values = [Name, Address, Address2, Mobile, Salary, Manager, ManagerId, AccountNo, IFSC, BankName, Branch, EmpId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating employee:", err);
            return res.status(500).json({ error: "Failed to update employee" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No matching employee found" });
        }
        res.json({ message: "Employee updated successfully!" });
    });
});

// // Route to update employee processes
router.put("/api/update-empprocess", (req, res) => {
    const { EmpId, Process } = req.body;

    // Delete existing processes
    db.query("DELETE FROM EMPPROCESS WHERE EMPID = ?", [EmpId], (err) => {
        if (err) {
            console.error("Error deleting existing processes:", err);
            return res.status(500).json({ error: "Failed to delete existing processes" });
        }

        // Insert new ones if any
        if (Process && Process.length > 0) {
            const values = Process.map(p => [EmpId, p]);
            db.query("INSERT INTO EMPPROCESS (EMPID, PROCESS) VALUES ?", [values], (err) => {
                if (err) {
                    console.error("Error inserting processes:", err);
                    return res.status(500).json({ error: "Failed to insert processes" });
                }
                res.json({ message: "Employee processes updated successfully!" });
            });
        } else {
            res.json({ message: "No processes to update for employee" });
        }
    });
});

module.exports = router;