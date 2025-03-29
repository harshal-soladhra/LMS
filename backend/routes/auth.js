import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../db.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// 🔹 Register User
router.post("/register", async (req, res) => {
  const { name, email, password, role = "member" } = req.body;
  
+ console.log("📩 Received Registration Data:", req.body);  // ✅ Debug request data

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password: hashedPassword, role }]);

+ console.log("✅ Supabase Insert Response:", data, error);  // ✅ Debug Supabase response

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "User registered successfully" });
});


// 🔑 Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  // ✅ Authenticate user via Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: "Invalid credentials" });

  res.json({ token: data.session.access_token, user: data.user });
});

// 👤 Get User Profile
router.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Unauthorized" });

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) return res.status(404).json({ error: "User not found" });

    res.json(data.user);
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
});

// 🚪 Logout User
router.post("/logout", async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: "Logout failed" });
  }
});

export default router;
