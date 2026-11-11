"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, UserPlus, FileText, CheckCircle2 } from "lucide-react";
import { ScaleIn } from "@/components/ui/MotionWrapper";

export default function CTASection() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ScaleIn>
          <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-8 md:p-14 shadow-xl relative overflow-hidden">
            {/* Decorative shapes */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-bold uppercase tracking-wider">
                <span>PSB TAHUN AJARAN 2026/2027</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white font-serif leading-tight">
                Penerimaan Santri Baru Telah Dibuka
              </h2>

              <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
                Bergabunglah bersama keluarga besar Pondok Pesantren Al-Ikhlas. Raih masa depan gemilang dengan bekal ilmu syar'i, tahfidzul Qur'an mutqin, serta wawasan sains teknologi modern.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs md:text-sm font-semibold text-emerald-50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-300 shrink-0" />
                  <span>Pendaftaran Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-300 shrink-0" />
                  <span>Asrama Representatif</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-300 shrink-0" />
                  <span>Beasiswa Prestasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-300 shrink-0" />
                  <span>Pengajar Bersanad</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/pendaftaran"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm md:text-base shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <UserPlus size={18} />
                  <span>Isi Formulir Pendaftaran</span>
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/kontak"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-900/60 hover:bg-emerald-900 text-white border border-emerald-400/40 text-sm md:text-base font-semibold transition-colors"
                >
                  <FileText size={18} />
                  <span>Konsultasi & Kontak</span>
                </Link>
              </div>
            </div>
          </div>
        </ScaleIn>
      </div>
    </section>
  );
}
