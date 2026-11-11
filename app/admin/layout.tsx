"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Image as ImageIcon,
  FileText,
  GraduationCap,
  Camera,
  Users,
  Settings,
  ShieldCheck,
  MessageSquareQuote,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Headphones,
  MessageCircle,
} from "lucide-react";
import { useProfileQuery } from "@/hooks/useApiQueries";

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: profile } = useProfileQuery();
  const shortName = profile?.shortName || "Al-Ikhlas";
  const institutionType = profile?.institutionType || "Pesantren";
  const logoUrl = profile?.logoUrl;
  const initials = (shortName || "AI")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [adminUser, setAdminUser] = useState<any>({
    name: "KH. Ahmad Syahidin, M.A.",
    role: "Pengasuh & Admin",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80",
  });

  // On desktop, open sidebar by default; on mobile, keep closed
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Close sidebar on mobile route change
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  // If on login page, don't show the dashboard shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Berhasil keluar.");
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const navItems = [
    {
      label: "Dasbor",
      href: "/admin",
      icon: <LayoutDashboard size={20} />,
      active: pathname === "/admin",
    },
    {
      label: "Banner Slider",
      href: "/admin/banners",
      icon: <ImageIcon size={20} />,
      active: pathname.startsWith("/admin/banners"),
    },
    {
      label: "Berita & Artikel",
      href: "/admin/berita",
      icon: <FileText size={20} />,
      active: pathname.startsWith("/admin/berita"),
    },
    {
      label: "Program Pendidikan",
      href: "/admin/program",
      icon: <GraduationCap size={20} />,
      active: pathname.startsWith("/admin/program"),
    },
    {
      label: "Galeri Kegiatan",
      href: "/admin/galeri",
      icon: <Camera size={20} />,
      active: pathname.startsWith("/admin/galeri"),
    },
    {
      label: "Pendaftar PSB",
      href: "/admin/pendaftar",
      icon: <Users size={20} />,
      active: pathname.startsWith("/admin/pendaftar"),
    },
    {
      label: "Profil & Pengasuh",
      href: "/admin/profil",
      icon: <ShieldCheck size={20} />,
      active: pathname.startsWith("/admin/profil"),
    },
    {
      label: "Testimoni & FAQ",
      href: "/admin/testimoni-faq",
      icon: <MessageSquareQuote size={20} />,
      active: pathname.startsWith("/admin/testimoni-faq"),
    },
    {
      label: "Pengaturan Situs",
      href: "/admin/pengaturan",
      icon: <Settings size={20} />,
      active: pathname.startsWith("/admin/pengaturan"),
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f1f5f9] font-sans text-slate-800">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-300/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-300/20 blur-[80px] pointer-events-none" />

      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm lg:hidden z-40 transition-opacity cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex h-screen relative z-10 overflow-hidden">
        {/* SIDEBAR DRAWER (100% RESPONSIVE, NO BLEEDING ON MOBILE) */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50 flex flex-col h-full
            w-72 max-w-[85vw] ${
              isSidebarOpen
                ? "translate-x-0 lg:w-64"
                : "-translate-x-full lg:translate-x-0 lg:w-20"
            }
            ${
              !isSidebarOpen
                ? "max-lg:pointer-events-none max-lg:invisible"
                : "max-lg:visible max-lg:pointer-events-auto"
            }
            transition-all duration-300 ease-in-out
            bg-white lg:bg-white/40 lg:backdrop-blur-2xl border-r border-slate-200/80 lg:border-white/60 shadow-2xl lg:shadow-[4px_0_24px_rgba(0,0,0,0.02)]
            overflow-x-hidden shrink-0
          `}
        >
          {/* Logo & Header */}
          <div className="p-5 md:p-6 flex items-center justify-between border-b border-slate-100 lg:border-transparent">
            <Link
              href="/admin"
              className={`flex items-center gap-3 cursor-pointer ${
                !isSidebarOpen && "lg:hidden"
              }`}
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                  setIsSidebarOpen(false);
                }
              }}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={profile?.name || shortName}
                  className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-emerald-700/20 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-700/20 shrink-0 text-white font-bold">
                  {initials || "AI"}
                </div>
              )}
              <span className="font-bold text-base leading-tight text-slate-900 whitespace-nowrap overflow-hidden">
                {institutionType}
                <br />
                {shortName}
              </span>
            </Link>

            {/* Mobile close button */}
            <button
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Tutup Menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-3 md:px-4 py-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 md:py-3 rounded-xl transition-all duration-200 cursor-pointer
                  ${
                    item.active
                      ? "bg-emerald-50 lg:bg-white/80 text-emerald-800 shadow-sm border border-emerald-200 lg:border-white/80 font-bold"
                      : "text-slate-600 hover:bg-slate-100 lg:hover:bg-white/50 hover:text-slate-900"
                  }
                `}
              >
                <div
                  className={`${
                    item.active ? "text-emerald-800" : "text-slate-500"
                  } shrink-0`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-sm whitespace-nowrap transition-opacity duration-200 ${
                    !isSidebarOpen ? "opacity-0 lg:hidden w-0" : "opacity-100 w-auto"
                  }`}
                >
                  {item.label}
                </span>
                {item.active && isSidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0" />
                )}
              </Link>
            ))}

            <div className="pt-4 pb-1">
              <p
                className={`text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 md:px-4 transition-opacity ${
                  !isSidebarOpen ? "opacity-0 lg:hidden" : "opacity-100"
                }`}
              >
                Tautan Cepat
              </p>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 lg:hover:bg-white/40 hover:text-emerald-800 transition-colors text-sm cursor-pointer"
            >
              <ExternalLink size={18} className="text-slate-500 shrink-0" />
              <span
                className={`whitespace-nowrap ${
                  !isSidebarOpen ? "opacity-0 lg:hidden" : ""
                }`}
              >
                Lihat Website
              </span>
            </a>
          </nav>

          {/* DUKUNGAN & BANTUAN TEKNIS DEVELOPER (PENGGANTI STATUS SISTEM) */}
          <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-lg shadow-emerald-900/10 transition-all shrink-0">
            {isSidebarOpen ? (
              <div className="flex flex-col text-left space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-amber-300">
                    <Headphones size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      Bantuan Teknis
                    </h4>
                    <p className="text-[10px] text-emerald-200">
                      Tim Pengembang Website
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-100/90 leading-snug">
                  Butuh bantuan operasional atau penambahan fitur baru?
                </p>
                <a
                  href={`https://wa.me/6285123456987?text=${encodeURIComponent(
                    `Halo Tim Pengembang Website ${shortName}, saya membutuhkan bantuan teknis terkait CMS.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <MessageCircle size={14} className="text-emerald-700" />
                  <span>Hubungi Tim Support</span>
                </a>
              </div>
            ) : (
              <a
                href={`https://wa.me/6285123456987?text=${encodeURIComponent(
                  `Halo Tim Pengembang Website ${shortName}, saya butuh bantuan.`
                )}`}
                target="_blank"
                rel="noreferrer"
                title="Hubungi Tim Support"
                className="hidden lg:flex w-10 h-10 mx-auto rounded-xl bg-white/20 hover:bg-white text-white hover:text-emerald-900 items-center justify-center transition-all cursor-pointer"
              >
                <Headphones size={18} />
              </a>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col h-full overflow-hidden w-full min-w-0">
          {/* TOP HEADER */}
          <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-white/80 sticky top-0 z-30 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-emerald-800 border border-slate-200/80 shadow-sm transition-all cursor-pointer"
                aria-label="Toggle Sidebar Menu"
              >
                <Menu size={20} />
              </button>

              <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-700 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari konten atau data pendaftar..."
                  className="w-64 lg:w-80 pl-10 pr-4 py-2 bg-white/50 border border-white/60 focus:border-emerald-600/50 focus:bg-white/80 rounded-xl outline-none text-sm transition-all shadow-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 md:gap-4">
              <button
                onClick={() => toast.info("Tidak ada notifikasi sistem baru.")}
                className="relative p-2 md:p-2.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors border border-white/60 text-slate-600 cursor-pointer"
                title="Notifikasi"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 rounded-full bg-emerald-600 border-2 border-white" />
              </button>

              <div className="h-7 w-px bg-slate-200 hidden sm:block" />

              {/* Profile Badge */}
              <div className="flex items-center gap-2 md:gap-3 p-1.5 rounded-xl bg-white/40 border border-white/60 shadow-sm">
                <img
                  src={adminUser.avatarUrl}
                  alt={adminUser.name}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-white shadow-sm object-cover shrink-0"
                />
                <div className="text-left hidden sm:block pr-2">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {adminUser.name}
                  </p>
                  <p className="text-[10px] text-emerald-800 font-semibold leading-tight">
                    {adminUser.role}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </header>

          {/* SCROLLABLE VIEW */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 overscroll-contain">
            <div className="max-w-7xl mx-auto pb-16">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center text-slate-500 font-medium">
          Memuat Dasbor Admin...
        </div>
      }
    >
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
