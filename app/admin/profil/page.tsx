"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, ShieldCheck, UserCheck, Target } from "lucide-react";
import ImageUploadInput from "@/components/ui/ImageUploadInput";

export default function AdminProfilPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Gagal memuat profil pesantren");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Gagal menyimpan profil");
      toast.success("Profil pesantren berhasil diperbarui!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="py-20 text-center text-slate-500 animate-pulse">
        Memuat profil...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Kelola Profil Pesantren & Sambutan Pimpinan
        </h1>
        <p className="text-slate-500 text-sm">
          Perbarui data kelembagaan, visi misi, foto pengasuh, serta sambutan pimpinan secara dinamis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* IDENTITAS PONDOK */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-700" />
            Identitas Lembaga
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Pesantren *
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={profile.tagline || ""}
                onChange={(e) =>
                  setProfile({ ...profile, tagline: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Akreditasi
              </label>
              <input
                type="text"
                value={profile.akreditasi || ""}
                onChange={(e) =>
                  setProfile({ ...profile, akreditasi: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                NSPP (Nomor Statistik Pesantren)
              </label>
              <input
                type="text"
                value={profile.nspp || ""}
                onChange={(e) =>
                  setProfile({ ...profile, nspp: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Deskripsi Umum Pesantren
              </label>
              <textarea
                rows={3}
                value={profile.description || ""}
                onChange={(e) =>
                  setProfile({ ...profile, description: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* PENGASUH & SAMBUTAN */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserCheck size={20} className="text-emerald-700" />
            Pengasuh Pondok & Sambutan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Lengkap Pengasuh *
              </label>
              <input
                type="text"
                required
                value={profile.leaderName}
                onChange={(e) =>
                  setProfile({ ...profile, leaderName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Jabatan / Gelar
              </label>
              <input
                type="text"
                value={profile.leaderTitle}
                onChange={(e) =>
                  setProfile({ ...profile, leaderTitle: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploadInput
                label="Foto Pengasuh / Pimpinan Pondok *"
                value={profile.leaderPhoto}
                onChange={(url) => setProfile({ ...profile, leaderPhoto: url })}
                recommendedSize="600 × 750 px (Rasio 4:5 Portrait)"
                maxSizeMb={2}
                aspectRatio="4:5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Teks Sambutan Pengasuh
              </label>
              <textarea
                rows={4}
                value={profile.leaderWelcome || ""}
                onChange={(e) =>
                  setProfile({ ...profile, leaderWelcome: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* VISI, MISI & SEJARAH */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target size={20} className="text-emerald-700" />
            Visi, Misi & Sejarah
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Visi Pesantren
              </label>
              <textarea
                rows={2}
                value={profile.vision || ""}
                onChange={(e) =>
                  setProfile({ ...profile, vision: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Misi Pesantren (Setiap nomor per baris baru)
              </label>
              <textarea
                rows={4}
                value={profile.mission || ""}
                onChange={(e) =>
                  setProfile({ ...profile, mission: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sejarah Pesantren
              </label>
              <textarea
                rows={3}
                value={profile.history || ""}
                onChange={(e) =>
                  setProfile({ ...profile, history: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save size={18} />
          <span>{saving ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
        </button>
      </form>
    </div>
  );
}
