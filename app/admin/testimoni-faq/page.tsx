"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  MessageSquareQuote,
  HelpCircle,
  Star,
  X,
} from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CategorySelector from "@/components/ui/CategorySelector";
import ImageUploadInput from "@/components/ui/ImageUploadInput";

export default function AdminTestimoniFaqPage() {
  const [activeTab, setActiveTab] = useState<"testimoni" | "faq">("testimoni");
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isTestiModal, setIsTestiModal] = useState(false);
  const [isFaqModal, setIsFaqModal] = useState(false);

  // Confirm Delete Modal State
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

  const [testiForm, setTestiForm] = useState({
    name: "",
    role: "Wali Santri",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    content: "",
    rating: 5,
    isActive: true,
  });

  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "Umum",
    order: 1,
    isActive: true,
  });

  const fetchData = async () => {
    try {
      const [resTesti, resFaq] = await Promise.all([
        fetch("/api/testimonials"),
        fetch("/api/faqs"),
      ]);
      const dataTesti = await resTesti.json();
      const dataFaq = await resFaq.json();
      setTestimonials(dataTesti);
      setFaqs(dataFaq);
    } catch {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveTesti = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testiForm.name || !testiForm.content) {
      toast.error("Nama dan isi testimoni wajib diisi");
      return;
    }
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testiForm),
      });
      if (!res.ok) throw new Error("Gagal menyimpan testimoni");
      toast.success("Testimoni baru berhasil ditambahkan!");
      setIsTestiModal(false);
      setTestiForm({
        name: "",
        role: "Wali Santri",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
        content: "",
        rating: 5,
        isActive: true,
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openDeleteTestiConfirm = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Testimoni?",
      message: `Apakah Anda yakin ingin menghapus ulasan testimoni dari "${name}"?`,
      action: async () => {
        try {
          await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
          toast.success("Testimoni berhasil dihapus");
          fetchData();
        } catch {
          toast.error("Gagal menghapus testimoni");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) {
      toast.error("Pertanyaan dan jawaban wajib diisi");
      return;
    }
    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqForm),
      });
      if (!res.ok) throw new Error("Gagal menyimpan FAQ");
      toast.success("FAQ baru berhasil ditambahkan!");
      setIsFaqModal(false);
      setFaqForm({
        question: "",
        answer: "",
        category: "Umum",
        order: faqs.length + 1,
        isActive: true,
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openDeleteFaqConfirm = (id: number, question: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Tanya-Jawab (FAQ)?",
      message: `Apakah Anda yakin ingin menghapus pertanyaan "${question}"?`,
      action: async () => {
        try {
          await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
          toast.success("FAQ berhasil dihapus");
          fetchData();
        } catch {
          toast.error("Gagal menghapus FAQ");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER & TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Kelola Testimoni & FAQ
          </h1>
          <p className="text-slate-500 text-sm">
            Atur ulasan wali santri, alumni, serta pertanyaan umum seputar pondok.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeTab === "testimoni") setIsTestiModal(true);
              else setIsFaqModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus size={18} />
            <span>
              {activeTab === "testimoni" ? "Tambah Testimoni" : "Tambah FAQ"}
            </span>
          </button>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab("testimoni")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "testimoni"
              ? "bg-white text-emerald-800 shadow-sm border border-slate-200/80"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <MessageSquareQuote size={18} />
          <span>Testimoni ({testimonials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("faq")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "faq"
              ? "bg-white text-emerald-800 shadow-sm border border-slate-200/80"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <HelpCircle size={18} />
          <span>Tanya Jawab / FAQ ({faqs.length})</span>
        </button>
      </div>

      {/* TAB 1: TESTIMONIALS */}
      {activeTab === "testimoni" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatarUrl}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openDeleteTestiConfirm(t.id, t.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Testimoni"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{t.content || t.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: FAQS */}
      {activeTab === "faq" && (
        <div className="space-y-3">
          {faqs.map((f) => (
            <div
              key={f.id}
              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {f.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{f.question}</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {f.answer}
                </p>
              </div>

              <button
                onClick={() => openDeleteFaqConfirm(f.id, f.question)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                title="Hapus FAQ"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL TESTIMONI */}
      {isTestiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsTestiModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Tambah Testimoni Baru
              </h3>
              <button
                onClick={() => setIsTestiModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTesti} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={testiForm.name}
                  onChange={(e) =>
                    setTestiForm({ ...testiForm, name: e.target.value })
                  }
                  placeholder="Contoh: H. Ahmad Supriyadi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Peran / Status *
                </label>
                <input
                  type="text"
                  required
                  value={testiForm.role}
                  onChange={(e) =>
                    setTestiForm({ ...testiForm, role: e.target.value })
                  }
                  placeholder="Contoh: Wali Santri MTs Al-Ikhlas"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>

              {/* IMAGE UPLOAD FOR TESTIMONIAL AVATAR */}
              <ImageUploadInput
                label="Foto Profil / Avatar"
                value={testiForm.avatarUrl}
                onChange={(url) =>
                  setTestiForm({ ...testiForm, avatarUrl: url })
                }
                recommendedSize="400 × 400 px"
                aspectRatio="1:1"
                maxFileSize="1.5 MB"
              />

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Isi Ulasan / Testimoni *
                </label>
                <textarea
                  rows={3}
                  required
                  value={testiForm.content}
                  onChange={(e) =>
                    setTestiForm({ ...testiForm, content: e.target.value })
                  }
                  placeholder="Ceritakan pengalaman kepuasan belajar di Al-Ikhlas..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsTestiModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md cursor-pointer transition-all active:scale-95"
                >
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FAQ DENGAN MASTER KATEGORI DINAMIS */}
      {isFaqModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsFaqModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Tambah FAQ Baru
              </h3>
              <button
                onClick={() => setIsFaqModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Pertanyaan *
                </label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) =>
                    setFaqForm({ ...faqForm, question: e.target.value })
                  }
                  placeholder="Contoh: Kapan pendaftaran santri baru ditutup?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                />
              </div>

              {/* DYNAMIC MASTER CATEGORY SELECTOR */}
              <CategorySelector
                type="faq"
                value={faqForm.category}
                onChange={(cat) => setFaqForm({ ...faqForm, category: cat })}
                label="Kategori Pertanyaan"
                required
              />

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Jawaban Lengkap *
                </label>
                <textarea
                  rows={4}
                  required
                  value={faqForm.answer}
                  onChange={(e) =>
                    setFaqForm({ ...faqForm, answer: e.target.value })
                  }
                  placeholder="Tuliskan jawaban yang jelas dan informatif..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm leading-relaxed"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFaqModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md cursor-pointer transition-all active:scale-95"
                >
                  Simpan FAQ
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
