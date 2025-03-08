const pool = require("./db");

async function testDB() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Connected to MySQL!");
        connection.release();
    } catch (err) {
        console.error("❌ MySQL Connection Error:", err.message);
    }
}

testDB();
