import { supabase } from "../supabaseClient.js";
import express from "express";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// 📚 Get all books
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase.from("books").select("*");
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("🔥 Fetch Books Error:", err);
        res.status(500).json({ error: "Failed to fetch books." });
    }
});

// 📚 Get books issued to a user
router.get("/issued", authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("books")
            .select("*")
            .eq("issued_to", req.user.id);
        
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("🔥 Fetch Issued Books Error:", err);
        res.status(500).json({ error: "Failed to fetch issued books." });
    }
});

export default router;
