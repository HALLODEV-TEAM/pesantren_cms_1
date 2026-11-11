"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error("Mohon lengkapi nama, nomor telepon, dan isi pesan.");
      return;
    }
    setSubmitted(true);
    toast.success("Pesan Anda berhasil dikirim ke sekretariat!");
  };

  if (submitted) {
    return (
      <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-3xl space-y-3">
        <CheckCircle2 size={36} className="text-emerald-700 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">
          Pesan Berhasil Terkirim!
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Terima kasih atas pesan yang Anda sampaikan. Petugas sekretariat Pondok Pesantren Al-Ikhlas akan segera menghubungi Anda melalui nomor telepon / WhatsApp yang tertera.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: "",
              phone: "",
              email: "",
              subject: "",
              message: "",
            });
          }}
          className="mt-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
        >
          Kirim Pesan Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nama Lengkap *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nama Anda"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nomor WhatsApp / Telp *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="08xxxxxxxxxx"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Alamat Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@domain.com"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Subjek Pertanyaan *
        </label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          placeholder="Contoh: Pertanyaan Syarat Beasiswa Tahfidz"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Isi Pesan *
        </label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="Tuliskan pertanyaan atau kebutuhan konsultasi Anda secara rinci..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm shadow-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
      >
        <Send size={16} />
        <span>Kirim Pesan Sekarang</span>
      </button>
    </form>
  );
}

