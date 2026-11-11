"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, ArrowRight, Eye } from "lucide-react";
import { FadeIn, HoverCard } from "@/components/ui/MotionWrapper";
import { useUIStore } from "@/stores/useUIStore";
import { useGalleryQuery } from "@/hooks/useApiQueries";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description?: string | null;
}

interface GaleriSectionProps {
  items: GalleryItem[];
}

export default function GaleriSection({ items: initialItems }: GaleriSectionProps) {
  const { data: queriedItems } = useGalleryQuery("Semua", initialItems as any);
  const items = (queriedItems && queriedItems.length > 0) ? queriedItems : initialItems;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { lightbox, openLightbox, closeLightbox } = useUIStore();

  if (!items || items.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* HEADER */}
        <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-amber-600 tracking-wider uppercase mb-2">
              <span className="w-6 h-0.5 bg-amber-500 rounded-full" />
              <span>DOKUMENTASI</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
              Gallery Kegiatan
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/galeri"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 mr-2"
            >
              Lihat Semua Galeri <ArrowRight size={15} />
            </Link>

            <button
              onClick={() => scroll("left")}
              aria-label="Scroll Galeri Kiri"
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-sm transition-transform active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll Galeri Kanan"
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-sm transition-transform active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </FadeIn>

        {/* HORIZONTAL SCROLL CAROUSEL */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox({ imageUrl: item.imageUrl, title: item.title, category: item.category })}
              className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[360px] h-[240px] sm:h-[260px] rounded-3xl overflow-hidden relative group cursor-pointer shadow-md border border-slate-200/60 bg-slate-100"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold line-clamp-1">{item.title}</h4>
                <div className="flex items-center gap-1.5 text-xs text-emerald-200 mt-2 font-medium">
                  <Eye size={13} />
                  <span>Klik untuk perbesar</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightbox.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 text-white">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  {lightbox.category}
                </span>
                <h3 className="font-bold text-base md:text-lg">{lightbox.title}</h3>
              </div>
              <button
                onClick={closeLightbox}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex-1 bg-black flex items-center justify-center p-2 min-h-[300px]">
              <img
                src={lightbox.imageUrl}
                alt={lightbox.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
