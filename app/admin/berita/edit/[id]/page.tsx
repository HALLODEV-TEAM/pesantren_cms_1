"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import CategorySelector from "@/components/ui/CategorySelector";
import ImageUploadInput from "@/components/ui/ImageUploadInput";

const RichTextEditor = dynamic(
  () => import("@/components/ui/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center text-xs text-slate-400">
        Memuat Rich Text Editor...
      </div>
    ),
  },
);

function EditBeritaContent({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Berita Terbaru",
    excerpt: "",
    content: "",
    imageUrl: "",
    author: "Admin Pesantren",
    isPublished: true,
    isFeatured: false,
  });

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data artikel");
        return res.json();
      })
      .then((data) => {
        setFormData({
          title: data.title,
          category: data.category,
          excerpt: data.excerpt,
          content: data.content,
          imageUrl: data.imageUrl,
          author: data.author || "Admin Pesantren",
          isPublished: data.isPublished,
          isFeatured: !!data.isFeatured,
        });
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        router.push("/admin/berita");
      });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error("Harap unggah atau masukkan URL foto sampul artikel");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan perubahan");
      toast.success("Perubahan artikel berhasil disimpan!");
      router.push("/admin/berita");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 animate-pulse">
        Memuat data artikel...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/berita"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Daftar Artikel</span>
        </Link>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-10 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6 font-serif">
          Edit Artikel Berita
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Judul Artikel *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-base font-medium shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Kategori Artikel *
              </label>
              <CategorySelector
                type="berita"
                value={formData.category}
                onChange={(cat) => setFormData({ ...formData, category: cat })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Nama Penulis / Redaksi
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
              />
            </div>
          </div>

          <div>
            <ImageUploadInput
              label="Foto Sampul Artikel (Featured Image) *"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              recommendedSize="1200 × 675 px (Rasio 16:9 Landscape)"
              maxSizeMb={3}
              aspectRatio="16:9"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Ringkasan / Excerpt Singkat *
            </label>
            <textarea
              required
              rows={3}
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Isi Konten Lengkap (Rich Text Editor) *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData({ ...formData, isPublished: e.target.checked })
                }
                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800">
                Terbitkan Sekarang (Published)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="w-4 h-4 text-amber-500 rounded cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800">
                Jadikan Berita Utama Pilihan (Featured Card di Depan)
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200 flex gap-4">
            <Link
              href="/admin/berita"
              className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save size={16} />
              <span>{saving ? "Menyimpan Perubahan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditBeritaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-slate-500 animate-pulse">
          Memuat artikel...
        </div>
      }
    >
      <EditBeritaContent id={id} />
    </Suspense>
  );
}
