"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import TopBar from "@/components/landing/TopBar";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  ChevronRight,
  UserPlus,
  CheckCircle2,
  Calendar,
  FileText,
  Clock,
  Printer,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useRegistrationStore } from "@/stores/useRegistrationStore";
import { useSubmitRegistrationMutation } from "@/hooks/useApiQueries";
import { FadeIn, ScaleIn } from "@/components/ui/MotionWrapper";

export default function PendaftaranPage() {
  const {
    formData,
    updateFormField,
    resetForm,
    lastSubmitted,
    setLastSubmitted,
  } = useRegistrationStore();

  const submitMutation = useSubmitRegistrationMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.birthPlace ||
      !formData.birthDate ||
      !formData.parentName ||
      !formData.parentPhone ||
      !formData.address ||
      !formData.schoolOrigin
    ) {
      toast.error("Mohon lengkapi seluruh isian wajib pada formulir.");
      return;
    }

    try {
      const data = await submitMutation.mutateAsync({
        fullName: formData.fullName,
        gender: formData.gender,
        birthPlace: formData.birthPlace,
        birthDate: formData.birthDate,
        programChoice: formData.programChoice,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        email: formData.email || "",
        address: formData.address,
        schoolOrigin: formData.schoolOrigin,
      });

      setLastSubmitted(data.data);
      toast.success("Alhamdulillah! Pendaftaran berhasil dikirim.");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kendala saat mendaftar.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar />
      <Navbar />

      <main className="flex-1 py-10 md:py-16 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <FadeIn className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Beranda
            </Link>
            <ChevronRight size={13} />
            <span className="text-emerald-800 font-semibold">
              Pendaftaran Santri Baru (PSB)
            </span>
          </FadeIn>

          {/* PAGE HEADER */}
          <FadeIn delay={0.1} className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 md:p-12 mb-8 shadow-lg">
            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                <Sparkles size={13} />
                Tahun Ajaran 2026 / 2027
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif text-white">
                Penerimaan Santri Baru (PSB Online)
              </h1>
              <p className="text-emerald-100 text-sm md:text-base max-w-2xl leading-relaxed">
                Silakan lengkapi formulir pendaftaran di bawah ini dengan data yang benar dan valid. Nomor registrasi resmi akan diterbitkan secara otomatis setelah formulir dikirim.
              </p>
            </div>
          </FadeIn>

          {/* SUCCESS MODAL / RECEIPT */}
          {lastSubmitted ? (
            <ScaleIn className="bg-white rounded-3xl p-6 md:p-10 border border-emerald-200 shadow-xl space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>

              <div className="text-center space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  PENDAFTARAN BERHASIL DISIMPAN
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-serif">
                  Nomor Registrasi Santri:
                </h2>
                <div className="inline-block px-6 py-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-900 font-mono text-2xl font-black tracking-wider shadow-sm">
                  {lastSubmitted.registrationNumber}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Nama Calon Santri:</span>
                  <span className="col-span-2 font-bold text-slate-900">
                    {lastSubmitted.fullName}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Jenjang Pilihan:</span>
                  <span className="col-span-2 font-semibold text-emerald-800">
                    {lastSubmitted.programChoice}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Nama Orang Tua:</span>
                  <span className="col-span-2 text-slate-800">
                    {lastSubmitted.parentName}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-medium">Status Berkas:</span>
                  <span className="col-span-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      {lastSubmitted.status}
                    </span>
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Harap simpan atau cetak nomor registrasi ini. Tim Panitia PSB Pondok Pesantren Al-Ikhlas akan menghubungi nomor WhatsApp orang tua untuk jadwal pelaksanaan tes seleksi.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <Printer size={16} /> Cetak Bukti Registrasi
                </button>
                <button
                  onClick={() => {
                    setLastSubmitted(null);
                    resetForm();
                  }}
                  className="py-3 px-5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors active:scale-95"
                >
                  Daftar Calon Santri Lain
                </button>
              </div>
            </ScaleIn>
          ) : (
            /* FORMULIR PENDAFTARAN */
            <FadeIn delay={0.2} className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <UserPlus size={20} className="text-emerald-700" />
                    Data Pribadi Calon Santri
                  </h3>
                  <p className="text-xs text-slate-500">
                    Masukkan identitas resmi sesuai Akta Kelahiran atau Kartu Keluarga.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nama Lengkap Calon Santri *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        updateFormField("fullName", e.target.value)
                      }
                      placeholder="Contoh: Muhammad Fadhil Ramadhan"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Jenis Kelamin *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        updateFormField("gender", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm bg-white"
                    >
                      <option value="Laki-laki">Laki-laki (Santri Putra)</option>
                      <option value="Perempuan">Perempuan (Santri Putri)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Pilihan Jenjang Pendidikan *
                    </label>
                    <select
                      value={formData.programChoice}
                      onChange={(e) =>
                        updateFormField("programChoice", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm bg-white"
                    >
                      <option value="TK Islam Terpadu">TK Islam Terpadu</option>
                      <option value="Madrasah Ibtidaiyah (MI)">
                        Madrasah Ibtidaiyah (MI)
                      </option>
                      <option value="Madrasah Tsanawiyah (MTs)">
                        Madrasah Tsanawiyah (MTs)
                      </option>
                      <option value="Madrasah Aliyah (MA)">
                        Madrasah Aliyah (MA)
                      </option>
                      <option value="Tahfidz Al-Qur'an 30 Juz">
                        Tahfidz Al-Qur'an 30 Juz (Takhassus)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Tempat Lahir *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.birthPlace}
                      onChange={(e) =>
                        updateFormField("birthPlace", e.target.value)
                      }
                      placeholder="Contoh: Cirebon"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Tanggal Lahir *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.birthDate}
                      onChange={(e) =>
                        updateFormField("birthDate", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Asal Sekolah Sebelumnya *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.schoolOrigin}
                      onChange={(e) =>
                        updateFormField("schoolOrigin", e.target.value)
                      }
                      placeholder="Contoh: SD Negeri 1 Cirebon / MI Al-Hikmah"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm"
                    />
                  </div>
                </div>

                <div className="border-b border-slate-200 pt-4 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={20} className="text-emerald-700" />
                    Data Orang Tua / Wali & Domisili
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nama Lengkap Orang Tua / Wali *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) =>
                        updateFormField("parentName", e.target.value)
                      }
                      placeholder="Contoh: H. Ahmad Supriyadi"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      No. WhatsApp / Handphone Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.parentPhone}
                      onChange={(e) =>
                        updateFormField("parentPhone", e.target.value)
                      }
                      placeholder="Contoh: 081234567890"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Alamat Email (Opsional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        updateFormField("email", e.target.value)
                      }
                      placeholder="Contoh: orangtua@gmail.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Alamat Lengkap Tempat Tinggal *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.address}
                      onChange={(e) =>
                        updateFormField("address", e.target.value)
                      }
                      placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Kode Pos"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold text-base shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    {submitMutation.isPending ? (
                      <span>Mengirim Formulir...</span>
                    ) : (
                      <>
                        <Sparkles size={18} className="text-amber-300" />
                        <span>Kirim Formulir Pendaftaran Sekarang</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-slate-500 mt-3">
                    Dengan mengirimkan formulir ini, Anda menyatakan bahwa seluruh data yang diisi adalah benar dan sah.
                  </p>
                </div>
              </form>
            </FadeIn>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
