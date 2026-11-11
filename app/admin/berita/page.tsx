"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Star,
} from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AdminBeritaPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      setArticles(data);
    } catch {
      toast.error("Gagal memuat artikel");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?type=berita");
      if (res.ok) {
        const data = await res.json();
        const names = data.map((c: any) => c.name);
        setCategories(["Semua", ...names]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const openDeleteConfirm = (id: number, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Artikel",
      message: `Apakah Anda yakin ingin menghapus artikel "${title}"? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Gagal menghapus");
          toast.success("Artikel berhasil dihapus");
          fetchArticles();
        } catch {
          toast.error("Gagal menghapus artikel");
        }
      },
    });
  };

  const filtered = articles.filter((a) => {
    const matchCat =
      selectedCategory === "Semua" || a.category === selectedCategory;
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Kelola Berita & Artikel
          </h1>
          <p className="text-slate-500 text-sm">
            Publikasikan artikel, berita pondok, dan wawasan Islam dengan rich text editor.
          </p>
        </div>

        <Link
          href="/admin/berita/tambah"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} />
          <span>Tulis Artikel Baru</span>
        </Link>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul artikel..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 shadow-sm"
          />
        </div>
      </div>

      {/* TABLE LIST */}
      <div className="bg-white/50 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 bg-white/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Artikel</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    Memuat data artikel...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    Tidak ada artikel yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((art) => (
                  <tr
                    key={art.id}
                    className="hover:bg-white/60 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-100"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                            {art.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {art.excerpt}
                          </p>
                          {art.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 mt-1">
                              <Star size={11} fill="currentColor" /> Featured
                              Utama
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {art.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(art.publishedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          art.isPublished
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {art.isPublished ? "Terbit" : "Draf"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/berita/${art.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-emerald-800 border border-slate-200 shadow-sm cursor-pointer"
                          title="Lihat di Web"
                        >
                          <Eye size={15} />
                        </a>
                        <Link
                          href={`/admin/berita/edit/${art.id}`}
                          className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-emerald-800 border border-slate-200 shadow-sm cursor-pointer"
                          title="Edit Artikel"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          onClick={() => openDeleteConfirm(art.id, art.title)}
                          className="p-1.5 rounded-lg bg-white/80 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 shadow-sm cursor-pointer"
                          title="Hapus Artikel"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
