import express from "express";
import db from "../db.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* FITUR ADOPSI                                 */
/* -------------------------------------------------------------------------- */

// 1. GET DETAIL KUCING
// Digunakan saat user klik salah satu kucing di katalog
router.get("/adoption/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, age, breed, description, image, status FROM cats WHERE id = ?",
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: "Cat not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Get Cat Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 2. POST PENGAJUAN ADOPSI
// Digunakan saat user klik tombol "Adopt Me"
router.post("/adopt", async (req, res) => {
  try {
    const { user_id, cat_id } = req.body;

    // Validasi input
    if (!user_id || !cat_id) {
      return res.status(400).json({ error: "Data user atau kucing tidak lengkap" });
    }

    // Cek apakah user sudah pernah mengajukan kucing ini (Anti Spam)
    const [existing] = await db.query(
      "SELECT * FROM adoptions WHERE user_id = ? AND cat_id = ? AND status = 'Menunggu'",
      [user_id, cat_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Anda sudah mengajukan adopsi untuk kucing ini dan sedang diproses." });
    }

    // Masukkan lamaran ke database
    await db.query(
      "INSERT INTO adoptions (user_id, cat_id, adoption_date, status) VALUES (?, ?, NOW(), 'Menunggu')",
      [user_id, cat_id]
    );

    res.json({ message: "Pengajuan berhasil! Admin akan memverifikasi data Anda." });

  } catch (err) {
    console.error("Adoption Submit Error:", err);
    res.status(500).json({ error: "Gagal mengajukan adopsi." });
  }
});

// 3. GET RIWAYAT ADOPSI SAYA
// Digunakan di Menu "Status" -> Tab "Adopsi Saya"
router.get("/my-adoptions/:userId", async (req, res) => {
  try {
    const query = `
      SELECT a.id, a.status, a.adoption_date, 
             c.name as cat_name, c.image as cat_image, c.breed
      FROM adoptions a
      JOIN cats c ON a.cat_id = c.id
      WHERE a.user_id = ?
      ORDER BY a.adoption_date DESC
    `;
    
    const [rows] = await db.query(query, [req.params.userId]);
    res.json(rows);

  } catch (err) {
    console.error("Get My Adoptions Error:", err);
    res.status(500).json({ error: "Gagal mengambil data riwayat." });
  }
});

export default router;