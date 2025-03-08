const express = require("express");
const pool = require("../db");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get books issued to the logged-in user
router.get("/issued", authenticateUser, async (req, res) => {
    try {
        console.log("🔍 Fetching books for user ID:", req.user.id);

        const [books] = await pool.query(
            "SELECT id, title, issued_date, due_date, returned_date FROM books WHERE issued_to = ?",
            [req.user.id]
        );

        console.log("📚 Books found:", books);
        res.json(books);
    } catch (err) {
        console.error("🔥 Fetch Books Error:", err);
        res.status(500).json({ error: "Failed to fetch books. Please try again." });
    }
});

module.exports = router;
