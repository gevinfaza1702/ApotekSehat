import React, { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Stethoscope,
  Pill,
  CalendarCheck,
  FlaskConical,
  Store,
  LayoutDashboard,
  PackageSearch,
  Truck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const FALLBACK_BRAND = "#E91E63";

function normalizeHex(color) {
  if (typeof color !== "string") {
    return FALLBACK_BRAND;
  }

  let value = color.trim();
  if (!value.startsWith("#")) {
    return FALLBACK_BRAND;
  }

  value = value.slice(1);
  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (value.length < 6) {
    value = value.padEnd(6, "0");
  }

  return `#${value.slice(0, 6).toUpperCase()}`;
}

function withAlpha(color, opacity) {
  const base = normalizeHex(color);
  const alpha = Math.round(Math.min(Math.max(opacity, 0), 1) * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();

  return `${base}${alpha}`;
}

function TopNav({ theme, logoSrc }) {
  return (
    <header
      className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      style={{ borderColor: theme.brandSofter }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg border"
            style={{ backgroundColor: theme.brandSofter, borderColor: theme.brandBorder }}
          >
            <img src={logoSrc} alt="ApotekSehat logo" className="h-5 w-5 object-contain" />
          </div>
          <span className="font-semibold tracking-tight" style={{ color: theme.brand }}>
            ApotekSehat
          </span>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
          <a href="#layanan" className="hover:text-slate-900">
            Layanan
          </a>
          <a href="#inventori" className="hover:text-slate-900">
            Untuk Apotek
          </a>
          <a href="#harga" className="hover:text-slate-900">
            Harga
          </a>
          <a href="#faq" className="hover:text-slate-900">
            FAQ
          </a>
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-white"
            style={{ backgroundColor: theme.brand }}
          >
            Masuk
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero({ theme, heroVideoSrc }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], [0, 20]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: theme.gradient }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: theme.brandSofter,
              borderColor: theme.brandBorder,
              color: theme.brand,
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Solusi kesehatan dan inventori apotek
          </motion.div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Konsultasi dokter, beli obat, janji temu, cek lab -
            <span className="block" style={{ color: theme.brand }}>
              plus inventori apotek yang rapi.
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Semua kebutuhan pasien dan operasional apotek dalam satu platform: layanan kesehatan
            untuk pelanggan dan dashboard stok untuk pemilik apotek.
          </p>

          <div className="mt-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="flex items-center gap-2 px-2">
                <input
                  className="flex-1 py-3 text-slate-700 outline-none placeholder:text-slate-400"
                  placeholder="Cari obat, layanan, atau dokter"
                />
                <button
                  className="rounded-xl px-4 py-2 text-white"
                  style={{ backgroundColor: theme.brand }}
                >
                  Cari
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Contoh: paracetamol, vaksin flu, konsultasi kulit
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[{ icon: Stethoscope, label: "Tanya Dokter" }, { icon: Pill, label: "Beli Obat" }, { icon: CalendarCheck, label: "Janji Temu" }, { icon: FlaskConical, label: "Cek Lab" }].map(
              (item) => (
                <a
                  key={item.label}
                  href="#layanan"
                  className="group rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:shadow"
                >
                  <item.icon className="mx-auto h-5 w-5" style={{ color: theme.brand }} />
                  <div className="mt-2 text-sm font-medium text-slate-800 group-hover:underline">
                    {item.label}
                  </div>
                </a>
              ),
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <motion.div
            style={{ y }}
            className="relative overflow-hidden rounded-3xl border bg-white p-2 shadow-xl sm:p-3"
          >
            <div
              className="absolute inset-0 rounded-3xl"
              style={{ boxShadow: `0 40px 120px -60px ${theme.brandBorder}` }}
            />
            <video
              src={heroVideoSrc}
              className="relative h-[360px] w-full rounded-2xl object-cover md:h-[420px]"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              poster="/images/Background.png"
            >
              Browser anda tidak mendukung pemutaran video.
            </video>
            <div
              className="pointer-events-none absolute -inset-20"
              style={{ background: theme.glow }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, desc, theme }) {
  return (
    <div
      className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
      style={{ borderColor: theme.brandSofter }}
    >
      <div
        className="inline-flex items-center justify-center rounded-xl border p-3"
        style={{ backgroundColor: theme.brandSofter, borderColor: theme.brandBorder }}
      >
        <Icon className="h-5 w-5" style={{ color: theme.brand }} />
      </div>
      <h3 className="mt-3 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function InventoryBento({ theme }) {
  const items = [
    {
      icon: LayoutDashboard,
      title: "Dashboard Stok",
      desc: "Ringkasan stok minimum, barang habis, dan top penjualan dalam sekali lihat.",
    },
    {
      icon: PackageSearch,
      title: "Katalog & Batch",
      desc: "Catat batch dan tanggal kedaluwarsa, lengkap dengan pengingat menjelang exp.",
    },
    {
      icon: Truck,
      title: "Pengadaan & Pengiriman",
      desc: "Kelola PO supplier, penerimaan barang, dan integrasi multi-ekspedisi.",
    },
    {
      icon: ShieldCheck,
      title: "Audit & Kepatuhan",
      desc: "Hak akses granular, log aktivitas, dan catatan mutasi siap diaudit.",
    },
  ];

  return (
    <section id="inventori" className="relative py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: theme.brandSofter,
              borderColor: theme.brandBorder,
              color: theme.brand,
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Untuk Apotek
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Inventori modern yang siap pakai
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Kelola stok, batch, supplier, dan distribusi dari satu dashboard terintegrasi. Tidak
            ada lagi catatan manual yang tercecer.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border bg-white p-5 shadow-sm"
              style={{ borderColor: theme.brandSofter }}
            >
              <div className="flex items-center gap-2 text-slate-800">
                <item.icon className="h-4 w-4" style={{ color: theme.brand }} />
                {item.title}
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
        <div id="masuk" className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="/login"
            className="rounded-xl px-5 py-3 font-medium text-white"
            style={{ backgroundColor: theme.brand }}
          >
            Masuk Admin/Apotek
          </a>
          <a
            href="/register"
            className="rounded-xl border px-5 py-3 text-slate-700 transition hover:bg-white"
            style={{ borderColor: theme.brandSofter }}
          >
            Daftar Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ theme, title, price, features, best }) {
  return (
    <div
      className="relative rounded-2xl border bg-white p-6 shadow-sm sm:p-8"
      style={{
        borderColor: best ? theme.brand : theme.brandSofter,
        boxShadow: best ? `0 12px 48px -24px ${theme.brandBorder}` : undefined,
      }}
    >
      {best && (
        <div
          className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
          style={{ backgroundColor: theme.brandSofter, borderColor: theme.brandBorder, color: theme.brand }}
        >
          Best Value
        </div>
      )}
      <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
      <div className="mt-3">
        <span className="text-3xl font-bold text-slate-900">{price}</span>
        <span className="ml-1 text-slate-500">/bulan</span>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {features.map((feature) => (
          <li key={feature}>• {feature}</li>
        ))}
      </ul>
      <button
        className="mt-6 w-full rounded-xl px-4 py-2.5 text-white"
        style={{ backgroundColor: theme.brand }}
      >
        Pilih Paket
      </button>
    </div>
  );
}

export default function HaloInventoryCare({
  brandColor = "#E91E63",
  logoSrc = "/images/Logo.png",
  heroVideoSrc = "/videos/Apotek.mp4",
}) {
  const normalizedBrand = useMemo(() => normalizeHex(brandColor), [brandColor]);
  const theme = useMemo(
    () => ({
      brand: normalizedBrand,
      brandSoft: withAlpha(normalizedBrand, 0.14),
      brandSofter: withAlpha(normalizedBrand, 0.08),
      brandBorder: withAlpha(normalizedBrand, 0.22),
      gradient: `linear-gradient(180deg, ${withAlpha(normalizedBrand, 0.18)} 0%, #ffffff 65%)`,
      glow: `radial-gradient(600px circle at 20% 20%, ${withAlpha(
        normalizedBrand,
        0.24,
      )}, transparent 52%)`,
    }),
    [normalizedBrand],
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <TopNav theme={theme} logoSrc={logoSrc} />
      <Hero theme={theme} heroVideoSrc={heroVideoSrc} />

      <section id="layanan" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Layanan Unggulan
            </h2>
            <p className="mt-2 text-slate-600">
              Telemed, beli obat, janji temu, hingga cek lab - semua serba mudah dan aman.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              theme={theme}
              icon={Stethoscope}
              title="Tanya Dokter 24/7"
              desc="Chat atau video call dengan dokter berizin kapan saja."
            />
            <ServiceCard
              theme={theme}
              icon={Pill}
              title="Beli Obat & Vitamin"
              desc="Tebus resep, obat rutin, dan vitamin terpercaya."
            />
            <ServiceCard
              theme={theme}
              icon={CalendarCheck}
              title="Buat Janji"
              desc="Pilih poli dan jadwal dokter di klinik atau RS mitra."
            />
            <ServiceCard
              theme={theme}
              icon={FlaskConical}
              title="Cek Lab di Rumah"
              desc="Petugas datang ke lokasi, hasil digital langsung di aplikasi."
            />
          </div>
        </div>
      </section>

      <InventoryBento theme={theme} />

      <section id="harga" className="py-16" style={{ backgroundColor: theme.brandSofter }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Harga transparan
            </h2>
            <p className="mt-2 text-slate-600">
              Mulai gratis, upgrade kapan pun butuh fitur lanjutan untuk tim apotek.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <PricingCard
              theme={theme}
              title="Starter"
              price="Gratis"
              features={["Telemed dasar", "1 cabang apotek", "2 pengguna"]}
            />
            <PricingCard
              theme={theme}
              title="Pro"
              price="199.000"
              best
              features={[
                "Janji temu & Lab",
                "3 cabang",
                "Batch & exp alert",
                "Integrasi pengiriman",
              ]}
            />
            <PricingCard
              theme={theme}
              title="Business"
              price="599.000"
              features={[
                "Tanpa batas cabang",
                "Approval & audit trail",
                "Integrasi akuntansi",
                "SLA dukungan",
              ]}
            />
          </div>
        </div>
      </section>

      <section id="faq" className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Pertanyaan umum
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {[
              {
                q: "Apakah konsultasi aman?",
                a: "Ya. Komunikasi dienkripsi end-to-end dan mematuhi standar kerahasiaan medis.",
              },
              {
                q: "Bagaimana fitur inventori bekerja?",
                a: "Pantau stok, batch, dan kedaluwarsa. Notifikasi otomatis membantu menghindari kerugian.",
              },
              {
                q: "Apakah bisa integrasi kurir?",
                a: "Paket Pro dan Business mendukung integrasi logistik populer untuk pengiriman obat.",
              },
            ].map((item) => (
              <details key={item.q} className="group border-t border-slate-200 first:border-t-0">
                <summary className="flex cursor-pointer items-center justify-between gap-6 px-5 py-5 text-left text-slate-900 sm:px-6">
                  <span className="font-medium">{item.q}</span>
                  <ArrowRight className="h-4 w-4 text-slate-500 transition group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-6 text-sm text-slate-600 sm:px-6">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: theme.brandSofter }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg border"
              style={{ backgroundColor: theme.brandSofter, borderColor: theme.brandBorder }}
            >
              <Store className="h-4 w-4" style={{ color: theme.brand }} />
            </div>
            <span className="text-slate-700">ApotekSehat</span>
          </div>
          <p className="text-xs text-slate-500">
            (c) {new Date().getFullYear()} ApotekSehat. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
