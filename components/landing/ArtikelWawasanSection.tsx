"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Folder, ArrowRight } from "lucide-react";
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

interface ArtikelWawasanSectionProps {
  articles: Article[];
}

export default function ArtikelWawasanSection({
  articles,
}: ArtikelWawasanSectionProps) {
  if (!articles || articles.length === 0) return null;

  // Take up to 4 articles for this section
  const displayArticles = articles.slice(0, 4);

  const formatDate = (dateStr: string | Date): string => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <section className="py-20 bg-slate-50/50 border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* HEADER */}
        <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-amber-600 tracking-wider uppercase mb-2">
              <span className="w-6 h-0.5 bg-amber-500 rounded-full" />
              <span>WAWASAN</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
              Artikel Terbaru
            </h2>
          </div>

          <Link
            href="/berita"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 hover:border-emerald-700 bg-white hover:bg-emerald-50/60 text-slate-700 hover:text-emerald-800 text-sm font-semibold transition-all shadow-sm w-fit group"
          >
            <span>Artikel lainnya</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </FadeIn>

        {/* 4-COLUMN CARDS GRID MATCHING SCREENSHOT */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayArticles.map((article) => {
            const imgSrc = article.coverImage || (article as any).imageUrl;
            return (
              <StaggerItem key={article.id}>
                <HoverCard className="h-full">
                  <Link
                    href={`/berita/${article.slug}`}
                    className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300"
                  >
                    <div className="h-48 overflow-hidden bg-slate-100 relative">
                      <img
                        src={imgSrc}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2.5">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar size={13} className="text-emerald-700" />
                            {formatDate(article.publishedAt)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-emerald-700">
                            <Folder size={13} />
                            {article.category}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-800 text-base leading-snug line-clamp-2 transition-colors font-serif">
                          {article.title}
                        </h3>

                        <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                        <span>Baca selengkapnya</span>
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
