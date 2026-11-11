"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Folder, ArrowRight, Search } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";
import { useArticlesQuery } from "@/hooks/useApiQueries";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/ui/MotionWrapper";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage?: string;
  imageUrl?: string;
  publishedAt: string | Date;
}

export default function BeritaClientView({ articles: initialArticles }: { articles: Article[] }) {
  const { activeNewsCategory, setActiveNewsCategory, newsSearchQuery, setNewsSearchQuery } = useUIStore();
  const { data: queriedArticles, isLoading } = useArticlesQuery(
    activeNewsCategory,
    initialArticles as any
  );

  const articles = queriedArticles && queriedArticles.length > 0 ? queriedArticles : initialArticles;

  const categories = [
    "Semua",
    "Berita Terbaru",
    "Kegiatan Pondok",
    "Wawasan",
    "Pengumuman",
  ];

  const formatDate = (dateStr: string | Date): string => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return String(dateStr);
    }
  };

  const filteredArticles = (articles || []).filter((art) => {
    const matchCategory =
      activeNewsCategory === "Semua" || art.category === activeNewsCategory;
    const q = newsSearchQuery.toLowerCase();
    const matchSearch =
      art.title.toLowerCase().includes(q) ||
      (art.excerpt && art.excerpt.toLowerCase().includes(q));
    return matchCategory && matchSearch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* FILTER & SEARCH */}
      <FadeIn className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeNewsCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveNewsCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={newsSearchQuery}
            onChange={(e) => setNewsSearchQuery(e.target.value)}
            placeholder="Cari artikel berita..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all shadow-sm"
          />
        </div>
      </FadeIn>

      {/* ARTICLES GRID */}
      {filteredArticles.length === 0 ? (
        <FadeIn className="text-center py-20 bg-white rounded-3xl border border-slate-100 my-8 shadow-sm">
          <p className="text-slate-500 font-medium">
            Tidak ada artikel atau berita yang sesuai dengan pencarian Anda.
          </p>
        </FadeIn>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
          {filteredArticles.map((article) => {
            const imgSrc = article.coverImage || (article as any).imageUrl;
            return (
              <StaggerItem key={article.id}>
                <HoverCard className="h-full">
                  <Link
                    href={`/berita/${article.slug}`}
                    className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300"
                  >
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      <img
                        src={imgSrc}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 shadow-sm">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
                          <Calendar size={13} />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>

                        <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug font-serif">
                          {article.title}
                        </h3>

                        <p className="text-sm text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                        <span>Baca Berita Lengkap</span>
                        <ArrowRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </Link>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </section>
  );
}
