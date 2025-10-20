// src/components/Header.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import {
  UserCircleIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  UsersIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

import "./header.css"; // 🔹 import css

export default function Header({ userName }) {
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case "/dashboard":
        return { title: "Dashboard", icon: <ChartBarIcon className="icon" /> };
      case "/stok":
        return { title: "Manajemen Stok", icon: <ClipboardDocumentListIcon className="icon" /> };
      case "/pelanggan":
        return { title: "Data Pelanggan", icon: <UsersIcon className="icon" /> };
      case "/settings":
        return { title: "Pengaturan", icon: <Cog6ToothIcon className="icon" /> };
      default:
        return { title: "ApotekSehat", icon: <HomeIcon className="icon" /> };
    }
  };

  const { title, icon } = getPageInfo();

  return (
    <header className="header">
      <div className="header-left">
        {icon}
        <h5 className="page-title">{title}</h5>
      </div>
      <div className="header-right">
        <UserCircleIcon className="icon" />
        <span className="username">{userName}</span>
      </div>
    </header>
  );
}
