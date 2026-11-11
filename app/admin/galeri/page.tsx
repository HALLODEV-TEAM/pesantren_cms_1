"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Camera, X, Eye } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CategorySelector from "@/components/ui/CategorySelector";
import ImageUploadInput from "@/components/ui/ImageUploadInput";

export default function AdminGaleriPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    message: "",
    action: async () => {},
  });

  const [formData, setFormData] = useState({
    title: "",
    category: "Kegiatan",
    imageUrl: "",
    description: "",
    order: 1,
  });

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      toast.error("Judul foto dan Berkas Gambar wajib diisi.");
      return;
    }

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan foto");
      toast.success("Foto berhasil ditambahkan ke galeri!");
      setIsModalOpen(false);
      setFormData({
        title: "",
        category: "Kegiatan",
        imageUrl: "",
        description: "",
        order: items.length + 1,
      });
      fetchGallery();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openDeleteConfirm = (id: number, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Foto Galeri?",
      message: `Apakah Anda yakin ingin menghapus dokumentasi foto "${title}"?`,
      action: async () => {
        try {
          const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Gagal menghapus");
          toast.success("Foto berhasil dihapus");
          fetchGallery();
        } catch {
          toast.error("Gagal menghapus");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Kelola Galeri Dokumentasi & Fasilitas
          </h1>
          <p className="text-slate-500 text-sm">
            Unggah dan tata foto kegiatan santri, asrama, masjid, serta sarana prasarana.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-all self-start sm:self-auto cursor-pointer active:scale-95"
        >
          <Plus size={18} />
          <span>Tambah Foto Baru</span>
        </button>
      </div>

      {/* PANDUAN UKURAN FOTO GALERI */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Camera size={20} />
        </div>
        <div className="text-xs space-y-1">
          <div className="font-bold text-emerald-950 text-sm flex items-center gap-2">
            <span>Panduan Standar Ukuran Foto Galeri Dokumentasi</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase">
              Rekomendasi
            </span>
          </div>
          <p className="text-emerald-800 leading-relaxed">
            <strong>Resolusi Rekomendasi:</strong> 1200 × 800 px (Rasio 3:2 Landscape) atau 1080 × 1080 px (1:1 Persegi) &bull;{" "}
            <strong>Ukuran Maksimal (Max File Size):</strong> 2 MB (Disarankan &lt; 600 KB) &bull;{" "}
            <strong>Format File:</strong> WebP, JPG, atau PNG.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white/50 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative h-48 bg-slate-900 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-emerald-800">
                  {item.category}
                </span>
              </div>
              <button
                onClick={() => openDeleteConfirm(item.id, item.title)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                title="Hapus Foto"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="p-4">
              <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-snug">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL TAMBAH FOTO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Tambah Foto Galeri Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Judul Foto / Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Contoh: Pengajian Rutin Ba'da Magrib"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              {/* DYNAMIC MASTER CATEGORY */}
              <CategorySelector
                type="galeri"
                value={formData.category}
                onChange={(cat) => setFormData({ ...formData, category: cat })}
                label="Kategori Galeri"
                required
              />

              {/* IMAGE UPLOAD INPUT */}
              <ImageUploadInput
                label="Foto Galeri"
                required
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                recommendedSize="1200 × 800 px"
                aspectRatio="3:2 Landscape"
                maxFileSize="2 MB"
              />

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Keterangan Singkat
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Deskripsi kegiatan atau suasana foto..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md cursor-pointer transition-all active:scale-95"
                >
                  Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.action}
      />
    </div>
  );
}
