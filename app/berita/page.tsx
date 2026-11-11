import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/landing/TopBar";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { getProfile, getArticles } from "@/lib/data-service";
import { ChevronRight } from "lucide-react";
import BeritaClientView from "./BeritaClientView";

export const metadata: Metadata = {
  title: "Berita & Kabar Pesantren - Pondok Pesantren Al-Ikhlas",
  description:
    "Kumpulan berita, informasi kegiatan, agenda pondok, dan artikel wawasan keislaman terkini dari Pondok Pesantren Al-Ikhlas.",
};

export default async function BeritaPage() {
  const [profile, articles] = await Promise.all([
    getProfile(),
    getArticles(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar phone={profile.phone} email={profile.email} />
      <Navbar />

      <main className="flex-1">
        {/* HEADER BANNER */}
        <section className="bg-emerald-950 text-white py-14 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 opacity-90" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/50 text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                BERANDA
              </Link>
              <ChevronRight size={13} className="text-emerald-500" />
              <span className="text-amber-300">BERITA & ARTIKEL</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold font-serif tracking-tight text-white mb-3">
              Kabar & Wawasan Pesantren
            </h1>
            <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base">
              Ikuti kabar terbaru seputar kegiatan santri, agenda dakwah, serta wawasan keislaman terkini.
            </p>
          </div>
        </section>

        {/* CLIENT FILTER & SEARCH VIEW */}
        <BeritaClientView articles={articles} />
      </main>

      <Footer profile={profile} />
    </div>
  );
}
