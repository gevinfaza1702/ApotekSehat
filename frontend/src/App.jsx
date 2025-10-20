import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginRegister from "./component/LoginRegister";
import Dashboard from "./component/dashboard";
import ProtectedRoute from "./component/ProtectedRoute";
import Stok from "./component/Stok";
import TambahStok from "./component/TambahStok";
import LandingPage from "./pages/LandingPage";
import ListPelanggan from "./component/ListPelanggan";
import PelangganStok from "./component/PelangganStok";
import Settings from "./component/Settings";
import Layout from "./component/Layout";  // ✅ Layout dengan Sidebar

import "./index.css";

function AppWrapper() {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Login */}
      <Route path="/login" element={<LoginRegister />} />

      {/* Dashboard & stok (pelanggan & admin) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["pelanggan", "admin"]}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stok"
        element={
          <ProtectedRoute allowedRoles={["pelanggan"]}>
            <Layout>
              <Stok />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stok/tambah"
        element={
          <ProtectedRoute allowedRoles={["pelanggan"]}>
            <Layout>
              <TambahStok />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stok/edit/:id"
        element={
          <ProtectedRoute allowedRoles={["pelanggan"]}>
            <Layout>
              <TambahStok />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Halaman admin */}
      <Route
        path="/admin/pelanggan"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <ListPelanggan />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pelanggan/:id/stok"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <PelangganStok />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<h2>Akses Ditolak 🚫</h2>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
