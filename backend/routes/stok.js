import express from "express";
import db from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";
import ExcelJS from "exceljs";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =====================================================
   1. CRUD STOK
===================================================== */

// ➕ Tambah stok
router.post("/", verifyToken, async (req, res) => {
  try {
    const data = req.body;
    await db.query(
      `INSERT INTO stok 
      (user_id, kode_item, barcode, nama_barang, jenis, merek, kategori, rak, tipe_item, satuan, 
       harga_beli, harga_jual, supplier, batch, expired, stok, min_stok, 
       barang_masuk, tanggal_masuk, barang_keluar, tanggal_keluar, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        data.kode_item,
        data.barcode,
        data.nama_barang,
        data.jenis || null,
        data.merek || null,
        data.kategori || null,
        data.rak || null,
        data.tipe_item || null,
        data.satuan || null,
        data.harga_beli || 0,
        data.harga_jual || 0,
        data.supplier || null,
        data.batch || null,
        data.expired || null,
        data.stok || 0,
        data.min_stok || 0,
        data.barang_masuk || 0,
        data.tanggal_masuk || null,
        data.barang_keluar || 0,
        data.tanggal_keluar || null,
        data.status || "aktif",
      ]
    );

    res.json({ message: "Stok berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update stok
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const data = req.body;

    const [result] = await db.query(
      `UPDATE stok SET 
        kode_item=?, barcode=?, nama_barang=?, jenis=?, merek=?, kategori=?, rak=?, tipe_item=?, satuan=?, 
        harga_beli=?, harga_jual=?, supplier=?, batch=?, expired=?, stok=?, min_stok=?, 
        barang_masuk=?, tanggal_masuk=?, barang_keluar=?, tanggal_keluar=?, status=? 
       WHERE id=? AND (user_id=? OR ? = 'admin')`,
      [
        data.kode_item,
        data.barcode,
        data.nama_barang,
        data.jenis || null,
        data.merek || null,
        data.kategori || null,
        data.rak || null,
        data.tipe_item || null,
        data.satuan || null,
        data.harga_beli || 0,
        data.harga_jual || 0,
        data.supplier || null,
        data.batch || null,
        data.expired || null,
        data.stok || 0,
        data.min_stok || 0,
        data.barang_masuk || 0,
        data.tanggal_masuk || null,
        data.barang_keluar || 0,
        data.tanggal_keluar || null,
        data.status || "aktif",
        req.params.id,
        req.user.id,
        req.user.role,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "Tidak bisa update stok ini" });
    }

    // 📝 Tambah ke edit_history
    await db.query(
      "INSERT INTO edit_history (user_id, stok_id, activity) VALUES (?, ?, ?)",
      [req.user.id, req.params.id, "Update stok"]
    );

    res.json({ message: "Stok berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Hapus stok
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM stok WHERE id=? AND (user_id=? OR ? = 'admin')",
      [req.params.id, req.user.id, req.user.role]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "Tidak bisa hapus stok ini" });
    }

    // 📝 Tambah ke edit_history
    await db.query(
      "INSERT INTO edit_history (user_id, stok_id, activity) VALUES (?, ?, ?)",
      [req.user.id, req.params.id, "Delete stok"]
    );

    res.json({ message: "Stok berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📋 Get semua stok
router.get("/", verifyToken, async (req, res) => {
  try {
    let query, params;

    if (req.user.role === "admin") {
      query = `SELECT s.*, u.full_name,
               (s.stok + IFNULL(s.barang_masuk,0) - IFNULL(s.barang_keluar,0)) AS total_stok
               FROM stok s 
               JOIN users u ON s.user_id = u.id`;
      params = [];
    } else {
      query = `SELECT s.*, 
               (s.stok + IFNULL(s.barang_masuk,0) - IFNULL(s.barang_keluar,0)) AS total_stok
               FROM stok s 
               WHERE s.user_id = ?`;
      params = [req.user.id];
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📌 Get stok by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    let query, params;

    if (req.user.role === "admin") {
      query = "SELECT * FROM stok WHERE id = ?";
      params = [req.params.id];
    } else {
      query = "SELECT * FROM stok WHERE id = ? AND user_id = ?";
      params = [req.params.id, req.user.id];
    }

    const [rows] = await db.query(query, params);

    if (rows.length === 0)
      return res.status(404).json({ error: "Stok tidak ditemukan" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================================================
   2. LAPORAN
===================================================== */

// 💰 Total nilai stok
router.get("/laporan/total-nilai", verifyToken, async (req, res) => {
  let query, params;

  if (req.user.role === "admin") {
    query = `SELECT SUM((stok + IFNULL(barang_masuk,0) - IFNULL(barang_keluar,0)) * harga_jual) AS total FROM stok`;
    params = [];
  } else {
    query = `SELECT SUM((stok + IFNULL(barang_masuk,0) - IFNULL(barang_keluar,0)) * harga_jual) AS total 
             FROM stok WHERE user_id = ?`;
    params = [req.user.id];
  }

  const [rows] = await db.query(query, params);
  res.json({ total: rows[0].total || 0 });
});

// 📦 Total barang masuk
router.get("/laporan/total-masuk", verifyToken, async (req, res) => {
  let query, params;

  if (req.user.role === "admin") {
    query = `SELECT SUM(barang_masuk) AS total FROM stok`;
    params = [];
  } else {
    query = `SELECT SUM(barang_masuk) AS total FROM stok WHERE user_id = ?`;
    params = [req.user.id];
  }

  const [rows] = await db.query(query, params);
  res.json({ total: rows[0].total || 0 });
});

// 📤 Total barang keluar
router.get("/laporan/total-keluar", verifyToken, async (req, res) => {
  let query, params;

  if (req.user.role === "admin") {
    query = `SELECT SUM(barang_keluar) AS total FROM stok`;
    params = [];
  } else {
    query = `SELECT SUM(barang_keluar) AS total FROM stok WHERE user_id = ?`;
    params = [req.user.id];
  }

  const [rows] = await db.query(query, params);
  res.json({ total: rows[0].total || 0 });
});

// 📑 Barang masuk list
router.get("/laporan/barang-masuk", verifyToken, async (req, res) => {
  let query, params;

  if (req.user.role === "admin") {
    query = `SELECT id, kode_item, nama_barang, barang_masuk AS jumlah, tanggal_masuk 
             FROM stok WHERE barang_masuk > 0 
             ORDER BY tanggal_masuk DESC`;
    params = [];
  } else {
    query = `SELECT id, kode_item, nama_barang, barang_masuk AS jumlah, tanggal_masuk 
             FROM stok WHERE barang_masuk > 0 AND user_id = ? 
             ORDER BY tanggal_masuk DESC`;
    params = [req.user.id];
  }

  const [rows] = await db.query(query, params);
  res.json(rows);
});

// 📑 Barang keluar list
router.get("/laporan/barang-keluar", verifyToken, async (req, res) => {
  let query, params;

  if (req.user.role === "admin") {
    query = `SELECT id, kode_item, nama_barang, barang_keluar AS jumlah, tanggal_keluar 
             FROM stok WHERE barang_keluar > 0 
             ORDER BY tanggal_keluar DESC`;
    params = [];
  } else {
    query = `SELECT id, kode_item, nama_barang, barang_keluar AS jumlah, tanggal_keluar 
             FROM stok WHERE barang_keluar > 0 AND user_id = ? 
             ORDER BY tanggal_keluar DESC`;
    params = [req.user.id];
  }

  const [rows] = await db.query(query, params);
  res.json(rows);
});

// ⏰ Barang expired & soon expired
router.get("/laporan/barang-expired", verifyToken, async (req, res) => {
  try {
    let expiredQuery, soonQuery, params;

    if (req.user.role === "admin") {
      // Barang sudah expired
      expiredQuery = `
        SELECT id, kode_item, nama_barang, expired, stok 
        FROM stok 
        WHERE expired IS NOT NULL AND expired < CURDATE()
        ORDER BY expired ASC
      `;

      // Barang akan expired dalam 30 hari
      soonQuery = `
        SELECT id, kode_item, nama_barang, expired, stok 
        FROM stok 
        WHERE expired IS NOT NULL 
          AND expired BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        ORDER BY expired ASC
      `;

      params = [];
    } else {
      // Barang sudah expired per user
      expiredQuery = `
        SELECT id, kode_item, nama_barang, expired, stok 
        FROM stok 
        WHERE expired IS NOT NULL AND expired < CURDATE()
          AND user_id = ?
        ORDER BY expired ASC
      `;

      // Barang akan expired per user
      soonQuery = `
        SELECT id, kode_item, nama_barang, expired, stok 
        FROM stok 
        WHERE expired IS NOT NULL 
          AND expired BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
          AND user_id = ?
        ORDER BY expired ASC
      `;

      params = [req.user.id];
    }

    const [expired] = await db.query(expiredQuery, params);
    const [soon] = await db.query(soonQuery, params);

    res.json({ expired, soon });
  } catch (err) {
    console.error("Error ambil barang expired:", err);
    res.status(500).json({ error: "Gagal ambil data barang expired" });
  }
});

/* =====================================================
   3. EXPORT & IMPORT EXCEL
===================================================== */

// 📤 Export stok ke Excel (semua user bisa akses, tanpa filter user_id)
router.get("/export", verifyToken, async (req, res) => {
  try {
    // 🔹 Query langsung ambil semua stok
    const query = `
      SELECT kode_item, barcode, nama_barang, jenis, merek, kategori, rak, satuan,
             harga_beli, harga_jual, supplier, batch, expired, stok, 
             barang_masuk, tanggal_masuk, barang_keluar, tanggal_keluar
      FROM stok
    `;

    const [rows] = await db.query(query);

    // 🔹 Kalau kosong, tetap kasih file Excel dengan header aja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Stok Barang");

    worksheet.columns = [
      { header: "Kode Item", key: "kode_item", width: 15 },
      { header: "Barcode", key: "barcode", width: 20 },
      { header: "Nama Barang", key: "nama_barang", width: 30 },
      { header: "Jenis", key: "jenis", width: 15 },
      { header: "Merek", key: "merek", width: 15 },
      { header: "Kategori", key: "kategori", width: 15 },
      { header: "Rak", key: "rak", width: 10 },
      { header: "Satuan", key: "satuan", width: 10 },
      { header: "Harga Beli", key: "harga_beli", width: 15 },
      { header: "Harga Jual", key: "harga_jual", width: 15 },
      { header: "Supplier", key: "supplier", width: 20 },
      { header: "Batch", key: "batch", width: 15 },
      { header: "Expired", key: "expired", width: 15 },
      { header: "Stok", key: "stok", width: 10 },
      { header: "Barang Masuk", key: "barang_masuk", width: 15 },
      { header: "Tanggal Masuk", key: "tanggal_masuk", width: 15 },
      { header: "Barang Keluar", key: "barang_keluar", width: 15 },
      { header: "Tanggal Keluar", key: "tanggal_keluar", width: 15 },
    ];

    // 🔹 Tambah data kalau ada
    if (rows && rows.length > 0) {
      rows.forEach((row) => worksheet.addRow(row));
    }

    // 🔹 Set header untuk download Excel
    res.setHeader("Content-Disposition", "attachment; filename=stok.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ Export error:", err);
    res.status(500).json({ error: err.message });
  }
});




// 📥 Import stok dari Excel (baris kosong tetap masuk + debug error)
router.post("/import", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.worksheets[0];

    // Helper: bersihin value
    const clean = (val, type = "string") => {
      if (val === null || val === undefined || val === "" || val === "NaN") {
        return type === "number" ? 0 : null;
      }
      return type === "number" ? Number(val) || 0 : String(val).trim();
    };

    // Helper: format tanggal
    const formatDate = (val) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.toISOString().split("T")[0];
    };

    let successCount = 0;
    let failCount = 0;
    let errors = [];

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      const [
        kode_item = "",
        barcode = "",
        nama_barang = "",
        jenis = "",
        merek = "",
        kategori = "",
        rak = "",
        satuan = "",
        harga_beli = 0,
        harga_jual = 0,
        supplier = "",
        batch = "",
        expired = null,
        stok = 0,
        barang_masuk = 0,
        tanggal_masuk = null,
        barang_keluar = 0,
        tanggal_keluar = null,
      ] = row.values.slice(1);

      try {
        await db.query(
          `INSERT INTO stok (
            user_id, kode_item, barcode, nama_barang, jenis, merek, kategori, rak, satuan,
            harga_beli, harga_jual, supplier, batch, expired, stok,
            barang_masuk, tanggal_masuk, barang_keluar, tanggal_keluar
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            req.user.id,
            clean(kode_item),
            clean(barcode),
            clean(nama_barang),
            clean(jenis),
            clean(merek),
            clean(kategori),
            clean(rak),
            clean(satuan),
            clean(harga_beli, "number"),
            clean(harga_jual, "number"),
            clean(supplier),
            clean(batch),
            formatDate(expired),
            clean(stok, "number"),
            clean(barang_masuk, "number"),
            formatDate(tanggal_masuk),
            clean(barang_keluar, "number"),
            formatDate(tanggal_keluar),
          ]
        );

        successCount++;
      } catch (err) {
        console.error(`❌ Error di row ${rowNumber}:`, err.sqlMessage || err.message);
        errors.push({
          row: rowNumber,
          error: err.sqlMessage || err.message,
          values: row.values.slice(1), // 👉 tampilkan isi baris biar gampang debug
        });
        failCount++;
      }
    } // end for

    res.json({
      message: `Import selesai: ${successCount} baris berhasil, ${failCount} gagal.`,
      errors,
    });

  } catch (err) {
    console.error("❌ Fatal error import:", err.sqlMessage || err.message);
    res.status(500).json({ error: err.sqlMessage || err.message });
  }
});



export default router;
