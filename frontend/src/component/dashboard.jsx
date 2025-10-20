import React, { useEffect, useState } from "react";
import "./dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [barangKeluar, setBarangKeluar] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
  const [soonItems, setSoonItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [editHistory, setEditHistory] = useState([]);
  const [totalStok, setTotalStok] = useState(0);
  const [totalMasuk, setTotalMasuk] = useState(0);
  const [totalKeluar, setTotalKeluar] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      window.location.href = "/";
      return;
    }
    setUserName(name || "User");

// Barang Masuk (tampilkan list 5 item)
fetch(`${API_URL}/stok/laporan/barang-masuk`, {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((res) => res.json())
  .then((data) => {
    const rows = Array.isArray(data) ? data.slice(0, 5) : [];
    setBarangMasuk(rows);
  });

// ✅ Total Barang Masuk (semua)
fetch(`${API_URL}/stok/laporan/total-masuk`, {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((res) => res.json())
  .then((data) => setTotalMasuk(data.total || 0));

// Barang Keluar (tampilkan list 5 item)
fetch(`${API_URL}/stok/laporan/barang-keluar`, {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((res) => res.json())
  .then((data) => {
    const rows = Array.isArray(data) ? data.slice(0, 5) : [];
    setBarangKeluar(rows);
  });

// ✅ Total Barang Keluar (semua)
fetch(`${API_URL}/stok/laporan/total-keluar`, {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((res) => res.json())
  .then((data) => setTotalKeluar(data.total || 0));


// Barang Mau Expired
fetch(`${API_URL}/stok/laporan/barang-expired`, {
  headers: { Authorization: `Bearer ${token}` },
})
  .then(res => res.json())
  .then(data => {
    // Barang sudah expired
    setExpiredItems(Array.isArray(data.expired) ? data.expired : []);
    // Barang akan expired ≤ 30 hari
    setSoonItems(Array.isArray(data.soon) ? data.soon : []);
  })
  .catch(err => {
    console.error("Gagal fetch expired:", err);
  });


    // History Login ✅
    fetch(`${API_URL}/history/login`, {
    headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.json())
    .then((data) => setHistory(Array.isArray(data) ? data.slice(0, 5) : []));

    // Edit History ✅
    fetch(`${API_URL}/history/edit`, {
    headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.json())
    .then((data) => setEditHistory(Array.isArray(data) ? data.slice(0, 5) : []));

    // Total Nilai Stok
    fetch(`${API_URL}/stok/laporan/total-nilai`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTotalStok(data.total || 0));
  }, []);

  return (
    <div className="d-flex">

      <main className="content flex-grow-1 p-4">


        {/* Ringkasan */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card p-3 shadow summary-card border-start border-success border-4">
              <h6 className="text-muted">Total Nilai Stok</h6>
              <p className="fs-4 fw-bold text-success mb-0">
                Rp {totalStok.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 shadow summary-card border-start border-primary border-4">
              <h6 className="text-muted">Total Barang Masuk</h6>
              <p className="fs-4 fw-bold text-primary mb-0">{totalMasuk}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 shadow summary-card border-start border-danger border-4">
              <h6 className="text-muted">Total Barang Keluar</h6>
              <p className="fs-4 fw-bold text-danger mb-0">{totalKeluar}</p>
            </div>
          </div>
        </div>

        {/* Barang Masuk, Keluar, Expired */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card p-3 shadow-sm history-box">
              <h5 className="fw-bold">Barang Masuk</h5>
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Nama Barang</th>
                    <th>Tanggal</th>
                    <th className="text-success">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {barangMasuk.map((item, idx) => (
                    <tr key={idx}>
                      <td><strong>{item.nama_barang}</strong></td>
                      <td>{new Date(item.tanggal_masuk).toLocaleDateString("id-ID")}</td>
                      <td className="text-success fw-bold">{item.jumlah}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow-sm history-box">
              <h5 className="fw-bold">Barang Keluar</h5>
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Nama Barang</th>
                    <th>Tanggal</th>
                    <th className="text-danger">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {barangKeluar.map((item, idx) => (
                    <tr key={idx}>
                      <td><strong>{item.nama_barang}</strong></td>
                      <td>{new Date(item.tanggal_keluar).toLocaleDateString("id-ID")}</td>
                      <td className="text-danger fw-bold">{item.jumlah}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-4">
  <div className="card p-3 shadow-sm history-box">
    <h5 className="fw-bold">Barang Expired</h5>
    <table className="table table-sm align-middle">
      <thead>
        <tr>
          <th>Nama Barang</th>
          <th className="text-warning">Tanggal</th>
          <th>Jumlah</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {/* Sudah Expired */}
        {expiredItems.length > 0 ? (
          expiredItems.map((item, idx) => (
            <tr key={`exp-${idx}`} className="table-danger">
              <td><strong>{item.nama_barang}</strong></td>
              <td className="text-danger">
                {new Date(item.expired).toLocaleDateString("id-ID")}
              </td>
              <td>{item.stok} stok</td>
              <td><span className="badge bg-danger">Expired</span></td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center text-success">
              Tidak ada barang expired ✅
            </td>
          </tr>
        )}

        {/* Segera Expired */}
        {soonItems.length > 0 &&
          soonItems.map((item, idx) => (
            <tr key={`soon-${idx}`} className="table-warning">
              <td><strong>{item.nama_barang}</strong></td>
              <td className="text-warning">
                {new Date(item.expired).toLocaleDateString("id-ID")}
              </td>
              <td>{item.stok} stok</td>
              <td><span className="badge bg-warning text-dark">Segera Expired</span></td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
          </div>
          </div>

        {/* History */}
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card p-3 shadow-sm history-box">
              <h5 className="fw-bold">History Login</h5>
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, idx) => (
                    <tr key={idx}>
                      <td><strong>{item.full_name || "User"}</strong></td>
                      <td>{new Date(item.login_time).toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-3 shadow-sm history-box">
              <h5 className="fw-bold">Edit History</h5>
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Aktivitas</th>
                  </tr>
                </thead>
                <tbody>
                  {editHistory.map((item, idx) => (
                    <tr key={idx}>
                      <td><strong>{item.full_name || "User"}</strong></td>
                      <td>{item.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
