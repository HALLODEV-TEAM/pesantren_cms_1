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
import ConfirmModal from "@/components/ui/ConfirmModal";

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authChecking, setAuthChecking] = useState(pathname !== "/admin/login");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // Client-side authentication verification
  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthChecking(false);
      return;
    }

    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (!data.authenticated) {
            router.replace("/admin/login");
          } else {
            if (data.user) {
              setAdminUser({
                name: data.user.name || "KH. Ahmad Syahidin, M.A.",
                role: data.user.role || "Pengasuh & Admin",
                avatarUrl:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80",
              });
            }
            setAuthChecking(false);
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          router.replace("/admin/login");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

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

  // If still verifying auth, show a clean indicator
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center gap-3 text-slate-600">
        <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold tracking-wide text-slate-700">
          Memverifikasi sesi pengelola...
        </span>
      </div>
    );
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Berhasil keluar dari sesi pengelola.");
      setShowLogoutConfirm(false);
      router.push("/admin/login");
      router.refresh();
    } catch {
      setShowLogoutConfirm(false);
      router.push("/admin/login");
    } finally {
      setIsLoggingOut(false);
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

      {/* =========================================================================
          MOBILE DRAWER (lg:hidden) - DECOUPLED FROM DESKTOP TO PREVENT BLUR OVERLAY
          ========================================================================= */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isSidebarOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-slate-900/60 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-out Drawer Panel */}
        <div
          className={`relative z-10 flex flex-col h-full w-72 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Header with Brand & Close Button */}
          <div className="p-4 flex items-center justify-between border-b border-slate-100 shrink-0">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={profile?.name || shortName}
                  className="w-9 h-9 rounded-xl object-cover shadow-md shadow-emerald-700/20 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0 text-white font-bold text-sm">
                  {initials || "AI"}
                </div>
              )}
              <div className="leading-tight">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  {institutionType}
                </span>
                <span className="font-extrabold text-sm text-slate-900 block">
                  {shortName}
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup Menu Dasbor"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation links (Scrollable) */}
          <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  item.active
                    ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div
                  className={`${
                    item.active ? "text-emerald-800" : "text-slate-500"
                  } shrink-0`}
                >
                  {item.icon}
                </div>
                <span className="text-sm">{item.label}</span>
                {item.active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0" />
                )}
              </Link>
            ))}

            <div className="pt-3 pb-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3.5">
                Tautan Cepat
              </p>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-emerald-800 transition-colors text-sm cursor-pointer"
            >
              <ExternalLink size={18} className="text-slate-500 shrink-0" />
              <span>Lihat Website</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setIsSidebarOpen(false);
                handleLogoutClick();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-sm font-semibold cursor-pointer"
            >
              <LogOut size={18} className="text-rose-500 shrink-0" />
              <span>Keluar Sesi</span>
            </button>
          </nav>

          {/* Support / Helpdesk card on mobile */}
          <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-lg shrink-0">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-amber-300 shrink-0">
                <Headphones size={15} />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Bantuan Teknis</h4>
                <p className="text-[10px] text-emerald-200">
                  Tim Pengembang Website
                </p>
              </div>
            </div>
            <p className="text-[11px] text-emerald-100/90 mb-2 leading-snug">
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
        </div>
      </div>

      {/* =========================================================================
          MAIN CONTAINER: DESKTOP SIDEBAR + CONTENT
          ========================================================================= */}
      <div className="flex h-screen relative z-10 overflow-hidden">
        {/* DESKTOP SIDEBAR (hidden on mobile, visible on lg) */}
        <aside
          className={`hidden lg:flex flex-col h-full bg-white/50 backdrop-blur-2xl border-r border-white/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out shrink-0 overflow-x-hidden ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          {/* Desktop Logo & Header */}
          <div className="p-5 flex items-center justify-between border-b border-white/40">
            <Link
              href="/admin"
              className={`flex items-center gap-3 cursor-pointer ${
                !isSidebarOpen && "justify-center w-full"
              }`}
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
              {isSidebarOpen && (
                <span className="font-bold text-base leading-tight text-slate-900 whitespace-nowrap overflow-hidden">
                  {institutionType}
                  <br />
                  {shortName}
                </span>
              )}
            </Link>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer
                  ${
                    item.active
                      ? "bg-white/80 text-emerald-800 shadow-sm border border-white/80 font-bold"
                      : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
                  }
                  ${!isSidebarOpen ? "justify-center px-0" : ""}
                `}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <div
                  className={`${
                    item.active ? "text-emerald-800" : "text-slate-500"
                  } shrink-0`}
                >
                  {item.icon}
                </div>
                {isSidebarOpen && (
                  <span className="text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {item.active && isSidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0" />
                )}
              </Link>
            ))}

            <div className="pt-4 pb-1">
              <p
                className={`text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3.5 transition-opacity ${
                  !isSidebarOpen ? "hidden" : "block"
                }`}
              >
                Tautan Cepat
              </p>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-600 hover:bg-white/40 hover:text-emerald-800 transition-colors text-sm cursor-pointer ${
                !isSidebarOpen ? "justify-center px-0" : ""
              }`}
              title={!isSidebarOpen ? "Lihat Website" : undefined}
            >
              <ExternalLink size={18} className="text-slate-500 shrink-0" />
              {isSidebarOpen && (
                <span className="whitespace-nowrap">Lihat Website</span>
              )}
            </a>
          </nav>

          {/* Desktop Support Card */}
          <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-lg shadow-emerald-900/10 shrink-0">
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
                className="flex w-10 h-10 mx-auto rounded-xl bg-white/20 hover:bg-white text-white hover:text-emerald-900 items-center justify-center transition-all cursor-pointer"
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
                  onClick={handleLogoutClick}
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

      {/* CONFIRMATION MODAL LOGOUT */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Konfirmasi Keluar Sesi"
        message="Apakah Anda yakin ingin keluar dari panel pengelola CMS? Sesi aktif Anda akan diakhiri dan Anda perlu memasukkan kredensial admin kembali untuk masuk."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        variant="danger"
        isLoading={isLoggingOut}
        icon={<LogOut size={22} />}
      />
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
