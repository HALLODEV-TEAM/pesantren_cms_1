"use client";

import React, { useState, useRef } from "react";
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  recommendedSize?: string;
  aspectRatio?: string;
  maxFileSize?: string;
  maxSizeMb?: number;
  tip?: string;
}

export default function ImageUploadInput({
  value,
  onChange,
  label = "Gambar",
  required = false,
  recommendedSize = "1200 × 800 px",
  aspectRatio = "16:9",
  maxFileSize = "2 MB",
  maxSizeMb,
  tip,
}: ImageUploadInputProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Berkas yang dipilih harus berupa gambar (JPG, PNG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran berkas terlalu besar (Maksimal 5 MB)");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah gambar");
      }

      onChange(data.url);
      toast.success("Gambar berhasil diunggah!");
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah berkas");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Mode Toggle Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              mode === "upload"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Upload size={12} />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              mode === "url"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <LinkIcon size={12} />
            <span>Link URL</span>
          </button>
        </div>
      </div>

      {/* PREVIEW BOX IF VALUE EXISTS */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
          <div className="relative h-44 sm:h-52 w-full bg-slate-900 flex items-center justify-center overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (mode === "upload" && fileInputRef.current) {
                    fileInputRef.current.click();
                  } else {
                    onChange("");
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Upload size={13} />
                <span>Ganti Gambar</span>
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1.5 rounded-xl bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                title="Hapus Gambar"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-500 truncate max-w-[280px]">
              {value.startsWith("/uploads/") ? value.replace("/uploads/", "") : value}
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold shrink-0">
              <CheckCircle2 size={13} />
              Gambar Terpasang
            </span>
          </div>
        </div>
      ) : mode === "upload" ? (
        /* DRAG & DROP UPLOAD AREA */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            dragActive
              ? "border-emerald-600 bg-emerald-50/50"
              : "border-slate-200 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center mx-auto shadow-sm mb-3">
            {isUploading ? (
              <Loader2 size={24} className="animate-spin text-emerald-700" />
            ) : (
              <Upload size={22} />
            )}
          </div>

          <div className="text-sm font-bold text-slate-800">
            {isUploading ? (
              <span>Mengunggah berkas...</span>
            ) : (
              <span>Klik untuk pilih gambar atau seret file ke sini</span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Format yang didukung: JPG, PNG, atau WebP (Maks. {maxFileSize})
          </p>
        </div>
      ) : (
        /* URL INPUT AREA */
        <div className="relative">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
          />
        </div>
      )}

      {/* GUIDELINES HELPER BADGE */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
        <span className="font-semibold text-emerald-800">
          📐 Rekomendasi: {recommendedSize} (Rasio {aspectRatio})
        </span>
        <span className="text-slate-400">Maks. {maxFileSize}</span>
      </div>

      {tip && (
        <p className="text-[11px] text-slate-500 italic mt-0.5">
          💡 {tip}
        </p>
      )}
    </div>
  );
}
