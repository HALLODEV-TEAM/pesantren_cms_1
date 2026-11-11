"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ArrowUp,
} from "lucide-react";
import { useProfileQuery } from "@/hooks/useApiQueries";

interface Profile {
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  whatsapp: string;
  email: string;
}

interface FooterProps {
  profile?: Partial<Profile>;
}

export default function Footer({ profile = {} }: FooterProps) {
  const { data: profileQuery } = useProfileQuery();
  const currentProfile = profileQuery || profile;

  const p = {
    name: currentProfile.name || "Pondok Pesantren Al-Ikhlas",
    shortName: (currentProfile as any).shortName || "Al-Ikhlas",
    logoUrl: (currentProfile as any).logoUrl,
    description:
      currentProfile.description ||
      "Pondok Pesantren Al-Ikhlas membangun generasi santri berprestasi, berbudi luhur, dan berakhlak mulia. Kami adalah pondok modern yang memiliki kurikulum terkini dengan berpegang teguh pada Al-Qur'an dan Sunnah.",
    address: currentProfile.address || "Jl. Pesantren No. 45, Harjamukti",
    city: currentProfile.city || "Kota Cirebon",
    province: currentProfile.province || "Jawa Barat",
    phone: currentProfile.phone || "0231-1234567",
    whatsapp: currentProfile.whatsapp || "6285123456987",
    email: currentProfile.email || "pesantren@domain.com",
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0b4832] text-white pt-16 pb-8 border-t border-emerald-950/60 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-emerald-800/60">
          {/* COLUMN 1: TENTANG KAMI (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {p.logoUrl ? (
                <img
                  src={p.logoUrl}
                  alt={p.name}
                  className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-emerald-500/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-white ring-2 ring-emerald-600/30">
                  <svg className="w-5 h-5 fill-amber-300" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79.09-.39.46-.66.86-.64.44.02.77.38.74.82-.07.51-.11 1.05-.11 1.61 0 3.31 2.69 6 6 6 .56 0 1.1-.04 1.61-.11.44-.03.8.3.82.74.02.4-.25.77-.64.86-.58.13-1.17.21-1.79.21zM12 4c.55 0 1 .45 1 1v1.07c1.78.36 3.19 1.77 3.55 3.55H18c.55 0 1 .45 1 1s-.45 1-1 1h-1.45c-.36 1.78-1.77 3.19-3.55 3.55V17c0 .55-.45 1-1 1s-1-.45-1-1v-1.83c-1.78-.36-3.19-1.77-3.55-3.55H7c-.55 0-1-.45-1-1s.45-1 1-1h1.45c.36-1.78 1.77-3.19 3.55-3.55V5c0-.55.45-1 1-1z" />
                  </svg>
                </div>
              )}
              <h4 className="text-lg font-bold text-white tracking-wide">
                {p.name}
              </h4>
            </div>
            <p className="text-emerald-100/80 text-sm leading-relaxed pr-0 lg:pr-6">
              {p.description}
            </p>
            <div className="flex items-start gap-3 pt-2 text-sm text-emerald-100/90">
              <MapPin size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <span>
                {p.address}, {p.city}, {p.province}, Indonesia
              </span>
            </div>
          </div>

          {/* COLUMN 2: HALAMAN (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-lg font-bold text-white tracking-wide">
              Halaman
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li>
                <Link
                  href="/profil"
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <ChevronRight size={14} className="text-amber-400" />
                  <span>Tentang Kami</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/profil#visi-misi"
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <ChevronRight size={14} className="text-amber-400" />
                  <span>Visi Misi</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/pendidikan"
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <ChevronRight size={14} className="text-amber-400" />
                  <span>Program Pendidikan</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/berita"
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <ChevronRight size={14} className="text-amber-400" />
                  <span>Berita & Kabar Pondok</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/pendaftaran"
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <ChevronRight size={14} className="text-amber-400" />
                  <span>Pendaftaran PSB Online</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: HUBUNGI KAMI (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-lg font-bold text-white tracking-wide">
              Hubungi Kami
            </h4>

            <div className="space-y-3 text-sm text-emerald-100/90">
              <a
                href={`tel:${p.phone}`}
                className="flex items-center gap-3 hover:text-amber-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-800/80 flex items-center justify-center shrink-0">
                  <Phone size={15} className="text-amber-400" />
                </div>
                <span>{p.phone}</span>
              </a>

              <a
                href={`https://wa.me/${p.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:text-amber-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-800/80 flex items-center justify-center shrink-0">
                  {/* WhatsApp SVG */}
                  <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                  </svg>
                </div>
                <span>{p.whatsapp}</span>
              </a>

              <a
                href={`mailto:${p.email}`}
                className="flex items-center gap-3 hover:text-amber-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-800/80 flex items-center justify-center shrink-0">
                  <Mail size={15} className="text-amber-400" />
                </div>
                <span>{p.email}</span>
              </a>
            </div>

            {/* Social media icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-emerald-800/90 hover:bg-amber-500 hover:text-emerald-950 text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-emerald-800/90 hover:bg-amber-500 hover:text-emerald-950 text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-emerald-800/90 hover:bg-amber-500 hover:text-emerald-950 text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.57V8.5a8.28 8.28 0 0 0 4.82 1.54V6.69h-1z" />
                </svg>
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X Twitter"
                className="w-9 h-9 rounded-full bg-emerald-800/90 hover:bg-amber-500 hover:text-emerald-950 text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-emerald-800/90 hover:bg-amber-500 hover:text-emerald-950 text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR & BACK TO TOP BUTTON */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/80">
          <p>© 2026 {p.name} - All rights reserved.</p>

          <button
            onClick={scrollToTop}
            aria-label="Kembali ke atas"
            className="w-10 h-10 rounded-full bg-emerald-800/80 hover:bg-amber-400 hover:text-emerald-950 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
