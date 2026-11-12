"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  ArrowUpRight,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  Camera,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStatsQuery } from "@/hooks/useApiQueries";

const chartData = [
  { name: "Jan", pendaftar: 24, pengunjung: 1200 },
  { name: "Feb", pendaftar: 38, pengunjung: 1850 },
  { name: "Mar", pendaftar: 55, pengunjung: 2400 },
  { name: "Apr", pendaftar: 72, pengunjung: 3100 },
  { name: "Mei", pendaftar: 110, pengunjung: 4200 },
  { name: "Jun", pendaftar: 145, pengunjung: 5800 },
];

export default function AdminDashboardPage() {
  const { data: stats, isLoading: loading } = useStatsQuery();

  return (
    <div className="space-y-8">
      {/* PAGE TITLE & ACTIONS MATCHING SCREENSHOT */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">
            Assalamu'alaikum, Admin
          </h1>
          <p className="text-slate-500 text-sm">
            Berikut adalah ringkasan operasional dan statistik Pondok Pesantren Al-Ikhlas hari ini.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 hover:bg-white border border-white/80 text-slate-700 text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <ExternalLink size={16} />
            <span>Kunjungi Website</span>
          </a>

          <Link
            href="/admin/berita/tambah"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-700/25 cursor-pointer"
          >
            <Plus size={18} />
            <span>Tulis Berita Baru</span>
          </Link>
        </div>
      </div>

      {/* 4 STAT CARDS 100% DINAMIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Pendaftar Santri"
          value={stats ? `${stats.totalRegistrations} Santri` : "Memuat..."}
          trend={stats ? `${stats.pendingRegistrations || 0} Antrean` : undefined}
          trendUp={true}
          icon={<Users size={24} />}
          color="purple"
          href="/admin/pendaftar"
        />

        <StatCard
          title="Berita & Artikel"
          value={stats ? `${stats.totalArticles} Artikel` : "Memuat..."}
          subtitle="Publikasi Aktif Pondok"
          icon={<FileText size={24} />}
          color="teal"
          href="/admin/berita"
        />

        <StatCard
          title="Program Pendidikan"
          value={stats ? `${stats.totalPrograms} Jenjang` : "Memuat..."}
          subtitle="Program & Kurikulum Aktif"
          icon={<GraduationCap size={24} />}
          color="blue"
          href="/admin/program"
        />

        <StatCard
          title="Dokumentasi Galeri"
          value={stats?.totalGallery !== undefined ? `${stats.totalGallery} Foto` : "Memuat..."}
          subtitle="Kegiatan & Fasilitas Pondok"
          icon={<Camera size={24} />}
          color="amber"
          href="/admin/galeri"
        />
      </div>

      {/* CHART & RECENT APPLICANTS WIDGET */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* CHART (2 Cols) */}
        <div className="xl:col-span-2 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Statistik Pendaftar PSB & Pengunjung
              </h2>
              <p className="text-xs text-slate-500">
                Data tren pergerakan calon santri 6 bulan terakhir
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                Pendaftar
              </span>
              <span className="flex items-center gap-1.5 text-teal-600">
                <span className="w-3 h-3 rounded-full bg-teal-400 inline-block" />
                Kunjungan
              </span>
            </div>
          </div>

          <div className="h-[260px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPendaftar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#047857" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPengunjung" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.7)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pendaftar"
                  stroke="#047857"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPendaftar)"
                  name="Calon Santri"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT APPLICANTS WIDGET (1 Col) */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Pendaftar Terbaru
              </h2>
              <Link
                href="/admin/pendaftar"
                className="text-emerald-800 text-xs font-bold hover:underline cursor-pointer"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Memuat data pendaftar...
                </p>
              ) : stats?.recentRegistrations && stats.recentRegistrations.length > 0 ? (
                stats.recentRegistrations.slice(0, 4).map((reg: any) => (
                  <Link
                    key={reg.id}
                    href="/admin/pendaftar"
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/50 hover:bg-white/80 border border-white/70 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          reg.status === "Lulus Seleksi"
                            ? "bg-emerald-100 text-emerald-700"
                            : reg.status === "Diverifikasi"
                              ? "bg-teal-100 text-teal-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {reg.status === "Lulus Seleksi" ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Clock size={16} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 truncate">
                          {reg.fullName}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">
                          {reg.programChoice} • {reg.registrationNumber}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        reg.status === "Lulus Seleksi"
                          ? "bg-emerald-100 text-emerald-800"
                          : reg.status === "Diverifikasi"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">
                  Belum ada data pendaftar baru.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/50 mt-4">
            <Link
              href="/admin/pendaftar"
              className="w-full py-2.5 rounded-xl bg-white/70 hover:bg-white border border-white/80 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Kelola Semua Pendaftar PSB</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK CMS NAVIGATION CARDS */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Kelola Konten & Bagian Website
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <QuickCard
            title="Banner Slider"
            desc="Atur hero halaman depan"
            icon={<ImageIcon size={20} />}
            href="/admin/banners"
          />
          <QuickCard
            title="Berita & Artikel"
            desc="Kelola publikasi blog"
            icon={<FileText size={20} />}
            href="/admin/berita"
          />
          <QuickCard
            title="Jenjang Pendidikan"
            desc="Kurikulum & program"
            icon={<GraduationCap size={20} />}
            href="/admin/program"
          />
          <QuickCard
            title="Galeri Kegiatan"
            desc="Dokumentasi foto"
            icon={<Camera size={20} />}
            href="/admin/galeri"
          />
          <QuickCard
            title="Profil Pondok"
            desc="Sambutan & visi misi"
            icon={<Users size={20} />}
            href="/admin/profil"
          />
          <QuickCard
            title="Testimoni & FAQ"
            desc="Review & tanya jawab"
            icon={<CheckCircle2 size={20} />}
            href="/admin/testimoni-faq"
          />
        </div>
      </div>
    </div>
  );
}

// --- SUBCOMPONENTS MATCHING CONTOHCODE ---

function StatCard({
  title,
  value,
  trend,
  trendUp,
  icon,
  color,
  subtitle,
  href,
}: {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  color: "purple" | "teal" | "blue" | "amber";
  subtitle?: string;
  href?: string;
}) {
  const colorMap = {
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    teal: "bg-teal-100 text-teal-700 border-teal-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
  };

  const content = (
    <div
      className={`bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:bg-white/60 transition-all ${
        href ? "cursor-pointer hover:-translate-y-1" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${colorMap[color]}`}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-white/60 border border-white/70 ${
              trendUp ? "text-emerald-700" : "text-rose-500"
            }`}
          >
            <ArrowUpRight size={13} />
            {trend}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-slate-500 text-xs font-semibold mb-1 truncate">
          {title}
        </h3>
        <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">
          {value}
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-500 mt-1 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="cursor-pointer block">
      {content}
    </Link>
  ) : (
    content
  );
}

function QuickCard({
  title,
  desc,
  icon,
  href,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="p-4 rounded-2xl bg-white/50 hover:bg-white/90 border border-white/80 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
    >
      <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
          {title}
        </h4>
        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{desc}</p>
      </div>
    </Link>
  );
}
