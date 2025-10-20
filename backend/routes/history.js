import express from "express";
import db from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📝 Edit History
router.get("/edit", verifyToken, async (req, res) => {
  try {
    let query, params;

    if (req.user.role === "admin") {
      query = `SELECT eh.id, eh.user_id, eh.stok_id, eh.activity, eh.edit_time, u.full_name
               FROM edit_history eh
               LEFT JOIN users u ON eh.user_id = u.id
               ORDER BY eh.edit_time DESC LIMIT 50`;
      params = [];
    } else {
      query = `SELECT eh.id, eh.user_id, eh.stok_id, eh.activity, eh.edit_time, u.full_name
               FROM edit_history eh
               LEFT JOIN users u ON eh.user_id = u.id
               WHERE eh.user_id = ?
               ORDER BY eh.edit_time DESC LIMIT 50`;
      params = [req.user.id];
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📜 Login History
router.get("/login", verifyToken, async (req, res) => {
  try {
    let query, params;

    if (req.user.role === "admin") {
      query = `SELECT lh.id, lh.user_id, u.full_name, lh.login_time, lh.ip_address, lh.status
               FROM login_history lh
               LEFT JOIN users u ON lh.user_id = u.id
               ORDER BY lh.login_time DESC LIMIT 50`;
      params = [];
    } else {
      query = `SELECT lh.id, lh.user_id, u.full_name, lh.login_time, lh.ip_address, lh.status
               FROM login_history lh
               LEFT JOIN users u ON lh.user_id = u.id
               WHERE lh.user_id = ?
               ORDER BY lh.login_time DESC LIMIT 50`;
      params = [req.user.id];
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
