"use client";

import React from "react";
import { X, Eye } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";
import { useGalleryQuery } from "@/hooks/useApiQueries";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/ui/MotionWrapper";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description?: string | null;
}

export default function GaleriClientView({ items: initialItems }: { items: GalleryItem[] }) {
  const {
    activeGalleryCategory,
    setActiveGalleryCategory,
    lightbox,
    openLightbox,
    closeLightbox,
  } = useUIStore();

  const { data: queriedItems } = useGalleryQuery(
    activeGalleryCategory,
    initialItems as any
  );

  const items = queriedItems && queriedItems.length > 0 ? queriedItems : initialItems;

  const categories = ["Semua", "Kegiatan", "Fasilitas", "Santri", "Prestasi"];

  const filteredItems = (items || []).filter(
    (item) =>
      activeGalleryCategory === "Semua" || item.category === activeGalleryCategory
  );

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* CATEGORY TABS */}
      <FadeIn className="flex items-center gap-2 overflow-x-auto pb-4 justify-center">
        {categories.map((cat) => {
          const isSelected = activeGalleryCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveGalleryCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </FadeIn>

      {/* GRID */}
      {filteredItems.length === 0 ? (
        <FadeIn className="text-center py-20 bg-white rounded-3xl border border-slate-100 my-8 shadow-sm">
          <p className="text-slate-500 font-medium">
            Belum ada dokumentasi untuk kategori ini.
          </p>
        </FadeIn>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 pt-6">
          {filteredItems.map((item) => (
            <StaggerItem key={item.id}>
              <HoverCard>
                <div
                  onClick={() =>
                    openLightbox({
                      imageUrl: item.imageUrl,
                      title: item.title,
                      category: item.category,
                    })
                  }
                  className="group relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl border border-slate-200/80 transition-all duration-300 cursor-pointer"
                >
                  <div className="h-64 overflow-hidden bg-slate-100 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Eye size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white border-t border-slate-100">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* LIGHTBOX MODAL */}
      {lightbox.isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
            <div className="max-h-[70vh] bg-slate-950 flex items-center justify-center">
              <img
                src={lightbox.imageUrl}
                alt={lightbox.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="p-6 bg-white">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {lightbox.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {lightbox.title}
              </h2>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
