import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/landing/TopBar";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { getProfile, getPrograms } from "@/lib/data-service";
import { ChevronRight, Check, ArrowRight, GraduationCap } from "lucide-react";
import { FadeIn, ScaleIn } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Program & Jenjang Pendidikan - Pondok Pesantren Al-Ikhlas",
  description:
    "Jenjang pendidikan formal dan non-formal di Pondok Pesantren Al-Ikhlas: TK Islam, MI, MTs, MA, dan Program Takhassus Tahfidz Al-Qur'an 30 Juz.",
};

export default async function PendidikanPage() {
  const [profile, programs] = await Promise.all([
    getProfile(),
    getPrograms(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar phone={profile.phone} email={profile.email} />
      <Navbar />

      <main className="flex-1">
        {/* HERO BANNER */}
        <section className="bg-emerald-950 text-white py-14 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 opacity-90" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/50 text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                BERANDA
              </Link>
              <ChevronRight size={13} className="text-emerald-500" />
              <span className="text-amber-300">PENDIDIKAN</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold font-serif tracking-tight text-white mb-3">
              Program & Jenjang Pendidikan
            </h1>
            <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base">
              Kurikulum terpadu nasional dan kepesantrenan untuk mewujudkan santri yang unggul spiritual, moral, dan intelektual.
            </p>
          </div>
        </section>

        {/* PROGRAM CARDS */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="space-y-12">
            {programs.map((prog, index) => {
              const isEven = index % 2 === 1;
              const featureList = prog.features
                ? prog.features.split("\n").filter(Boolean)
                : [];

              return (
                <FadeIn
                  key={prog.id}
                  id={prog.slug}
                  className={`bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 md:p-10 ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`lg:col-span-5 relative rounded-2xl overflow-hidden shadow-md h-64 md:h-80 bg-emerald-900 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <img
                      src={prog.imageUrl}
                      alt={prog.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 shadow">
                        {prog.level}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`lg:col-span-7 space-y-4 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      <GraduationCap size={15} />
                      <span>{prog.level}</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-serif">
                      {prog.name}
                    </h2>

                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-sm">
                      <h4 className="font-bold text-emerald-900 mb-1">
                        Kurikulum & Metode Pengajaran:
                      </h4>
                      <p className="text-slate-700 text-xs sm:text-sm">
                        {prog.curriculum}
                      </p>
                    </div>

                    {featureList.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        {featureList.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs font-medium text-slate-700"
                          >
                            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <Check size={11} strokeWidth={3} />
                            </div>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <Link
                        href="/pendaftaran"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        <span>Daftar {prog.name}</span>
                        <ArrowRight size={14} />
                      </Link>

                      <Link
                        href={`/pendidikan/${prog.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
                      >
                        Detail Kurikulum
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </section>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
