import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function DaftarPelanggan() {
  const [pelanggan, setPelanggan] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/pelanggan`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPelanggan(Array.isArray(data) ? data : []));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus pelanggan ini?")) return;
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/pelanggan/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPelanggan(pelanggan.filter((p) => p.id !== id));
  };

  const filtered = pelanggan.filter(
    (p) =>
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="d-flex">

      <main className="content flex-grow-1 p-4">
        <h2 className="fw-bold text-same mb-4">👥 Daftar Pelanggan</h2>

        {/* Search */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Cari pelanggan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="card shadow-sm p-3">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Tanggal Daftar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.id}</td>
                  <td>{p.full_name}</td>
                  <td>{p.email}</td>
                  <td>
                    {p.created_at
                      ? new Date(p.created_at).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => navigate(`/pelanggan/${p.id}/stok`)}
                    >
                      Stok
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
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

export default DaftarPelanggan;
