import express from "express";
import db from "../db.js";
import * as auth from "../middleware/authMiddleware.js";
console.log("DEBUG AUTH:", auth);

const { verifyToken, verifyAdmin } = auth;
const router = express.Router();

// 📋 Daftar pelanggan (khusus admin)
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, full_name, email, role, created_at 
       FROM users 
       WHERE role = 'pelanggan' 
       ORDER BY id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Hapus pelanggan
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = ? AND role = 'pelanggan'", [
      req.params.id,
    ]);
    res.json({ message: "Pelanggan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📦 Cek stok milik pelanggan
router.get("/:id/stok", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, 
              (s.stok + IFNULL(s.barang_masuk,0) - IFNULL(s.barang_keluar,0)) AS total_stok
       FROM stok s
       WHERE s.user_id = ?`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
