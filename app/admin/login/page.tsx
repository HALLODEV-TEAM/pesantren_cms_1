"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { useProfileQuery } from "@/hooks/useApiQueries";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: profile } = useProfileQuery();
  const siteName = profile?.name || "Pondok Pesantren Al-Ikhlas";
  const logoUrl = profile?.logoUrl;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to /admin immediately
  React.useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return { authenticated: false };
      })
      .then((data) => {
        if (isMounted && data.authenticated) {
          router.replace("/admin");
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Mohon masukkan username dan password Anda.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Username atau password yang Anda masukkan salah.");
      }

      toast.success("Otentikasi berhasil! Mengalihkan ke dasbor...");
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Gagal masuk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#f8fafc] font-sans text-slate-800">
      {/* Subtle institutional pattern backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[420px] bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-9 shadow-xl shadow-slate-200/60">
        {/* LOGO & OFFICIAL CREST */}
        <div className="text-center mb-7">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={siteName}
              className="w-14 h-14 rounded-2xl object-cover mx-auto mb-4 shadow-md shadow-emerald-900/20 ring-4 ring-emerald-50"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-900/20 ring-4 ring-emerald-50">
              {/* Mosque / crescent emblem */}
              <svg
                className="w-7 h-7 fill-amber-300"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79.09-.39.46-.66.86-.64.44.02.77.38.74.82-.07.51-.11 1.05-.11 1.61 0 3.31 2.69 6 6 6 .56 0 1.1-.04 1.61-.11.44-.03.8.3.82.74.02.4-.25.77-.64.86-.58.13-1.17.21-1.79.21zM12 4c.55 0 1 .45 1 1v1.07c1.78.36 3.19 1.77 3.55 3.55H18c.55 0 1 .45 1 1s-.45 1-1 1h-1.45c-.36 1.78-1.77 3.19-3.55 3.55V17c0 .55-.45 1-1 1s-1-.45-1-1v-1.83c-1.78-.36-3.19-1.77-3.55-3.55H7c-.55 0-1-.45-1-1s.45-1 1-1h1.45c.36-1.78 1.77-3.19 3.55-3.55V5c0-.55.45-1 1-1z" />
              </svg>
            </div>
          )}

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-2 border border-emerald-200">
            <ShieldCheck size={12} />
            <span>Panel Pengelola Resmi</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-serif">
            {siteName}
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Masuk untuk mengelola publikasi artikel, galeri, dan data santri baru.
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username Admin
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none text-sm transition-all text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kata Sandi
              </label>
            </div>
            <div className="relative">
              <KeyRound
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi admin"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none text-sm transition-all text-slate-900 font-mono"
              />
              {/* EYE TOGGLE BUTTON */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold text-sm shadow-md shadow-emerald-800/20 transition-all flex items-center justify-center gap-2 group mt-2 cursor-pointer active:scale-98"
          >
            {loading ? (
              <span>Memverifikasi akun...</span>
            ) : (
              <>
                <Lock size={15} className="text-amber-300" />
                <span>Masuk ke Dasbor CMS</span>
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <a
            href="/"
            className="font-medium hover:text-emerald-800 transition-colors cursor-pointer"
          >
            ← Kembali ke Website
          </a>
          <span>Terenkripsi SSL/TLS</span>
        </div>
      </div>
    </div>
  );
}
