"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  Sprout,
  ArrowRight,
} from "lucide-react";
import { useBannersQuery } from "@/hooks/useApiQueries";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  highlight1?: string | null;
  highlight2?: string | null;
  highlight3?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  order?: number;
  isActive?: boolean;
}

interface HeroSliderProps {
  banners: Banner[];
}

export default function HeroSlider({ banners: initialBanners }: HeroSliderProps) {
  const { data: queriedBanners } = useBannersQuery(initialBanners as any);
  const banners = (queriedBanners && queriedBanners.length > 0) ? queriedBanners : initialBanners;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 6 seconds
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const safeIndex = currentIndex < banners.length ? currentIndex : 0;
  const current: any = banners[safeIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full min-h-[580px] md:min-h-[640px] lg:min-h-[680px] overflow-hidden bg-emerald-950 flex items-center select-none">
      {/* BACKGROUND IMAGE WITH OVERLAYS */}
      {banners.map((b, idx) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === safeIndex ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
          } transition-transform duration-1000`}
        >
          <img
            src={b.imageUrl}
            alt={b.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-layered gradient overlay for high contrast and elegance */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-900/40" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}

      {/* FOREGROUND CONTENT WITH FRAMER MOTION ANIMATION */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 py-16 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl lg:max-w-3xl space-y-6 text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold tracking-wider uppercase"
            >
              <span>Pondok Pesantren Al-Ikhlas</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] font-serif"
            >
              {current.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-emerald-100/90 leading-relaxed max-w-xl"
            >
              {current.subtitle}
            </motion.p>

            {/* 3 HIGHLIGHT PILLARS MATCHING SCREENSHOT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 pb-2"
            >
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-900/60 backdrop-blur-md border border-emerald-500/30 text-emerald-50 shadow-sm hover:border-amber-400/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-amber-300">
                  <BookOpen size={20} />
                </div>
                <span className="text-xs sm:text-sm font-medium leading-snug">
                  {current.highlight1 || "Ilmu Berlandaskan Al-Qur'an"}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-900/60 backdrop-blur-md border border-emerald-500/30 text-emerald-50 shadow-sm hover:border-amber-400/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-amber-300">
                  <Users size={20} />
                </div>
                <span className="text-xs sm:text-sm font-medium leading-snug">
                  {current.highlight2 || "Pembinaan Akhlak Mulia"}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-900/60 backdrop-blur-md border border-emerald-500/30 text-emerald-50 shadow-sm hover:border-amber-400/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 text-amber-300">
                  <Sprout size={20} />
                </div>
                <span className="text-xs sm:text-sm font-medium leading-snug">
                  {current.highlight3 || "Kemandirian untuk Masa Depan"}
                </span>
              </div>
            </motion.div>

            {/* ACTION BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                href={current.buttonLink || "/pendaftaran"}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm md:text-base shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <span>{current.buttonText || "Daftar Santri Baru"}</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/profil"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold text-sm md:text-base transition-all active:scale-95"
              >
                Tentang Pesantren
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* NAVIGATION ARROWS */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-emerald-950 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-emerald-950 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* SLIDE INDICATOR DOTS */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === safeIndex
                  ? "w-8 bg-amber-400 shadow"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
