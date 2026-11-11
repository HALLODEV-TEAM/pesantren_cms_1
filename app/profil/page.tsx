import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/landing/TopBar";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { getProfile } from "@/lib/data-service";
import { FadeIn, ScaleIn } from "@/components/ui/MotionWrapper";
import {
  CheckCircle2,
  Award,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Target,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Profil Pesantren - Pondok Pesantren Al-Ikhlas",
  description:
    "Profil lengkap Pondok Pesantren Al-Ikhlas, sejarah berdirinya pesantren, visi misi, profil pengasuh, dan sistem pendidikan Islam modern terpadu.",
};

export default async function ProfilPage() {
  const profile = await getProfile();

  const missionList = profile.mission
    ? profile.mission.split("\n").filter(Boolean)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar phone={profile.phone} email={profile.email} />
      <Navbar />

      <main className="flex-1">
        {/* HERO BANNER MATCHING SCREENSHOT */}
        <section className="relative bg-emerald-950 text-white pt-16 pb-28 md:pt-20 md:pb-36 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1548625361-195fe61a55c3?auto=format&fit=crop&w=1920&q=80"
              alt="Background pattern"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-900/90 to-emerald-900/60" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
            {/* Breadcrumb pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/50 text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                BERANDA
              </Link>
              <ChevronRight size={13} className="text-emerald-500" />
              <span className="text-amber-300">PROFIL PESANTREN</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-white mb-4">
              Profil Pesantren
            </h1>

            <p className="text-emerald-100 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Mengenal lebih dekat sejarah, visi misi, kepemimpinan, dan nilai-nilai luhur yang kami junjung tinggi dalam membina generasi rabbani.
            </p>
          </div>
        </section>

        {/* OVERLAPPING WHITE CONTAINER MATCHING SCREENSHOT */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-20 md:-mt-24 relative z-20 pb-20">
          <ScaleIn className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-12 space-y-12">
            {/* FEATURED PHOTO WITH CAPTION */}
            <div className="rounded-2xl overflow-hidden bg-slate-100 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1548625361-195fe61a55c3?auto=format&fit=crop&w=1200&q=80"
                alt="Pondok Pesantren Al-Ikhlas"
                className="w-full h-[320px] md:h-[460px] object-cover"
              />
              <div className="p-3 text-center text-xs text-slate-500 italic bg-slate-50 border-t border-slate-100">
                Pondok Pesantren Al-Ikhlas - Kompleks Pendidikan dan Masjid Jami'
              </div>
            </div>

            {/* SEJARAH & DESKRIPSI */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 tracking-wider uppercase">
                <span className="w-5 h-0.5 bg-amber-500 rounded-full" />
                <span>SEJARAH & KILAS BALIK</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-serif">
                Perjalanan Membangun Generasi Qur'ani
              </h2>
              <div className="prose-pesantren text-slate-600 space-y-4">
                <p>{profile.description}</p>
                <p>{profile.history}</p>
              </div>
            </div>

            {/* SAMBUTAN PENGASUH PONDOK */}
            <div
              id="pimpinan"
              className="bg-emerald-50/70 border border-emerald-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center"
            >
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden bg-white shadow-md border-2 border-emerald-200 shrink-0">
                <img
                  src={profile.leaderPhoto}
                  alt={profile.leaderName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 text-center md:text-left">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  SAMBUTAN PENGASUH
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 font-serif">
                  {profile.leaderName}
                </h3>
                <p className="text-xs font-semibold text-emerald-700">
                  {profile.leaderTitle} Pondok Pesantren Al-Ikhlas
                </p>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{profile.leaderWelcome}"
                </p>
              </div>
            </div>

            {/* VISI & MISI */}
            <div id="visi-misi" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {/* VISI */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-4 shadow-sm">
                  <Target size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">
                  Visi Pesantren
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {profile.vision}
                </p>
              </div>

              {/* MISI */}
              <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4 shadow-sm">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">
                  Misi Pesantren
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {missionList.map((m, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-700 shrink-0 mt-0.5"
                      />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* IDENTITAS RESMI LEMBAGA */}
            <div className="border-t border-slate-200 pt-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-700" />
                Data Pokok Kelembagaan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs text-slate-500 block mb-1">
                    Nama Resmi
                  </span>
                  <span className="font-bold text-slate-900">{profile.name}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs text-slate-500 block mb-1">
                    Akreditasi
                  </span>
                  <span className="font-bold text-emerald-800">
                    {profile.akreditasi}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs text-slate-500 block mb-1">
                    Nomor Statistik (NSPP)
                  </span>
                  <span className="font-bold font-mono text-slate-900">
                    {profile.nspp}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-2 md:col-span-3">
                  <span className="text-xs text-slate-500 block mb-1">
                    Alamat Lengkap
                  </span>
                  <span className="font-medium text-slate-900">
                    {profile.address}, Kec. {profile.district}, {profile.city},{" "}
                    {profile.province} - {profile.postalCode}
                  </span>
                </div>
              </div>
            </div>
          </ScaleIn>
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
