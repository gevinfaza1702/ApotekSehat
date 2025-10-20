import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

/* =====================================================
   REGISTER
===================================================== */
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // 🔍 Cek email sudah ada belum
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    // 🔑 Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Default role = pelanggan
    await db.query(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      [full_name, email, hashed, "pelanggan"]
    );

    res.json({ message: "Register success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================================================
   LOGIN
===================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Cari user
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      // ❌ User tidak ada → catat login gagal (user_id = null)
      await db.query(
        "INSERT INTO login_history (user_id, ip_address, status) VALUES (?, ?, ?)",
        [null, req.ip, "failed"]
      );
      return res.status(400).json({ error: "User not found" });
    }

    const user = rows[0];

    // 🔑 Cek password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      // ❌ Password salah → catat login gagal
      await db.query(
        "INSERT INTO login_history (user_id, ip_address, status) VALUES (?, ?, ?)",
        [user.id, req.ip, "failed"]
      );
      return res.status(400).json({ error: "Invalid password" });
    }

    // ✅ Buat token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, full_name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    // ✅ Catat login sukses
    await db.query(
      "INSERT INTO login_history (user_id, ip_address, status) VALUES (?, ?, ?)",
      [user.id, req.ip, "success"]
    );

    res.json({
      message: "Login success",
      token,
      userId: user.id,
      userName: user.full_name,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err); // 🔍 Debug ke console server
    res.status(500).json({ error: err.message });
  }
});

export default router;
