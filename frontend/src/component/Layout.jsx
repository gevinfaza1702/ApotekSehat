// src/components/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // 🔹 import Header baru

export default function Layout({ children }) {
  const userName = localStorage.getItem("userName") || "User";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="d-flex">  
      {/* Sidebar kiri */}
      <Sidebar userName={userName} />

      {/* Konten kanan */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* 🔹 Header di atas konten */}
        <Header userName={userName} onLogout={handleLogout} />

        {/* 🔹 Konten halaman */}
        <main className="flex-grow-1 p-4 bg-light">
          {children}
        </main>
      </div>
    </div>
  );
}
