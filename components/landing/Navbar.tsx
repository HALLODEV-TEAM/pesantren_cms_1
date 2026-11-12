"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  UserCheck,
  PhoneCall,
} from "lucide-react";
import { useProfileQuery } from "@/hooks/useApiQueries";

export default function Navbar() {
  const { data: profile } = useProfileQuery();
  const shortName = profile?.shortName || "AL-IKHLAS";
  const institutionType = profile?.institutionType || "Pondok Pesantren";
  const logoUrl = profile?.logoUrl;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePesantrenOpen, setMobilePesantrenOpen] = useState(true);
  const [mobilePendidikanOpen, setMobilePendidikanOpen] = useState(true);
  const [pesantrenDropdown, setPesantrenDropdown] = useState(false);
  const [pendidikanDropdown, setPendidikanDropdown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 ${
        isScrolled
          ? "shadow-md py-3 bg-white/95 backdrop-blur-md"
          : "py-4 border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={profile?.name || shortName}
              className="w-11 h-11 rounded-full object-cover shadow-md shadow-emerald-800/20 ring-2 ring-emerald-600/30 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-800/20 ring-2 ring-emerald-600/30 group-hover:scale-105 transition-transform">
              {/* Islamic crescent / mosque emblem icon */}
              <svg
                className="w-6 h-6 fill-amber-300"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79.09-.39.46-.66.86-.64.44.02.77.38.74.82-.07.51-.11 1.05-.11 1.61 0 3.31 2.69 6 6 6 .56 0 1.1-.04 1.61-.11.44-.03.8.3.82.74.02.4-.25.77-.64.86-.58.13-1.17.21-1.79.21zM12 4c.55 0 1 .45 1 1v1.07c1.78.36 3.19 1.77 3.55 3.55H18c.55 0 1 .45 1 1s-.45 1-1 1h-1.45c-.36 1.78-1.77 3.19-3.55 3.55V17c0 .55-.45 1-1 1s-1-.45-1-1v-1.83c-1.78-.36-3.19-1.77-3.55-3.55H7c-.55 0-1-.45-1-1s.45-1 1-1h1.45c.36-1.78 1.77-3.19 3.55-3.55V5c0-.55.45-1 1-1z" />
              </svg>
            </div>
          )}
          <div>
            <span className="text-[10px] tracking-widest font-semibold uppercase text-emerald-700 block leading-tight">
              {institutionType}
            </span>
            <span className="text-xl md:text-2xl font-black text-emerald-900 tracking-tight block leading-none">
              {shortName}
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Beranda */}
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              pathname === "/"
                ? "text-emerald-800 border-b-2 border-emerald-800 rounded-b-none"
                : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
            }`}
          >
            Beranda
          </Link>

          {/* Pesantren Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setPesantrenDropdown(true)}
            onMouseLeave={() => setPesantrenDropdown(false)}
          >
            <button
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname.startsWith("/profil")
                  ? "text-emerald-800 border-b-2 border-emerald-800 rounded-b-none"
                  : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
              }`}
            >
              Pesantren
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  pesantrenDropdown ? "rotate-180 text-emerald-700" : ""
                }`}
              />
            </button>

            {pesantrenDropdown && (
              <div className="absolute top-full left-0 w-56 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 mt-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                <Link
                  href="/profil"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors"
                >
                  <ShieldCheck size={16} className="text-emerald-600" />
                  Profil Pesantren
                </Link>
                <Link
                  href="/profil#visi-misi"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors"
                >
                  <Award size={16} className="text-emerald-600" />
                  Visi & Misi
                </Link>
                <Link
                  href="/profil#pimpinan"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors"
                >
                  <UserCheck size={16} className="text-emerald-600" />
                  Pengasuh & Pimpinan
                </Link>
                <Link
                  href="/profil#asatidz"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors"
                >
                  <Users size={16} className="text-emerald-600" />
                  Dewan Asatidz
                </Link>
              </div>
            )}
          </div>

          {/* Pendidikan Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setPendidikanDropdown(true)}
            onMouseLeave={() => setPendidikanDropdown(false)}
          >
            <button
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname.startsWith("/pendidikan")
                  ? "text-emerald-800 border-b-2 border-emerald-800 rounded-b-none"
                  : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
              }`}
            >
              Pendidikan
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  pendidikanDropdown ? "rotate-180 text-emerald-700" : ""
                }`}
              />
            </button>

            {pendidikanDropdown && (
              <div className="absolute top-full left-0 w-64 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 mt-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                <Link
                  href="/pendidikan/tk-islam"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors"
                >
                  <BookOpen size={16} className="text-emerald-600" />
                  TK Islam Terpadu
                </Link>
                <Link
                  href="/pendidikan/madrasah-ibtidaiyah"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors"
                >
                  <BookOpen size={16} className="text-emerald-600" />
                  Madrasah Ibtidaiyah (MI)
                </Link>
                <Link
                  href="/pendidikan/madrasah-tsanawiyah"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors"
                >
                  <BookOpen size={16} className="text-emerald-600" />
                  Madrasah Tsanawiyah (MTs)
                </Link>
                <Link
                  href="/pendidikan/madrasah-aliyah"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors"
                >
                  <BookOpen size={16} className="text-emerald-600" />
                  Madrasah Aliyah (MA)
                </Link>
                <Link
                  href="/pendidikan/tahfidz-al-quran"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors"
                >
                  <BookOpen size={16} className="text-emerald-600" />
                  Tahfidz Al-Qur'an 30 Juz
                </Link>
              </div>
            )}
          </div>

          {/* Gallery */}
          <Link
            href="/galeri"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              pathname === "/galeri"
                ? "text-emerald-800 border-b-2 border-emerald-800 rounded-b-none"
                : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
            }`}
          >
            Gallery
          </Link>

          {/* Berita */}
          <Link
            href="/berita"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              pathname.startsWith("/berita")
                ? "text-emerald-800 border-b-2 border-emerald-800 rounded-b-none"
                : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
            }`}
          >
            Berita
          </Link>

          {/* Pendaftaran */}
          <Link
            href="/pendaftaran"
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              pathname === "/pendaftaran"
                ? "text-emerald-800 border-b-2 border-emerald-800 rounded-b-none"
                : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
            }`}
          >
            Pendaftaran
          </Link>
        </nav>

        {/* RIGHT ACTION: Pendaftaran PSB + Hubungi Kami */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/pendaftaran"
            className="px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all"
          >
            Daftar Santri Baru
          </Link>
          <Link
            href="/kontak"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-emerald-700/30 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition-colors"
          >
            <PhoneCall size={14} className="text-emerald-700" />
            Hubungi Kami
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Buka navigasi menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE FULL DRAWER (FULL HEIGHT, SCROLLABLE & ACCORDION ENABLED) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            className="relative z-10 w-full max-h-screen flex flex-col bg-white shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* DRAWER HEADER WITH BRANDING & EXPLICIT CLOSE (X) BUTTON */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={shortName}
                    className="w-9 h-9 rounded-full object-cover shadow-sm ring-1 ring-emerald-600/30"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {shortName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block leading-tight">
                    {institutionType}
                  </span>
                  <span className="text-base font-black text-emerald-950 tracking-tight block leading-none">
                    {shortName}
                  </span>
                </div>
              </Link>

              {/* TOMBOL X (TUTUP MENU) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Tutup Menu Navigasi"
              >
                <X size={20} />
              </button>
            </div>

            {/* SCROLLABLE NAV BODY */}
            <div
              className="flex-1 px-5 pt-3 pb-8 space-y-3 overflow-y-auto overscroll-contain max-h-[calc(100vh-65px)]"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-base font-semibold text-slate-800 border-b border-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Beranda
              </Link>

              {/* Pesantren Accordion */}
              <div className="border-b border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => setMobilePesantrenOpen((prev) => !prev)}
                  className="w-full py-2.5 text-base font-semibold text-emerald-800 flex items-center justify-between cursor-pointer"
                >
                  <span>Pesantren</span>
                  <ChevronDown
                    size={16}
                    className={`text-emerald-700 transition-transform duration-200 ${
                      mobilePesantrenOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobilePesantrenOpen && (
                  <div className="pl-3 space-y-2 pt-1 text-sm text-slate-600 animate-in fade-in duration-150">
                    <Link
                      href="/profil"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-1 hover:text-emerald-700 cursor-pointer"
                    >
                      <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                      <span>Profil Pesantren</span>
                    </Link>
                    <Link
                      href="/profil#visi-misi"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-1 hover:text-emerald-700 cursor-pointer"
                    >
                      <Award size={14} className="text-emerald-600 shrink-0" />
                      <span>Visi & Misi</span>
                    </Link>
                    <Link
                      href="/profil#pimpinan"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-1 hover:text-emerald-700 cursor-pointer"
                    >
                      <UserCheck size={14} className="text-emerald-600 shrink-0" />
                      <span>Pengasuh Pondok</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Pendidikan Accordion */}
              <div className="border-b border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => setMobilePendidikanOpen((prev) => !prev)}
                  className="w-full py-2.5 text-base font-semibold text-emerald-800 flex items-center justify-between cursor-pointer"
                >
                  <span>Pendidikan</span>
                  <ChevronDown
                    size={16}
                    className={`text-emerald-700 transition-transform duration-200 ${
                      mobilePendidikanOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobilePendidikanOpen && (
                  <div className="pl-3 space-y-2 pt-1 text-sm text-slate-600 animate-in fade-in duration-150">
                    <Link
                      href="/pendidikan/tk-islam"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-1 hover:text-emerald-700 cursor-pointer"
                    >
                      <BookOpen size={14} className="text-emerald-600 shrink-0" />
                      <span>TK Islam</span>
                    </Link>
                    <Link
                      href="/pendidikan/madrasah-ibtidaiyah"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-1 hover:text-emerald-700 cursor-pointer"
                    >
                      <BookOpen size={14} className="text-emerald-600 shrink-0" />
                      <span>Madrasah Ibtidaiyah</span>
                    </Link>
                    <Link
                      href="/pendidikan/madrasah-tsanawiyah"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-1 hover:text-emerald-700 cursor-pointer"
                    >
                      <BookOpen size={14} className="text-emerald-600 shrink-0" />
                      <span>Madrasah Tsanawiyah</span>
                    </Link>
                    <Link
                      href="/pendidikan/madrasah-aliyah"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-1 hover:text-emerald-700 cursor-pointer"
                    >
                      <BookOpen size={14} className="text-emerald-600 shrink-0" />
                      <span>Madrasah Aliyah</span>
                    </Link>
                    <Link
                      href="/pendidikan/tahfidz-al-quran"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-1 hover:text-emerald-700 cursor-pointer"
                    >
                      <BookOpen size={14} className="text-emerald-600 shrink-0" />
                      <span>Tahfidz Al-Qur'an</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/galeri"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-base font-semibold text-slate-800 border-b border-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Gallery
              </Link>

              <Link
                href="/berita"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-base font-semibold text-slate-800 border-b border-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Berita
              </Link>

              <Link
                href="/pendaftaran"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-base font-semibold text-slate-800 border-b border-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Pendaftaran
              </Link>

              <div className="pt-3 pb-6 flex flex-col gap-2.5">
                <Link
                  href="/pendaftaran"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/20 active:scale-98 transition-all cursor-pointer"
                >
                  Daftar Santri Baru (PSB Online)
                </Link>
                <Link
                  href="/kontak"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-600/40 text-emerald-800 font-bold text-sm bg-emerald-50/70 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <PhoneCall size={16} />
                  <span>Hubungi Kami</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

