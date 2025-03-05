//...................database connection.......................


const mysql = require("mysql2/promise");

// Create a connection pool
const pool = mysql.createPool({
    host: "127.0.0.1",  // Change if needed
    user: "root",       // Your MySQL username
    password: "Abhi@8915mysql",       // Your MySQL password
    database: "lms",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;


