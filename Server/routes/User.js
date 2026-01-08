import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// GET PROFILE
router.get("/profile/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, date_of_birth, nik, shelter, phone, email, profile_image 
       FROM users WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE PROFILE (tanpa multer & authenticateToken dulu)
router.put("/profile/:id", async (req, res) => {
  try {
    const { name, date_of_birth, nik, shelter, phone, email, profile_image } = req.body;
    console.log("Update Profile Data:", req.body);
    const [result] = await db.query(
      `UPDATE users SET 
       name = ?, 
       date_of_birth = ?, 
       nik = ?, 
       shelter = ?, 
       phone = ?, 
       email = ?, 
       profile_image = ?
       WHERE id = ?`,
      [name, date_of_birth, nik, shelter, phone, email, profile_image, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    const [updatedRows] = await db.query(
      `SELECT id, name, date_of_birth, nik, shelter, phone, email, profile_image 
       FROM users WHERE id = ?`,
      [req.params.id]
    );

    res.json({ success: true, user: updatedRows[0] });

  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/users/:id/photo", upload.single("profile_image"), async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang diunggah" });
    }

    const filePath = req.file.path; // contoh: uploads/profile_12345.png

    const [rows] = await db.query(
      "UPDATE users SET profile_image = ? WHERE id = ?",
      [filePath, userId]
    );

    res.json({
      message: "Foto profil berhasil diperbarui",
      profile_image: filePath,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal upload foto" });
  }
});


export default router;
