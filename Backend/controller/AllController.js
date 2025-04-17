const db = require('../config/db');

// GLobarl
exports.getProcess = (req, res) => {
    db.query("SELECT * FROM PROCESS", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Faild to Fetch Data" });
        } else {
            res.status(200).json(result);
        }
    });
}

exports.parties = (req, res) => {
    db.query("SELECT * FROM party", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to fetch data" });
        } else {
            res.json(result); // Send data to frontend
        }
    });
}

exports.addParty = (req, res) => {
    const { name, address, contactPerson, contactNumber, gst } = req.body;
    db.query("INSERT INTO party (PARTY, ADDRESS, CONTACT, MOBILE,GST) VALUES (?,?,?,?,?)", [name, address, contactPerson, contactNumber, gst], (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log("Inserted Successfully!", result)
        res.json({ id: result.insertId, name, address, contactPerson, contactNumber, gst }); // Send back the new entry
    });
}

exports.updateParty = (req, res) => {
    const { name } = req.params;
    const { address, contactPerson, contactNumber, gst } = req.body;
    db.query("UPDATE party SET ADDRESS=?, CONTACT=?, MOBILE=?, GST=? WHERE PARTY=?",
        [address, contactPerson, contactNumber, gst, name],
        (err, result) => {
            if (err) {
                console.error("Error updating record:", err);
                return res.status(500).json({ error: "Failed to update record" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "No matching record found" });
            }
            res.json({ message: "Record updated successfully!" });
        }
    );
}

exports.deleteParty = (req, res) => {
    const { name } = req.params;
    db.query("DELETE FROM party WHERE PARTY=?", [name], (err, result) => {
        if (err) {
            console.error("Error while Delete Data ", err);
            res.status(500).json({ error: "Failed to fetch data" });
        } else {
            res.status(200).json({ message: "Record deleted successfully" });
        }
    });
}

exports.getShape = (req, res) => {
    db.query("SELECT * FROM SHAPE", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Faild to fetch Shape" });
        } else {
            res.status(200).json(result);
        }
    });
}

exports.getCut = (req, res) => {
    db.query("SELECT * FROM CUT", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Faild to fetch Shape" });
        } else {
            res.status(200).json(result);
        }
    });
}

exports.getColor = (req, res) => {
    db.query("SELECT * FROM color", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Faild to fetch Shape" });
        } else {
            res.status(200).json(result);
        }
    });
}


// Not Working
exports.DailyStock = (req, res) => {
    db.query("SELECT * FROM dailyStock", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to fetch data" });
        } else {
            // res.json(result); // Send data to frontend
            res.status(200).json(result); // Send data to frontend
        }
    });
}

exports.addLabour = (req, res) => {
    const {
        srNo,
        Party,
        LType,
        Process,
        Type,
        Shape,
        Cut,
        From,
        To,
        Rate
    } = req.body;
    const SQL = "INSERT INTO PRATE (SRNO, PARTY, LTYPE, TYPE, PROCESS, SHAPE, CUT, FROMSIZE, TOSIZE, RATE) VALUES(?,?,?,?,?,?,?,?,?,?)";
    db.query(SQL, [srNo, Party, LType, Process, Type, Shape, Cut, From, To, Rate], (err, result) => {
        if (err) {
            console.log("Error while insert into Labour", err);
            res.status(500).json({ error: "Faild to insert data" });
        } else {
            res.json({ message: "Record inserted Successfully", id: result.insertId })
        }
    });
}

exports.showLabour = (req, res) => {
    db.query("SELECT * FROM PRATE", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to fetch data" });
        } else {
            // res.json(result); // Send data to frontend
            res.status(200).json(result); // Send data to frontend
        }
    });
}

