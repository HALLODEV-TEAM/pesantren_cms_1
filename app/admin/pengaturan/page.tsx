"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Save,
  Phone,
  Globe,
  Share2,
  Building2,
  Sparkles,
  Layout,
  ExternalLink,
} from "lucide-react";
import ImageUploadInput from "@/components/ui/ImageUploadInput";
import { useProfileQuery, useUpdateProfileMutation } from "@/hooks/useApiQueries";

export default function AdminPengaturanPage() {
  const { data: initialProfile, isLoading } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  const [profile, setProfile] = useState<any>({
    name: "Pondok Pesantren Al-Ikhlas",
    shortName: "AL-IKHLAS",
    institutionType: "Pondok Pesantren",
    logoUrl: "",
    faviconUrl: "",
    tagline: "Membentuk Generasi Berilmu, Beradab, dan Berakhlak Qur'ani",
    phone: "0231-1234567",
    whatsapp: "6285123456987",
    email: "pesantren@domain.com",
    address: "Jl. Pesantren No. 45, Harjamukti",
    district: "Harjamukti",
    city: "Kota Cirebon",
    province: "Jawa Barat",
    postalCode: "45143",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    tiktok: "https://tiktok.com",
    xTwitter: "https://x.com",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setProfile({
        ...initialProfile,
        shortName: initialProfile.shortName || "AL-IKHLAS",
        institutionType: initialProfile.institutionType || "Pondok Pesantren",
        logoUrl: initialProfile.logoUrl || "",
        faviconUrl: initialProfile.faviconUrl || "",
      });
    }
  }, [initialProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileMutation.mutateAsync(profile);
      toast.success("Pengaturan situs dan identitas lembaga berhasil disimpan!");
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !profile.name) {
    return (
      <div className="py-20 text-center text-slate-500 animate-pulse">
        Memuat data pengaturan situs...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Pengaturan Situs & Identitas Lembaga
        </h1>
        <p className="text-slate-500 text-sm">
          Kelola nama website, brand text "AL-IKHLAS", logo resmi, favicon browser, SEO, kontak, dan tautan sosial media.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: IDENTITAS & BRANDING WEBSITE (NAMA, LOGO, FAVICON) */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={20} className="text-emerald-700" />
              Identitas Website & Branding Lembaga
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Dinamis & Realtime
            </span>
          </div>

          {/* LIVE PREVIEW BOX */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-md">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-3">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-300" />
                Pratinjau Langsung Tampilan Logo & Nama di Website
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-200">
                Live Preview
              </span>
            </div>

            {/* Mock Navbar Preview */}
            <div className="bg-white rounded-xl p-3 text-slate-900 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt="Logo"
                    className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-emerald-600/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md ring-2 ring-emerald-600/30">
                    <svg className="w-5 h-5 fill-amber-300" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79.09-.39.46-.66.86-.64.44.02.77.38.74.82-.07.51-.11 1.05-.11 1.61 0 3.31 2.69 6 6 6 .56 0 1.1-.04 1.61-.11.44-.03.8.3.82.74.02.4-.25.77-.64.86-.58.13-1.17.21-1.79.21zM12 4c.55 0 1 .45 1 1v1.07c1.78.36 3.19 1.77 3.55 3.55H18c.55 0 1 .45 1 1s-.45 1-1 1h-1.45c-.36 1.78-1.77 3.19-3.55 3.55V17c0 .55-.45 1-1 1s-1-.45-1-1v-1.83c-1.78-.36-3.19-1.77-3.55-3.55H7c-.55 0-1-.45-1-1s.45-1 1-1h1.45c.36-1.78 1.77-3.19 3.55-3.55V5c0-.55.45-1 1-1z" />
                    </svg>
                  </div>
                )}
                <div>
                  <span className="text-[9px] tracking-widest font-semibold uppercase text-emerald-700 block leading-tight">
                    {profile.institutionType || "PONDOK PESANTREN"}
                  </span>
                  <span className="text-lg font-black text-emerald-950 tracking-tight block leading-none">
                    {profile.shortName || "AL-IKHLAS"}
                  </span>
                </div>
              </div>

              {/* Mock Browser Tab Preview */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                {profile.faviconUrl ? (
                  <img
                    src={profile.faviconUrl}
                    alt="Favicon"
                    className="w-3.5 h-3.5 object-contain rounded"
                  />
                ) : profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt="Favicon"
                    className="w-3.5 h-3.5 object-contain rounded"
                  />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-700 text-[8px] text-white flex items-center justify-center font-bold">
                    AI
                  </div>
                )}
                <span className="font-medium text-slate-700 max-w-[140px] truncate">
                  {profile.name} - Tab
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nama Lengkap Lembaga / Pesantren (Untuk Dokumen & SEO) *
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Pondok Pesantren Al-Ikhlas"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nama Singkat / Brand Text ("AL-IKHLAS") *
                </label>
                <input
                  type="text"
                  required
                  value={profile.shortName || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, shortName: e.target.value })
                  }
                  placeholder="AL-IKHLAS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-emerald-950 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 shadow-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Teks utama berukuran besar yang muncul pada navbar, sidebar admin, dan title.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Jenis / Kategori Lembaga (Sub-Text) *
                </label>
                <input
                  type="text"
                  required
                  value={profile.institutionType || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, institutionType: e.target.value })
                  }
                  placeholder="PONDOK PESANTREN"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 shadow-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Teks kecil di atas nama brand (contoh: PONDOK PESANTREN / MA'HAD TAHFIDZ).
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Slogan / Tagline Website *
              </label>
              <input
                type="text"
                required
                value={profile.tagline || ""}
                onChange={(e) =>
                  setProfile({ ...profile, tagline: e.target.value })
                }
                placeholder="Membentuk Generasi Berilmu, Beradab, dan Berakhlak Qur'ani"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 shadow-sm"
              />
            </div>

            {/* DUAL UPLOADER: LOGO RESMI & FAVICON */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <ImageUploadInput
                  label="Logo Resmi Website (Navbar & Sidebar)"
                  value={profile.logoUrl || ""}
                  onChange={(url) => setProfile({ ...profile, logoUrl: url })}
                  recommendedSize="512 × 512 px (Persegi 1:1, Transparan)"
                  aspectRatio="1:1"
                  maxSizeMb={1.5}
                />
                <p className="text-[11px] text-slate-500">
                  Logo ini akan tampil di Navbar halaman depan, sidebar admin, dan header kartu login. Kosongkan jika ingin menggunakan emblem default.
                </p>
              </div>

              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <ImageUploadInput
                  label="Favicon / Icon Tab Browser (SEO)"
                  value={profile.faviconUrl || ""}
                  onChange={(url) => setProfile({ ...profile, faviconUrl: url })}
                  recommendedSize="128 × 128 px (.ico atau .png)"
                  aspectRatio="1:1"
                  maxSizeMb={0.5}
                />
                <p className="text-[11px] text-slate-500">
                  Icon kecil yang muncul di tab browser pengguna dan hasil pencarian Google.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: KONTAK & ALAMAT LEMBAGA */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Phone size={20} className="text-emerald-700" />
            Kontak & Alamat Lembaga
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nomor Telepon Kantor *
              </label>
              <input
                type="text"
                required
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nomor WhatsApp Resmi (Tanpa tanda +) *
              </label>
              <input
                type="text"
                required
                value={profile.whatsapp}
                onChange={(e) =>
                  setProfile({ ...profile, whatsapp: e.target.value })
                }
                placeholder="6285123456987"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono shadow-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Alamat Surel / Email Resmi *
              </label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Alamat Lengkap *
              </label>
              <input
                type="text"
                required
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Kecamatan
              </label>
              <input
                type="text"
                value={profile.district || ""}
                onChange={(e) =>
                  setProfile({ ...profile, district: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Kota / Kabupaten
              </label>
              <input
                type="text"
                value={profile.city || ""}
                onChange={(e) =>
                  setProfile({ ...profile, city: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Provinsi
              </label>
              <input
                type="text"
                value={profile.province || ""}
                onChange={(e) =>
                  setProfile({ ...profile, province: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Kode Pos
              </label>
              <input
                type="text"
                value={profile.postalCode || ""}
                onChange={(e) =>
                  setProfile({ ...profile, postalCode: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: MEDIA SOSIAL */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Share2 size={20} className="text-emerald-700" />
            Tautan Media Sosial Resmi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={profile.facebook || ""}
                onChange={(e) =>
                  setProfile({ ...profile, facebook: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={profile.instagram || ""}
                onChange={(e) =>
                  setProfile({ ...profile, instagram: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={profile.youtube || ""}
                onChange={(e) =>
                  setProfile({ ...profile, youtube: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                TikTok URL
              </label>
              <input
                type="url"
                value={profile.tiktok || ""}
                onChange={(e) =>
                  setProfile({ ...profile, tiktok: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                X (Twitter) URL
              </label>
              <input
                type="url"
                value={profile.xTwitter || ""}
                onChange={(e) =>
                  setProfile({ ...profile, xTwitter: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <Save size={18} />
          <span>{saving ? "Menyimpan Pengaturan..." : "Simpan Semua Pengaturan Situs & Identitas"}</span>
        </button>
      </form>
    </div>
  );
}
