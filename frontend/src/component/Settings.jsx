import React, { useState } from "react";
import {
  Cog6ToothIcon,
  UserCircleIcon,
  BellIcon,
  ServerStackIcon,
} from "@heroicons/react/24/outline";
import "./Settings.css";

function Settings() {
  const [appName, setAppName] = useState("ApotekSehat");
  const [theme, setTheme] = useState("light");
  const [logo, setLogo] = useState(null);
  const [emailNotif, setEmailNotif] = useState(true);
  const [expiredNotif, setExpiredNotif] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("admin@mail.com");
  const [password, setPassword] = useState("");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("✅ Semua pengaturan berhasil disimpan!");
  };

  return (
    <div className="settings-page">
      <h2 className="settings-title">⚙️ Pengaturan Admin</h2>

      <form className="settings-form" onSubmit={handleSave}>
        {/* UMUM */}
        <h3>
          <Cog6ToothIcon className="icon-title" />
          Umum
        </h3>
        <div className="form-group">
          <label>Nama Aplikasi</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Logo Aplikasi</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} />
          {logo && <img src={logo} alt="Logo Preview" className="logo-preview" />}
        </div>
        <div className="form-group">
          <label>Tema</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">🌞 Light</option>
            <option value="dark">🌙 Dark</option>
          </select>
        </div>

        {/* AKUN ADMIN */}
        <h3>
          <UserCircleIcon className="icon-title" />
          Akun Admin
        </h3>
        <div className="form-group">
          <label>Nama Admin</label>
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email Admin</label>
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password Baru</label>
          <input
            type="password"
            placeholder="Password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* NOTIFIKASI */}
        <h3>
          <BellIcon className="icon-title" />
          Notifikasi
        </h3>
        <div className="form-group checkbox">
          <input
            type="checkbox"
            checked={emailNotif}
            onChange={(e) => setEmailNotif(e.target.checked)}
          />
          <label> Kirim email jika stok menipis</label>
        </div>
        <div className="form-group checkbox">
          <input
            type="checkbox"
            checked={expiredNotif}
            onChange={(e) => setExpiredNotif(e.target.checked)}
          />
          <label> Kirim email jika ada obat mau kadaluarsa</label>
        </div>

        {/* SISTEM */}
        <h3>
          <ServerStackIcon className="icon-title" />
          Sistem
        </h3>
        <div className="system-buttons">
          <button type="button" className="btn-secondary">Backup Database</button>
          <button type="button" className="btn-secondary">Restore Database</button>
          <button type="button" className="btn-danger">Reset Data Dummy</button>
        </div>

        <button type="submit" className="btn-save">💾 Simpan Semua</button>
      </form>
    </div>
  );
}

export default Settings;