exports.addEmp = (req, res) => {
    const {
        EmpId, Name, Address, Address2, Mobile, Salary,
        Manager, ManagerId, AccountNo, IFSC, BankName, Branch
    } = req.body;

    // Step 1: Check if EmpId already exists
    const checkQuery = "SELECT * FROM EMP WHERE EMPID = ?";
    db.query(checkQuery, [EmpId], (err, result) => {
        if (err) {
            console.error("Error checking EmpId:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: "EmpId already exists!" });
        }

        // Step 2: Insert new employee
        const insertQuery = `
            INSERT INTO EMP (EMPID, ENAME, ADD1, ADD2, MOBILE, SALARY,
            MANAGER, MID, ACCOUNTNO, IFSC, BANK, BRANCH)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            EmpId, Name, Address, Address2, Mobile, Salary,
            Manager, ManagerId, AccountNo, IFSC, BankName, Branch
        ];

        db.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error("Error inserting employee:", err);
                return res.status(500).json({ error: "Failed to add employee" });
            }
            res.json({ message: "Employee added successfully!" });
        });
    });
}

exports.showEmp = (req, res) => {
    db.query("SELECT * FROM EMP", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to fetch data" });
        } else {
            // res.json(result); // Send data to frontend
            res.status(200).json(result); // Send data to frontend
        }
    });
}

exports.getManager = (req, res) => {
    db.query("SELECT * FROM EMP WHERE MANAGER = 'Y'", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to fetch data" });
        } else {
            // res.json(result); // Send data to frontend
            res.status(200).json(result); // Send data to frontend
        }
    });
}

// exports.addEmpProcess = async (req, res) => {
//     const processData = req.body; // array of objects
//     const values = processData.map(item => [item.EmpId, item.Process]);
//     const sql = "INSERT INTO EMPPROCESS (EMPID, PROCESS) VALUES ?";
//     db.query(sql, [values], (err, result) => {
//         if (err) {
//             console.error("Error inserting process:", err);
//             res.status(500).send("Failed to insert process data");
//         } else {
//             res.status(200).send("Process data inserted successfully");
//         }
//     });
// }

exports.addEmpProcess = async (req, res) => {
    const { EmpId, Process } = req.body;
    if (!EmpId || !Array.isArray(Process)) {
        return res.status(400).send("Invalid request body");
    }
    const values = Process.map(proc => [EmpId, proc]);
    const sql = "INSERT INTO empprocess (EMPID, PROCESS) VALUES ?";
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error inserting process:", err);
            res.status(500).send("Failed to insert process data");
        } else {
            res.status(200).send("Process data inserted successfully");
        }
    });
};

exports.getEmpProcess = async (req, res) => {
    const empId = req.params.empId;
    db.query("SELECT * FROM EMPPROCESS  WHERE EMPID = ?", [empId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to fetch data" });
        } else {
            // res.json(result); // Send data to frontend
            res.status(200).json(result); // Send data to frontend
        }
    });
}


// Update employee function
// exports.updateEmp = (req, res) => {
//     const {
//         EmpId, Name, Address, Address2, Mobile,
//         Salary, Manager, ManagerId,
//         AccountNo, IFSC, BankName, Branch
//     } = req.body;

//     const sql = `
//         UPDATE EMP SET
//             ENAME = ?, ADD1 = ?, ADD2 = ?, MOBILE = ?, SALARY = ?,
//             MANAGER = ?, MID = ?, ACCOUNTNO = ?, IFSC = ?, BANK = ?, BRANCH = ?
//         WHERE EMPID = ?`;

//     const values = [
//         Name, Address, Address2, Mobile, Salary,
//         Manager, ManagerId, AccountNo, IFSC, BankName, Branch, EmpId
//     ];

//     db.query(sql, values, (err, result) => {
//         if (err) {
//             console.error("Error updating employee:", err.sqlMessage || err);
//             return res.status(500).json({ error: "Failed to update employee" });
//         }

//         if (result.affectedRows === 0) {
//             // This means the EMPID does not exist in DB
//             return res.status(404).json({ error: "Employee not found for update" });
//         }

//         res.json({ message: "Employee updated successfully." });
//     });
// };



// // Update employee process function
// exports.updateEmpProcess = (req, res) => {
//     const { EmpId, Process } = req.body;

//     // Delete existing processes
//     db.query("DELETE FROM EMPPROCESS WHERE EMPID = ?", [EmpId], (err) => {
//         if (err) {
//             console.error("Error deleting existing processes:", err);
//             return res.status(500).json({ error: "Failed to delete existing processes" });
//         }

//         // Insert new ones if any
//         if (Process && Process.length > 0) {
//             const values = Process.map(p => [EmpId, p]);
//             db.query("INSERT INTO EMPPROCESS (EMPID, PROCESS) VALUES ?", [values], (err) => {
//                 if (err) {
//                     console.error("Error inserting processes:", err);
//                     return res.status(500).json({ error: "Failed to insert processes" });
//                 }
//                 res.json({ message: "Employee processes updated successfully!" });
//             });
//         } else {
//             res.json({ message: "No processes to update for employee" });
//         }
//     });
// };

// Delete employee function
exports.deleteEmp = (req, res) => {
    const { EmpId } = req.params; // Get EmpId from the URL

    // Start by deleting employee processes first
    db.query("DELETE FROM EMPPROCESS WHERE EMPID = ?", [EmpId], (err) => {
        if (err) {
            console.error("Error deleting employee processes:", err);
            return res.status(500).json({ error: "Failed to delete employee processes" });
        }

        // Now delete the employee record
        db.query("DELETE FROM EMP WHERE EMPID = ?", [EmpId], (err) => {
            if (err) {
                console.error("Error deleting employee:", err);
                return res.status(500).json({ error: "Failed to delete employee" });
            }
            res.json({ message: "Employee and processes deleted successfully!" });
        });
    });
};

exports.addBank = (req, res) => {
    const { IFSC, BankName, Address } = req.body;
    const SQL = "INSERT INTO BANK (IFSC, BANK, ADDRESS) VALUES (?,?,?);";
    db.query(SQL, [IFSC, BankName, Address], (err, result) => {
        if (err) {
            console.error("Error inserting Bank : ", err);
            return res.status(500).json({ message: "Database Error While insert Bank Data." });
        }
        return res.status(200).json({ message: "Bank Added Sucessfully", bankId: result.insertId });
    });
}

exports.showBank = (req, res) => {
    db.query("SELECT * FROM bank", (err, result) => {
        if (err) {
            console.error("Error while fetch Bankss");
            return res.status(500).json({ message: "Database Error While fetch Banks" });
        }
        res.status(200).json(result);
    });
}

// In your controller or route
exports.getBankDetailsByIFSC = (req, res) => {
    const { ifsc } = req.params;
    const SQL = "SELECT BANK, ADDRESS FROM BANK WHERE IFSC = ?";
    db.query(SQL, [ifsc], (err, result) => {
        if (err) return res.status(500).json({ error: "DB Error", err });
        if (result.length === 0) return res.status(404).json({ error: "IFSC not found" });
        res.json({
            BankName: result[0].BANK,
            Branch: result[0].ADDRESS
        });
    });
};

exports.addLabourProcess = (req, res) => {
    const { srNo,
        Process,
        Type,
        Shape,
        Cut,
        Pol,
        Sym,
        FromSize,
        ToSize,
        Rate,
        LType
    } = req.body;

    const SQL = "INSERT INTO labour (SRNO, PROCESS, TYPE, SHAPE, CUT, POL, SYM, FSIZE, TSIZE, RATE, LTYPE) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
    db.query(SQL, [srNo, Process, Type, Shape, Cut, Pol, Sym, FromSize, ToSize, Rate, LType], (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "SRNO already exists." });
            }
            console.error("Error inserting Labour Process : ", err);
            return res.status(500).json({ message: "Database Error While insert Labour Process." });
        }
        return res.status(200).json({ message: "Labour Process Added Sucessfully", LProcessId: result.insertId });
    });

}

