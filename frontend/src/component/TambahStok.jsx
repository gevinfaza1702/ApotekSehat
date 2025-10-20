import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TambahStok.css";


const API_URL = import.meta.env.VITE_API_URL;

function TambahStok() {
  const navigate = useNavigate();
  const { id } = useParams(); // cek apakah edit mode

  const [form, setForm] = useState({
    kode_item: "",
    barcode: "",
    nama_barang: "",
    jenis: "",
    merek: "",
    kategori: "",
    rak: "",
    tipe_item: "",
    satuan: "",
    harga_beli: 0,
    harga_jual: 0,
    supplier: "",
    batch: "",
    expired: "",
    stok: 0,
    min_stok: 0,
    barang_masuk: 0,
    tanggal_masuk: "",
    barang_keluar: 0,
    tanggal_keluar: "",
    status: "aktif",
  });

  // Prefill kalau edit
  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("token");
      fetch(`${API_URL}/stok/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setForm({
            kode_item: data.kode_item || "",
            barcode: data.barcode || "",
            nama_barang: data.nama_barang || "",
            jenis: data.jenis || "",
            merek: data.merek || "",
            kategori: data.kategori || "",
            rak: data.rak || "",
            tipe_item: data.tipe_item || "",
            satuan: data.satuan || "",
            harga_beli: data.harga_beli || 0,
            harga_jual: data.harga_jual || 0,
            supplier: data.supplier || "",
            batch: data.batch || "",
            expired: data.expired ? data.expired.split("T")[0] : "",
            stok: data.stok || 0,
            min_stok: data.min_stok || 0,
            barang_masuk: data.barang_masuk || 0,
            tanggal_masuk: data.tanggal_masuk
              ? data.tanggal_masuk.split("T")[0]
              : "",
            barang_keluar: data.barang_keluar || 0,
            tanggal_keluar: data.tanggal_keluar
              ? data.tanggal_keluar.split("T")[0]
              : "",
            status: data.status || "aktif",
          });
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const method = id ? "PUT" : "POST";
      const url = id ? `${API_URL}/stok/${id}` : `${API_URL}/stok`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert(id ? "Barang berhasil diupdate" : "Barang berhasil ditambahkan");
        navigate("/stok");
      } else {
        alert(data.error || "Gagal menyimpan barang");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat simpan data stok");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">{id ? "Edit Barang" : "Tambah Barang"}</h2>
      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        {[
          { name: "kode_item", label: "Kode Barang", type: "text" },
          { name: "barcode", label: "Barcode", type: "text" },
          { name: "nama_barang", label: "Nama Barang", type: "text" },
          { name: "jenis", label: "Jenis", type: "text" },
          { name: "merek", label: "Merek", type: "text" },
          { name: "kategori", label: "Kategori", type: "text" },
          { name: "rak", label: "Rak", type: "text" },
          { name: "tipe_item", label: "Tipe Item", type: "text" },
          { name: "satuan", label: "Satuan", type: "text" },
          { name: "harga_beli", label: "Harga Beli", type: "number" },
          { name: "harga_jual", label: "Harga Jual", type: "number" },
          { name: "supplier", label: "Supplier", type: "text" },
          { name: "batch", label: "Batch", type: "text" },
          { name: "expired", label: "Expired", type: "date" },
          { name: "stok", label: "Stok", type: "number" },
          { name: "min_stok", label: "Minimal Stok", type: "number" },
          { name: "barang_masuk", label: "Barang Masuk", type: "number" },
          { name: "tanggal_masuk", label: "Tanggal Masuk", type: "date" },
          { name: "barang_keluar", label: "Barang Keluar", type: "number" },
          { name: "tanggal_keluar", label: "Tanggal Keluar", type: "date" },
          { name: "status", label: "Status", type: "text" },
        ].map((field) => (
          <div className="mb-3" key={field.name}>
            <label className="form-label">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              className="form-control"
              value={form[field.name]}
              onChange={handleChange}
              required={["kode_item", "nama_barang", "harga_jual"].includes(
                field.name
              )}
              disabled={field.name === "kode_item" && id} // kalau edit, kode dikunci
            />
          </div>
        ))}

        {/* Tombol Simpan & Batal */}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button type="submit" className="btn btn-sm btn-success">
            {id ? "Update" : "Simpan"}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate("/stok")}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

export default TambahStok;
