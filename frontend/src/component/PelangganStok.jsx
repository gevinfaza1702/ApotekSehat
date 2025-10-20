import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function PelangganStok() {
  const { id } = useParams();
  const [stok, setStok] = useState([]);
  const [nama, setNama] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Ambil nama pelanggan
    fetch(`${API_URL}/pelanggan`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id == id);
        if (found) setNama(found.full_name);
      });

    // Ambil stok pelanggan ini
    fetch(`${API_URL}/pelanggan/${id}/stok`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStok(Array.isArray(data) ? data : []));
  }, [id]);

  return (
    <div className="d-flex">
      <main className="content flex-grow-1 p-4">
        <h2 className="fw-bold text-same mb-4">📦 Stok {nama || "Pelanggan"}</h2>

        <div className="card shadow-sm p-3">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th>Stok</th>
                <th>Expired</th>
              </tr>
            </thead>
            <tbody>
              {stok.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.nama_barang}</td>
                  <td>{item.total_stok}</td>
                  <td>
                    {item.expired
                      ? new Date(item.expired).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default PelangganStok;
