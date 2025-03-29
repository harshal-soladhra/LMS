import express from "express";
import { supabase } from "../db.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Upload Profile Picture
router.post("/profile-picture", authenticateUser, async (req, res) => {
  const file = req.files?.photo;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = `profile_pictures/user_${req.user.id}/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from("profile-pictures")
    .upload(filePath, file.data);

  if (error) return res.status(500).json({ error: error.message });

  const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${filePath}`;
  
  await supabase
    .from("users")
    .update({ profile_picture: imageUrl })
    .eq("id", req.user.id);

  res.json({ imageUrl });
});

export default router;
