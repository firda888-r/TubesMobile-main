import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import route from "./routes/route.js";
import adoptionRoute from "./routes/adoptionRoute.js";
import authRoute from "./routes/authRoute.js"; // <--- PENTING
import path from "path"; // Tambah ini kalau belum ada

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); 
app.use("/images", express.static("images")); 

// Route Utama
app.use("/api", route);
app.use("/api", adoptionRoute);
app.use("/api/auth", authRoute); // <--- PENTING

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});