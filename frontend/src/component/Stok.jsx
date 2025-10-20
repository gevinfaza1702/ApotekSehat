// src/component/Stok.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Stok.css";

const API_URL = import.meta.env.VITE_API_URL;

function Stok() {
  const [stokData, setStokData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchStok();
  }, []);

  const fetchStok = async () => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    setUserName(name || "User");

    try {
      const res = await fetch(`${API_URL}/stok`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStokData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal ambil stok:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus data ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/stok/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setStokData(stokData.filter((item) => item.id !== id));
    } catch (err) {
      alert("Gagal hapus data");
    }
  };

// 📥 Export stok ke Excel
const handleExport = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Token tidak ditemukan, silakan login ulang!");
    return;
  }

  fetch(`${API_URL}/stok/export`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async (res) => {
      if (!res.ok) {
        // kalau gagal, ambil pesan error dari backend
        let errMsg = "Gagal export";
        try {
          const err = await res.json();
          errMsg = err.error || errMsg;
        } catch (e) {
          console.error("Error parse response:", e);
        }
        throw new Error(errMsg);
      }
      return res.blob();
    })
    .then((blob) => {
      // bikin link download file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "stok.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      alert("Export gagal: " + err.message);
      console.error("❌ Export error:", err);
    });
};



  // 📤 Import stok dari Excel
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/stok/import`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors && data.errors.length > 0) {
        console.error("Detail error import:", data.errors);
        // Biar user bisa lihat row dan pesan error
        alert(
        (data.message || "Import selesai") +
        "\n\nDetail error:\n" +
          data.errors
        .map((err) => `Row ${err.row}: ${err.error}`)
        .join("\n")
         );
         } else {
        alert(data.message || "Import selesai");
       }

      fetchStok(); // refresh data setelah import
        })
      .catch((err) => alert("Gagal import: " + err.message));
  };

  const filteredData = stokData.filter((item) =>
    item.nama_barang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="d-flex">

      {/* Konten */}
      <div className="content flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            {/* Import Excel */}
            <label className="btn btn-outline-primary me-2">
              📤 Import Excel
              <input
                type="file"
                accept=".xlsx"
                hidden
                onChange={handleImport}
              />
            </label>

            {/* Export Excel */}
            <button
              className="btn btn-outline-success me-2"
              onClick={handleExport}
            >
              📥 Export Excel
            </button>

            {/* Tambah Barang */}
            <Link to="/stok/tambah" className="btn btn-success">
              + Tambah Barang
            </Link>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Cari nama barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Tabel Ringkas */}
        <div className="card shadow-sm">
          <div className="card-body p-0 table-responsive">
            <table className="table table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th>Kode</th>
                  <th>Nama</th>
                  <th>Kategori</th>
                  <th>Supplier</th>
                  <th>Stok</th>
                  <th>Expired</th>
                  <th>Harga Jual</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.kode_item}</td>
                      <td>{item.nama_barang}</td>
                      <td>{item.kategori}</td>
                      <td>{item.supplier}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.stok <= (item.min_stok || 5)
                              ? "bg-danger"
                              : "bg-success"
                          }`}
                        >
                          {item.total_stok}
                        </span>
                      </td>
                      <td>
                        {item.expired ? (
                          <span
                            className={`badge ${
                              new Date(item.expired) < new Date()
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {new Date(item.expired).toLocaleDateString("id-ID")}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        Rp {Number(item.harga_jual).toLocaleString("id-ID")}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => setSelectedItem(item)}
                        >
                          Detail
                        </button>
                        <Link
                          to={`/stok/edit/${item.id}`}
                          className="btn btn-sm btn-warning text-white me-1"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      Tidak ada data stok
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Detail Barang</h5>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>Kode:</strong> {selectedItem.kode_item}
              </li>
              <li className="list-group-item">
                <strong>Barcode:</strong> {selectedItem.barcode}
              </li>
              <li className="list-group-item">
                <strong>Nama Barang:</strong> {selectedItem.nama_barang}
              </li>
              <li className="list-group-item">
                <strong>Supplier:</strong> {selectedItem.supplier}
              </li>
              <li className="list-group-item">
                <strong>Kategori:</strong> {selectedItem.kategori}
              </li>
              <li className="list-group-item">
                <strong>Harga Beli:</strong> Rp{" "}
                {Number(selectedItem.harga_beli).toLocaleString("id-ID")}
              </li>
              <li className="list-group-item">
                <strong>Harga Jual:</strong> Rp{" "}
                {Number(selectedItem.harga_jual).toLocaleString("id-ID")}
              </li>
              <li className="list-group-item">
                <strong>Batch:</strong> {selectedItem.batch}
              </li>
              <li className="list-group-item">
                <strong>Expired:</strong>{" "}
                {selectedItem.expired
                  ? new Date(selectedItem.expired).toLocaleDateString("id-ID")
                  : "-"}
              </li>
              <li className="list-group-item">
                <strong>Barang Masuk:</strong>{" "}
                {selectedItem.barang_masuk || 0}{" "}
                {selectedItem.tanggal_masuk
                  ? `( ${new Date(
                      selectedItem.tanggal_masuk
                    ).toLocaleDateString("id-ID")} )`
                  : ""}
              </li>
              <li className="list-group-item">
                <strong>Barang Keluar:</strong>{" "}
                {selectedItem.barang_keluar || 0}{" "}
                {selectedItem.tanggal_keluar
                  ? `( ${new Date(
                      selectedItem.tanggal_keluar
                    ).toLocaleDateString("id-ID")} )`
                  : ""}
              </li>
              <li className="list-group-item">
                <strong>Status:</strong> {selectedItem.status}
              </li>
            </ul>
            <button
              className="btn btn-secondary mt-3"
              onClick={() => setSelectedItem(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stok;
