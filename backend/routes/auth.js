const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
// const bcrypt = require("bcryptjs");
const bcrypt = require("bcrypt"); // ✅ Use bcrypt instead of bcryptjs
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();

// User Registration

router.post("/register", async (req, res) => {
    const { name, email, password, role = "member" } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        console.log("🔍 Received Password:", password);

        if (typeof password !== "string" || password.trim() === "") {
            return res.status(400).json({ error: "Invalid password format" });
        }

        // ✅ Convert salt rounds to a valid number
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        if (isNaN(saltRounds) || saltRounds <= 0) {
            return res.status(500).json({ error: "Invalid salt rounds configuration." });
        }

        console.log("🧂 Salt Rounds:", saltRounds);

        // ✅ Hash password with fixed salt rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("🔒 Hashed Password:", hashedPassword);

        // Insert into MySQL
        const [result] = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, role]
        );

        // Generate JWT Token
        const token = jwt.sign({ id: result.insertId, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully", token });

    } catch (err) {
        console.error("🔥 Registration Error:", err);
        res.status(500).json({ error: "Server error. Please try again." });
    }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
  }

  try {
      const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      if (users.length === 0) return res.status(401).json({ error: "Invalid credentials" });

      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ token, user: { id: user.id, name: user.name, role: user.role } });

  } catch (err) {
      console.error("🔥 Login Error:", err); // Logs the actual error
      res.status(500).json({ error: "Server error. Please try again." });
  }
});

// Refresh Token Endpoint
router.post("/refresh", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(403).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token: newAccessToken });
    } catch (err) {
        res.status(403).json({ error: "Invalid refresh token" });
    }
});
// Get User Profile (Protected)
router.get("/profile", authenticateUser, async (req, res) => {
    try {
        const [users] = await pool.query("SELECT id, name, email, profile_picture , role FROM users WHERE id = ?", [req.user.id]);
        if (users.length === 0) return res.status(404).json({ error: "User not found" });

        res.json(users[0]);
    } catch (err) {
        console.error("🔥 Profile Fetch Error:", err);
        res.status(500).json({ error: "Server error. Please try again." });
    }
});

module.exports = router;
