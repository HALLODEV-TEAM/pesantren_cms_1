"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Trash2,
  X,
  Phone,
  Printer,
} from "lucide-react";
import {
  useRegistrationsQuery,
  useUpdateRegistrationStatusMutation,
} from "@/hooks/useApiQueries";
import { useDashboardStore } from "@/stores/useDashboardStore";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AdminPendaftarPage() {
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [search, setSearch] = useState("");

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

  const {
    selectedApplicant: activeItem,
    applicantModalOpen,
    openApplicantModal,
    closeApplicantModal,
  } = useDashboardStore();

  const {
    data: registrations = [],
    isLoading: loading,
    refetch,
  } = useRegistrationsQuery(selectedStatus);

  const updateStatusMutation = useUpdateRegistrationStatusMutation();

  const handleUpdateStatus = async (id: number, status: string, notes?: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status, notes });
      toast.success(`Status pendaftar diubah menjadi ${status}`);
      if (activeItem && activeItem.id === id) {
        openApplicantModal({ ...activeItem, status, notes });
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui status");
    }
  };

  const openDeleteConfirm = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus Data Pendaftar",
      message: `Apakah Anda yakin ingin menghapus data calon santri "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/registrations?id=${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Gagal menghapus");
          toast.success("Data pendaftar berhasil dihapus");
          if (activeItem && activeItem.id === id) closeApplicantModal();
          refetch();
        } catch {
          toast.error("Gagal menghapus");
        }
      },
    });
  };

  const filtered = (registrations || []).filter((r: any) => {
    const matchStatus =
      selectedStatus === "Semua" || r.status === selectedStatus;
    const q = search.toLowerCase();
    const matchSearch =
      r.fullName.toLowerCase().includes(q) ||
      r.registrationNumber.toLowerCase().includes(q) ||
      r.parentName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Penerimaan Santri Baru (PSB Online)
          </h1>
          <p className="text-slate-500 text-sm">
            Pantau dan verifikasi calon santri yang mendaftar secara online melalui website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
            Total Masuk: {registrations.length} Pendaftar
          </span>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {["Semua", "Menunggu Verifikasi", "Diverifikasi", "Lulus Seleksi", "Ditolak"].map(
            (st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedStatus === st
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau nomor..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
          />
        </div>
      </div>

      {/* APPLICANTS TABLE */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">No. Registrasi</th>
                <th className="px-5 py-3.5">Nama Santri</th>
                <th className="px-5 py-3.5">Jenjang</th>
                <th className="px-5 py-3.5">Orang Tua / Kontak</th>
                <th className="px-5 py-3.5">Tanggal Daftar</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Memuat data pendaftar...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Tidak ada calon santri pada status ini.
                  </td>
                </tr>
              ) : (
                filtered.map((item: any) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/80 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {item.registrationNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">
                        {item.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.gender}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-emerald-800">
                      {item.programChoice}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-800 font-medium">
                        {item.parentName}
                      </div>
                      <a
                        href={`https://wa.me/${item.parentPhone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
                      >
                        <Phone size={11} />
                        {item.parentPhone}
                      </a>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          item.status === "Lulus Seleksi"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "Diverifikasi"
                              ? "bg-teal-100 text-teal-800"
                              : item.status === "Ditolak"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status === "Lulus Seleksi" && (
                          <CheckCircle2 size={12} />
                        )}
                        {item.status === "Menunggu Verifikasi" && (
                          <Clock size={12} />
                        )}
                        {item.status === "Ditolak" && <XCircle size={12} />}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openApplicantModal(item)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                          title="Lihat Berkas Lengkap"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(item.id, item.fullName)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Hapus Pendaftar"
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

      {/* DETAIL MODAL */}
      {applicantModalOpen && activeItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            onClick={closeApplicantModal}
          />
          <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col z-10">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase block">
                  BERKAS REGISTRASI
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-mono">
                  {activeItem.registrationNumber}
                </h3>
              </div>
              <button
                onClick={closeApplicantModal}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Calon Santri:</span>
                  <span className="font-bold text-slate-900">
                    {activeItem.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis Kelamin:</span>
                  <span className="font-semibold text-slate-800">
                    {activeItem.gender}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tempat, Tanggal Lahir:</span>
                  <span className="text-slate-800">
                    {activeItem.birthPlace},{" "}
                    {new Date(activeItem.birthDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pilihan Jenjang:</span>
                  <span className="font-bold text-emerald-800">
                    {activeItem.programChoice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Asal Sekolah:</span>
                  <span className="text-slate-800">
                    {activeItem.schoolOrigin || (activeItem as any).previousSchool}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Orang Tua:</span>
                  <span className="font-bold text-slate-900">
                    {activeItem.parentName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. WhatsApp:</span>
                  <a
                    href={`https://wa.me/${activeItem.parentPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    {activeItem.parentPhone}
                  </a>
                </div>
                {activeItem.email && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-800">{activeItem.email}</span>
                  </div>
                )}
                <div className="pt-1">
                  <span className="text-slate-500 block mb-1">
                    Alamat Lengkap:
                  </span>
                  <p className="text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200">
                    {activeItem.address}
                  </p>
                </div>
              </div>

              {/* ACTION CHANGE STATUS */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Ubah Status Penerimaan Calon Santri:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    "Menunggu Verifikasi",
                    "Diverifikasi",
                    "Lulus Seleksi",
                    "Ditolak",
                  ].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(activeItem.id, st)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                        activeItem.status === st
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Printer size={14} />
                <span>Cetak Berkas</span>
              </button>
              <button
                onClick={closeApplicantModal}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

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
