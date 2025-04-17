const mysql = require('mysql2')
// const mysql = require('mysql')
const dotenv = require('dotenv');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "soft",
    multipleStatements: true
})

dotenv.config();

// const db = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     multipleStatements: true,
// })

db.connect(err => {
    if (err) {
        console.error('DB connection failed:', err);
    } else {
        console.log('Connected to new DB!');
    }
});

// db.connect(err => {
//     if (err) {
//         console.error('Database connection failed:', err);
//         return;
//     }
//     console.log('Connected to MySQL');
// });

db.on('error', (err) => {
    console.error('Database error:', err);
});


module.exports = db;