exports.showLabourProcess = (req, res) => {
    db.query("SELECT * FROM labour", (err, result) => {
        if (err) {
            console.error("Error to Fetch Labour Process", err);
            return res.status(500).json({ message: "Error while fetch Labour Process" });
        }
        return res.status(200).json(result);
    });
}

exports.addRough = (req, res) => {
    const {
        Kapan,
        Party,
        IDate,
        Pcs,
        Weight,
        Size,
        Type,
        Cmpl,
        Remark
    } = req.body;

    const SQL = "INSERT INTO rough (ID, PARTY, IDATE, PCS, WEIGHT, SIZE, TYPE, CMPL, REMARK) VALUES(?,?,?,?,?,?,?,?,?)";

    db.query(SQL, [Kapan, Party, IDate, Pcs, Weight, Size, Type, Cmpl, Remark], (err, result) => {
        if (err) {
            console.error("Error while inserting Rough", err);
            res.status(500).json({ message: "Can't insert Data into Rough" });
        }
        res.status(200).json({ message: "Rough Added Succesfully", resultIt: result.insertId });
    });
}

exports.rough = (req, res) => {
    db.query("SELECT * FROM rough", (err, result) => {
        if (err) {
            console.error("Error to Fetch Rough Process", err);
            return res.status(500).json({ message: "Error while fetch Rough" });
        }
        return res.status(200).json(result);
    });
}

exports.addPacket = (req, res) => {
    const {
        Party,
        Kapan,
        Packet,
        Pkt,
        Carat,
        Process,
        Original,
        Color,
        Tag,
        Type,
        IDate,
        Barcode
    } = req.body;

    const SQL = "INSERT INTO packet (PARTY, KAPAN, PACKET, PKT, CARAT, PROCESS, ORIGINAL, COLOR, TAG, Type, IDATE, BARCODE) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";

    db.query(SQL, [Party, Kapan, Packet, Pkt, Carat, Process, Original, Color, Tag, Type, IDate, Barcode], (err, result) => {
        if (err) {
            console.error("Error while inserting Packet", err);
            res.status(500).json({ message: "Can't insert Data into Packet" });
        }
        res.status(200).json({ message: "Packet Added Succesfully", resultIt: result.insertId });
    });
}

exports.Packets = (req, res) => {
    const { kapan } = req.params;
    db.query("SELECT * FROM Packet WHERE KAPAN = ?", [kapan], (err, result) => {
        if (err) {
            console.error("Error to Fetch Packets", err);
            return res.status(500).json({ message: "Error while fetch Packet" });
        }
        return res.status(200).json(result);
    });
}

exports.getKapan = async (req, res) => {
    const { kapan } = req.params;
    const SQL = "SELECT * FROM rough WHERE ID = ?";
    db.query(SQL, [kapan], (err, result) => {
        if (err) return res.status(500).json({ error: "DB Error", err });
        if (result.length === 0) return res.status(404).json({ error: "IFSC not found" });
        res.json(result);
    });
}