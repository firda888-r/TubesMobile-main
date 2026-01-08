import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  
  try {
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ error: "Email sudah terdaftar!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, 'adopter')",
      [name, email, hashedPassword, phone]
    );

    res.json({ message: "Registrasi berhasil! Silakan login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal daftar user baru." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(404).json({ error: "Email tidak ditemukan." });

    const user = users[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Password salah!" });

    const { password: _, ...userData } = user;
    res.json(userData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

export default router;