const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../db");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// 📂 Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // ✅ Store in "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, `user_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`); // ✅ Unique filename
    },
});

const upload = multer({ storage });

router.post("/profile-picture", authenticateUser, upload.single("photo"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`; // ✅ Full URL
    try {
        await pool.query("UPDATE users SET profile_picture = ? WHERE id = ?", [imageUrl, req.user.id]);
        res.json({ imageUrl });
    } catch (err) {
        console.error("🔥 Error saving image URL:", err);
        res.status(500).json({ error: "Failed to save image URL" });
    }
});


module.exports = router;
