"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  Image as ImageIcon,
} from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ImageUploadInput from "@/components/ui/ImageUploadInput";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);

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
    subtitle: "",
    imageUrl: "",
    highlight1: "Ilmu Berlandaskan Al-Qur'an",
    highlight2: "Pembinaan Akhlak Mulia",
    highlight3: "Kemandirian untuk Masa Depan",
    buttonText: "Daftar Santri Baru",
    buttonLink: "/pendaftaran",
    order: 1,
    isActive: true,
  });

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      setBanners(data);
    } catch {
      toast.error("Gagal memuat banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      highlight1: "Ilmu Berlandaskan Al-Qur'an",
      highlight2: "Pembinaan Akhlak Mulia",
      highlight3: "Kemandirian untuk Masa Depan",
      buttonText: "Daftar Santri Baru",
      buttonLink: "/pendaftaran",
      order: banners.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      highlight1: banner.highlight1 || "",
      highlight2: banner.highlight2 || "",
      highlight3: banner.highlight3 || "",
      buttonText: banner.buttonText || "",
      buttonLink: banner.buttonLink || "",
      order: banner.order || 1,
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      toast.error("Judul dan Foto Banner wajib diisi");
      return;
    }

    try {
      if (editingBanner) {
        const res = await fetch("/api/banners", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingBanner.id, ...formData }),
        });
        if (!res.ok) throw new Error("Gagal memperbarui banner");
        toast.success("Banner berhasil diperbarui!");
      } else {
        const res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Gagal menambahkan banner");
        toast.success("Banner baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchBanners();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    }
  };

  const openDeleteConfirm = (id: number, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Banner Slider?",
      message: `Apakah Anda yakin ingin menghapus banner "${title}" dari slide beranda?`,
      action: async () => {
        try {
          const res = await fetch(`/api/banners?id=${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Gagal menghapus banner");
          toast.success("Banner berhasil dihapus!");
          fetchBanners();
        } catch {
          toast.error("Gagal menghapus banner");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Kelola Banner Slider Depan
          </h1>
          <p className="text-slate-500 text-sm">
            Atur slide gambar dan pesan inspiratif pada halaman beranda website utama.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-all self-start sm:self-auto cursor-pointer active:scale-95"
        >
          <Plus size={18} />
          <span>Tambah Banner Baru</span>
        </button>
      </div>

      {/* PANDUAN UKURAN GAMBAR BANNER */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <ImageIcon size={20} />
        </div>
        <div className="text-xs space-y-1">
          <div className="font-bold text-emerald-950 text-sm flex items-center gap-2">
            <span>Panduan Standar Ukuran Gambar Banner Hero Slider</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase">
              Rekomendasi
            </span>
          </div>
          <p className="text-emerald-800 leading-relaxed">
            <strong>Resolusi Rekomendasi:</strong> 1920 × 800 px (Rasio ~21:9 atau widescreen 16:7) &bull;{" "}
            <strong>Ukuran Maksimal (Max File Size):</strong> 2 MB (Disarankan &lt; 800 KB untuk loading cepat) &bull;{" "}
            <strong>Format File:</strong> WebP, JPG, atau PNG.
          </p>
          <p className="text-emerald-700/90 text-[11px]">
            💡 <em>Tips: Gunakan foto beresolusi tajam dengan objek utama di area tengah atau kanan agar teks judul putih di sisi kiri tetap terbaca dengan kontras maksimal.</em>
          </p>
        </div>
      </div>

      {/* BANNERS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="group relative bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* IMAGE PREVIEW */}
              <div className="relative h-48 bg-slate-900 overflow-hidden">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-800 shadow-sm">
                    Urutan #{b.order}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      b.isActive
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-500 text-white"
                    }`}
                  >
                    {b.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-1">
                    {b.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {b.subtitle}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
                  <span className="text-[11px] text-slate-400">
                    CTA: {b.buttonText || "Daftar"} → {b.buttonLink}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-600 hover:text-emerald-800 border border-slate-200/60 shadow-sm transition-colors cursor-pointer"
                      title="Edit Banner"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(b.id, b.title)}
                      className="p-2 rounded-xl bg-white/80 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/60 shadow-sm transition-colors cursor-pointer"
                      title="Hapus Banner"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editingBanner ? "Edit Banner Slider" : "Tambah Banner Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 overflow-y-auto space-y-4 flex-1 text-sm"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Judul Utama Banner *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Contoh: Membentuk Generasi Berilmu dan Berakhlak"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Deskripsi / Subtitle Banner
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="Deskripsi singkat yang tampil di bawah judul..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
                />
              </div>

              {/* IMAGE UPLOAD INPUT */}
              <ImageUploadInput
                label="Foto Banner Hero Slider"
                required
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                recommendedSize="1920 × 800 px"
                aspectRatio="21:9 Widescreen"
                maxFileSize="2 MB"
                tip="Pilih foto dengan subjek utama di tengah atau kanan agar teks judul di sisi kiri tetap terbaca jelas."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pilar 1
                  </label>
                  <input
                    type="text"
                    value={formData.highlight1}
                    onChange={(e) =>
                      setFormData({ ...formData, highlight1: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pilar 2
                  </label>
                  <input
                    type="text"
                    value={formData.highlight2}
                    onChange={(e) =>
                      setFormData({ ...formData, highlight2: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pilar 3
                  </label>
                  <input
                    type="text"
                    value={formData.highlight3}
                    onChange={(e) =>
                      setFormData({ ...formData, highlight3: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Teks Tombol CTA
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonText: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tautan Tombol CTA
                  </label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonLink: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Aktifkan di Beranda</span>
                  </label>
                </div>
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
                  Simpan Banner
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
