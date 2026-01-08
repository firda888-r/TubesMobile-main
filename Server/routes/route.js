import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// --- SETUP MULTER (UPLOAD FOTO) ---
// Konfigurasi tempat penyimpanan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pastikan folder 'uploads' ada di dalam folder Server
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    // Memberi nama unik pada file (timestamp + ekstensi asli)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// =================================================================
// 1. ROUTES UNTUK KUCING (CATALOG)
// =================================================================

// GET ALL CATS (Untuk Halaman Home & Adopt)
router.get("/cats", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cats");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data kucing" });
  }
});

// ADD CAT (Opsional - Untuk Admin menambah kucing via Postman/Backend)
router.post("/add-cat", upload.single("image"), async (req, res) => {
  const { name, breed, age, gender, description } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    await db.query(
      "INSERT INTO cats (name, breed, age, gender, description, image) VALUES (?, ?, ?, ?, ?, ?)",
      [name, breed, age, gender, description, image]
    );
    res.json({ message: "Kucing berhasil ditambahkan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menambah kucing" });
  }
});


// =================================================================
// 2. ROUTES UNTUK LAPORAN (RESCUE)
// =================================================================

// POST REPORT (Kirim Laporan Baru)
// Frontend mengirim field 'photos', maka di sini pakai upload.array('photos')
router.post("/reports", upload.array("photos"), async (req, res) => {
  // Ambil data text dari form
  const { user_id, description, location, cat_name, reporterContact } = req.body;
  
  // Ambil nama file dari array upload
  // Jika ada file, ambil namanya. Jika tidak, array kosong.
  const files = req.files ? req.files.map((file) => file.filename) : [];
  
  // Simpan nama file sebagai JSON String (contoh: '["foto1.jpg", "foto2.jpg"]')
  // Supaya bisa simpan banyak foto dalam 1 kolom database
  const imageJson = JSON.stringify(files); 

  try {
    // Query Insert ke Database
    await db.query(
      `INSERT INTO reports 
      (user_id, description, location, image, status, cat_name, reporter_contact, created_at) 
      VALUES (?, ?, ?, ?, 'Diproses', ?, ?, NOW())`,
      [
        user_id, 
        description, 
        location, 
        imageJson, 
        cat_name || 'Tanpa Nama', // Default value jika kosong
        reporterContact || '-'    // Default value jika kosong
      ]
    );

    res.status(201).json({ message: "Laporan berhasil dikirim" });
  } catch (err) {
    console.error("Error Report:", err); // Cek terminal jika error lagi
    res.status(500).json({ error: "Gagal menyimpan laporan" });
  }
});

// GET MY REPORTS (Ambil Laporan Milik User Tertentu)
// Dipakai di halaman Status untuk menampilkan tab "Laporan Rescue"
router.get("/my-reports/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data laporan" });
  }
});
// ================= NEWS =================

// GET ALL NEWS
router.get("/news", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM news ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal ambil news" });
  }
});

// ADD NEWS (PAKAI UPLOAD)
router.post("/news", upload.single("image"), async (req, res) => {
  const { title, content, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !content) {
    return res.status(400).json({ error: "Title & content wajib" });
  }

  try {
    await db.query(
      `INSERT INTO news (title, content, category_id, image)
       VALUES (?, ?, ?, ?)`,
      [title, content, category_id || null, image]
    );

    res.status(201).json({ message: "News berhasil ditambahkan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal tambah news" });
  }
});

export default router;