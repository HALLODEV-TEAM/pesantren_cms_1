"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FadeIn, FadeInLeft, FadeInRight } from "@/components/ui/MotionWrapper";

interface Profile {
  name: string;
  description: string;
  address: string;
  district: string;
  city: string;
  nspp?: string | null;
  akreditasi: string;
  leaderName: string;
  leaderTitle: string;
  leaderPhoto: string;
}

interface TentangKamiSectionProps {
  profile: Profile;
}

export default function TentangKamiSection({
  profile,
}: TentangKamiSectionProps) {
  return (
    <section className="py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* SECTION HEADER */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-amber-600 tracking-widest uppercase mb-3">
            <span className="w-8 h-0.5 bg-amber-500 rounded-full" />
            <span>TENTANG KAMI</span>
            <span className="w-8 h-0.5 bg-amber-500 rounded-full" />
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-serif mb-5">
            {profile.name}
          </h2>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            {profile.description}
          </p>
        </FadeIn>

        {/* 2-COLUMN CONTENT: PENGASUH PHOTO & IDENTITY TABLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT: PENGASUH PHOTO WITH OFFSET BADGE */}
          <FadeInLeft className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Offset mint/slate decorative background */}
              <div className="absolute -inset-3 bg-emerald-50 rounded-[2.5rem] -rotate-1 pointer-events-none border border-emerald-100" />

              <div className="relative rounded-[2rem] overflow-hidden bg-slate-100 shadow-xl border-4 border-white group">
                <img
                  src={profile.leaderPhoto}
                  alt={profile.leaderName}
                  className="w-full h-[380px] md:h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Floating identity pill at bottom of photo matching screenshot */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 text-center">
                  <h3 className="font-bold text-slate-900 text-base md:text-lg leading-tight">
                    {profile.leaderName}
                  </h3>
                  <p className="text-xs md:text-sm text-emerald-700 font-semibold mt-0.5">
                    {profile.leaderTitle}
                  </p>
                </div>
              </div>
            </div>
          </FadeInLeft>

          {/* RIGHT: IDENTITY TABLE CARD */}
          <FadeInRight className="lg:col-span-7">
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-600" size={22} />
                Identitas Resmi Lembaga
              </h3>

              <div className="divide-y divide-slate-200/70 rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <div className="grid grid-cols-3 sm:grid-cols-4 p-4 text-sm hover:bg-slate-50/50 transition-colors">
                  <span className="font-semibold text-slate-500">Nama</span>
                  <span className="col-span-2 sm:col-span-3 font-bold text-slate-900">
                    {profile.name}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 p-4 text-sm bg-slate-50/40 hover:bg-slate-50 transition-colors">
                  <span className="font-semibold text-slate-500">Alamat</span>
                  <span className="col-span-2 sm:col-span-3 text-slate-800">
                    {profile.address}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 p-4 text-sm hover:bg-slate-50/50 transition-colors">
                  <span className="font-semibold text-slate-500">Kecamatan</span>
                  <span className="col-span-2 sm:col-span-3 text-slate-800">
                    {profile.district}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 p-4 text-sm bg-slate-50/40 hover:bg-slate-50 transition-colors">
                  <span className="font-semibold text-slate-500">Kab/Kota</span>
                  <span className="col-span-2 sm:col-span-3 text-slate-800">
                    {profile.city}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 p-4 text-sm hover:bg-slate-50/50 transition-colors">
                  <span className="font-semibold text-slate-500">Akreditasi</span>
                  <span className="col-span-2 sm:col-span-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {profile.akreditasi}
                    </span>
                  </span>
                </div>

                {profile.nspp && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 p-4 text-sm bg-slate-50/40 hover:bg-slate-50 transition-colors">
                    <span className="font-semibold text-slate-500">NSPP</span>
                    <span className="col-span-2 sm:col-span-3 font-mono text-slate-800">
                      {profile.nspp}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-slate-500">
                  Terdaftar resmi di Kementerian Agama Republik Indonesia
                </p>
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 group"
                >
                  <span>Selengkapnya tentang profil kami</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </FadeInRight>
        </div>
      </div>
    </section>
  );
}
