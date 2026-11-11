import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TopBar from "@/components/landing/TopBar";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  getProfile,
  getArticleBySlug,
  getArticles,
} from "@/lib/data-service";
import {
  Calendar,
  Folder,
  User,
  Eye,
  ChevronRight,
  Share2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan - Pondok Pesantren Al-Ikhlas",
    };
  }

  return {
    title: `${article.title} - Pondok Pesantren Al-Ikhlas`,
    description: article.excerpt,
    keywords: [
      article.title,
      article.category,
      "Pesantren Al-Ikhlas",
      "Kabar Pesantren",
      "Berita Pesantren",
    ],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      images: [
        {
          url: article.imageUrl,
          width: 800,
          height: 500,
          alt: article.title,
        },
      ],
      publishedTime: new Date(article.publishedAt).toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [profile, article, recentArticles] = await Promise.all([
    getProfile(),
    getArticleBySlug(slug),
    getArticles({ limit: 4 }),
  ]);

  if (!article) {
    notFound();
  }

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

  const otherArticles = recentArticles.filter((a) => a.id !== article.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar phone={profile.phone} email={profile.email} />
      <Navbar />

      <main className="flex-1 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Beranda
            </Link>
            <ChevronRight size={13} />
            <Link
              href="/berita"
              className="hover:text-emerald-700 transition-colors"
            >
              Berita
            </Link>
            <ChevronRight size={13} />
            <span className="text-emerald-800 font-semibold truncate max-w-xs md:max-w-md">
              {article.title}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* MAIN ARTICLE BODY (8 cols) */}
            <article className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-sm">
              {/* Category & Date badge */}
              <div className="flex items-center gap-3 text-xs mb-4 flex-wrap">
                <span className="px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800">
                  {article.category}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar size={13} className="text-emerald-700" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <User size={13} className="text-emerald-700" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Eye size={13} className="text-emerald-700" />
                  {article.views} pembaca
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-serif leading-tight mb-6">
                {article.title}
              </h1>

              {/* Featured Image */}
              <div className="rounded-2xl overflow-hidden bg-slate-100 mb-8 shadow-sm">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-auto max-h-[460px] object-cover"
                />
              </div>

              {/* Rich Content */}
              <div
                className="prose-pesantren"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Share & Footer of article */}
              <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Share2 size={15} /> Bagikan:
                  </span>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      article.title +
                        " - " +
                        `https://pesantren-alikhlas.sch.id/berita/${article.slug}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      `https://pesantren-alikhlas.sch.id/berita/${article.slug}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Facebook
                  </a>
                </div>

                <Link
                  href="/berita"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-700"
                >
                  <ArrowLeft size={14} /> Kembali ke Berita
                </Link>
              </div>
            </article>

            {/* SIDEBAR (4 cols) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* PSB Mini Widget */}
              <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-sm">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  PENDAFTARAN SANTRI BARU
                </span>
                <h4 className="text-lg font-bold font-serif mb-2">
                  Telah Dibuka PSB 2026/2027
                </h4>
                <p className="text-xs text-emerald-100 leading-relaxed mb-4">
                  Daftarkan putra-putri Anda sekarang untuk mendapatkan pembinaan ilmu agama dan sains terbaik.
                </p>
                <Link
                  href="/pendaftaran"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-emerald-950 font-bold text-xs hover:bg-amber-300 transition-colors"
                >
                  Daftar Online Sekarang <ArrowRight size={13} />
                </Link>
              </div>

              {/* Recent news */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base mb-4 pb-2 border-b border-slate-100">
                  Berita Terkait Lainnya
                </h3>
                <div className="space-y-4">
                  {otherArticles.map((other) => (
                    <Link
                      key={other.id}
                      href={`/berita/${other.slug}`}
                      className="group flex items-start gap-3"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={other.imageUrl}
                          alt={other.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] text-slate-400 block mb-1">
                          {formatDate(other.publishedAt)}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 line-clamp-2 leading-snug transition-colors">
                          {other.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
