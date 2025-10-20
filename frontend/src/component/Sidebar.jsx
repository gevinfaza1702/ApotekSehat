import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CubeIcon,
  DocumentTextIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import "./Sidebar.css";

function Sidebar({ userName }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // "admin" / "pelanggan"

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <button
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <Bars3Icon className="icon toggle" />
          ) : (
            <XMarkIcon className="icon toggle" />
          )}
        </button>
        {!collapsed && <span className="logo-text">ApotekSehat</span>}
      </div>

      {/* Menu */}
      <ul className="nav-list">
        {/* Semua role punya Dashboard */}
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              "nav-link fw-bold" + (isActive ? " active" : "")
            }
          >
            <HomeIcon className="icon" />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
        </li>

        {/* Menu khusus PELANGGAN */}
        {role === "pelanggan" && (
          <>
            <li>
              <NavLink
                to="/stok"
                className={({ isActive }) =>
                  "nav-link fw-bold" + (isActive ? " active" : "")
                }
              >
                <CubeIcon className="icon" />
                {!collapsed && <span>Stok</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/laporan"
                className={({ isActive }) =>
                  "nav-link fw-bold" + (isActive ? " active" : "")
                }
              >
                <DocumentTextIcon className="icon" />
                {!collapsed && <span>Laporan</span>}
              </NavLink>
            </li>
          </>
        )}

        {/* Menu khusus ADMIN */}
        {role === "admin" && (
          <>
            <li>
              <NavLink
                to="/admin/pelanggan"
                className={({ isActive }) =>
                  "nav-link fw-bold" + (isActive ? " active" : "")
                }
              >
                <UsersIcon className="icon" />
                {!collapsed && <span>Daftar Pelanggan</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  "nav-link fw-bold" + (isActive ? " active" : "")
                }
              >
                <Cog6ToothIcon className="icon" />
                {!collapsed && <span>Pengaturan</span>}
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          className="btn-logout d-flex align-items-center gap-2"
          onClick={handleLogout}
        >
          <ArrowRightOnRectangleIcon className="icon" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
