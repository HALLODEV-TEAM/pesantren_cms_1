"use client";

import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Folder } from "lucide-react";
import { FadeIn, FadeInLeft, FadeInRight, HoverCard } from "@/components/ui/MotionWrapper";
import { useArticlesQuery } from "@/hooks/useApiQueries";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage?: string;
  imageUrl?: string;
  publishedAt: string | Date;
  isFeatured?: boolean;
}

interface BeritaTerbaruSectionProps {
  articles: Article[];
}

export default function BeritaTerbaruSection({
  articles: initialArticles,
}: BeritaTerbaruSectionProps) {
  const { data: queriedArticles } = useArticlesQuery("Semua", initialArticles as any);
  const articles = (queriedArticles && queriedArticles.length > 0) ? queriedArticles : initialArticles;

  if (!articles || articles.length === 0) return null;

  // Find featured or take first as featured
  const featured =
    articles.find((a: any) => a.isFeatured) || articles[0];
  const listItems = articles
    .filter((a: any) => a.id !== featured.id)
    .slice(0, 4);

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

  const featuredImg = featured.coverImage || (featured as any).imageUrl;

  return (
    <section className="py-20 bg-slate-50/60 border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* SECTION HEADER */}
        <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-emerald-800 tracking-wider uppercase mb-2">
              <span className="w-6 h-0.5 bg-emerald-600 rounded-full" />
              <span>KABAR PESANTREN</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
              Berita Terbaru
            </h2>
          </div>

          <Link
            href="/berita"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 hover:border-emerald-700 bg-white hover:bg-emerald-50/60 text-slate-700 hover:text-emerald-800 text-sm font-semibold transition-all shadow-sm w-fit group"
          >
            <span>Berita lainnya</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </FadeIn>

        {/* 2-COLUMN LAYOUT MATCHING SCREENSHOT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT: FEATURED BIG CARD */}
          <FadeInLeft className="lg:col-span-6 flex flex-col">
            <Link
              href={`/berita/${featured.slug}`}
              className="group relative flex-1 min-h-[420px] md:min-h-[480px] rounded-3xl overflow-hidden shadow-lg border border-slate-200/60 bg-emerald-950 flex flex-col justify-end p-6 md:p-8"
            >
              <img
                src={featuredImg}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 shadow-sm">
                    {featured.category}
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                    <Calendar size={13} />
                    {formatDate(featured.publishedAt)}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug font-serif">
                  {featured.title}
                </h3>

                <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {featured.excerpt}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                  <span>Baca selengkapnya</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </FadeInLeft>

          {/* RIGHT: 4 SMALL RECENT NEWS ITEMS */}
          <FadeInRight className="lg:col-span-6 flex flex-col gap-3.5">
            {listItems.map((article) => {
              const itemImg = article.coverImage || (article as any).imageUrl;
              return (
                <HoverCard key={article.id}>
                  <Link
                    href={`/berita/${article.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={itemImg}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <Folder size={12} />
                          {article.category}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-800 text-sm sm:text-base leading-snug line-clamp-2 transition-colors">
                        {article.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                </HoverCard>
              );
            })}
          </FadeInRight>
        </div>
      </div>
    </section>
  );
}
