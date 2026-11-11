"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  GraduationCap,
  X,
} from "lucide-react";
import ImageUploadInput from "@/components/ui/ImageUploadInput";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AdminProgramPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any | null>(null);

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

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    level: "Pendidikan Dasar",
    description: "",
    curriculum: "",
    features: "",
    imageUrl: "",
    order: 1,
    isActive: true,
  });

  const fetchPrograms = async () => {
    try {
      const res = await fetch("/api/programs");
      const data = await res.json();
      setPrograms(data);
    } catch {
      toast.error("Gagal memuat data program");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const openCreateModal = () => {
    setEditingProgram(null);
    setFormData({
      name: "",
      slug: "",
      level: "Pendidikan Dasar",
      description: "",
      curriculum: "",
      features: "Pembinaan Akhlak\nTahfidz Al-Qur'an\nAsrama Representatif",
      imageUrl: "",
      order: programs.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prog: any) => {
    setEditingProgram(prog);
    setFormData({
      name: prog.name,
      slug: prog.slug,
      level: prog.level,
      description: prog.description,
      curriculum: prog.curriculum || "",
      features: prog.features || "",
      imageUrl: prog.imageUrl,
      order: prog.order,
      isActive: prog.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.imageUrl) {
      toast.error("Mohon lengkapi nama program, deskripsi, dan foto sampul.");
      return;
    }

    try {
      const slug =
        formData.slug ||
        formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

      if (editingProgram) {
        const res = await fetch("/api/programs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProgram.id, ...formData, slug }),
        });
        if (!res.ok) throw new Error("Gagal memperbarui program");
        toast.success("Program pendidikan berhasil diperbarui!");
      } else {
        const res = await fetch("/api/programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, slug }),
        });
        if (!res.ok) throw new Error("Gagal menambahkan program");
        toast.success("Program pendidikan baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchPrograms();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    }
  };

  const openDeleteConfirm = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Program Pendidikan",
      message: `Apakah Anda yakin ingin menghapus program "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/programs?id=${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Gagal menghapus");
          toast.success("Program berhasil dihapus");
          fetchPrograms();
        } catch {
          toast.error("Gagal menghapus program");
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Kelola Jenjang & Program Pendidikan
          </h1>
          <p className="text-slate-500 text-sm">
            Atur kurikulum, jenjang (TK, MI, MTs, MA, Tahfidz), dan fitur unggulan secara dinamis.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={18} />
          <span>Tambah Program Baru</span>
        </button>
      </div>

      {/* PANDUAN GAMBAR PROGRAM */}
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <GraduationCap size={20} />
        </div>
        <div className="text-xs space-y-1">
          <div className="font-bold text-emerald-950 text-sm flex items-center gap-2">
            <span>Panduan Standar Ukuran Foto Sampul Program Pendidikan</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase">
              Rekomendasi
            </span>
          </div>
          <p className="text-emerald-800 leading-relaxed">
            <strong>Resolusi Rekomendasi:</strong> 800 × 500 px (Rasio 16:10) &bull;{" "}
            <strong>Ukuran Maksimal (Max File Size):</strong> 1.5 MB &bull;{" "}
            <strong>Format File:</strong> WebP, JPG, atau PNG.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            Memuat program pendidikan...
          </div>
        ) : programs.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            Belum ada program pendidikan yang ditambahkan.
          </div>
        ) : (
          programs.map((prog) => (
            <div
              key={prog.id}
              className="bg-white/50 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 bg-emerald-950">
                <img
                  src={prog.imageUrl}
                  alt={prog.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 shadow">
                    {prog.level}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold font-serif leading-tight">
                    {prog.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {prog.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
                  <span className="text-[11px] text-slate-400">
                    Slug: /{prog.slug}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(prog)}
                      className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-600 hover:text-emerald-800 border border-slate-200/60 shadow-sm transition-colors cursor-pointer"
                      title="Edit Program"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(prog.id, prog.name)}
                      className="p-2 rounded-xl bg-white/80 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/60 shadow-sm transition-colors cursor-pointer"
                      title="Hapus Program"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col z-10">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProgram ? "Edit Program Pendidikan" : "Tambah Program Baru"}
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
                  Nama Program / Jenjang *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Madrasah Tsanawiyah (MTs)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tingkat / Level *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    placeholder="Pendidikan Menengah Pertama"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="madrasah-tsanawiyah"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <ImageUploadInput
                  label="Foto Sampul Program *"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  recommendedSize="800 × 500 px (Rasio 16:10)"
                  maxSizeMb={1.5}
                  aspectRatio="16:10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Deskripsi Lengkap *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Struktur Kurikulum & Penjelasan
                </label>
                <textarea
                  rows={2}
                  value={formData.curriculum}
                  onChange={(e) =>
                    setFormData({ ...formData, curriculum: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Fitur Unggulan (Satu per baris)
                </label>
                <textarea
                  rows={3}
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
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
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md cursor-pointer"
                >
                  Simpan Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
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
