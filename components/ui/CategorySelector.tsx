"use client";

import React, { useState, useEffect } from "react";
import { Plus, Check, X, Tag } from "lucide-react";
import { toast } from "sonner";

interface CategorySelectorProps {
  type: "berita" | "faq" | "galeri";
  value: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
}

export default function CategorySelector({
  type,
  value,
  onChange,
  label = "Kategori",
  required = false,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [savingNew, setSavingNew] = useState(false);

  const fetchCats = async () => {
    try {
      const res = await fetch(`/api/categories?type=${type}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        // If current value is not set, set default to first category
        if (!value && data.length > 0) {
          onChange(data[0].name);
        }
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, [type]);

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) {
      toast.error("Nama kategori tidak boleh kosong");
      return;
    }

    setSavingNew(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim(), type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat kategori");

      toast.success(`Kategori "${newCatName.trim()}" berhasil ditambahkan!`);
      const created = data.data;
      setCategories((prev) => [...prev, created]);
      onChange(created.name);
      setNewCatName("");
      setIsAdding(false);
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan kategori");
    } finally {
      setSavingNew(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus size={12} />
            <span>+ Kategori Baru</span>
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-emerald-300">
          <input
            type="text"
            autoFocus
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreateCategory();
              } else if (e.key === "Escape") {
                setIsAdding(false);
              }
            }}
            placeholder="Ketik nama kategori baru..."
            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20"
          />
          <button
            type="button"
            onClick={handleCreateCategory}
            disabled={savingNew}
            className="p-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            title="Simpan Kategori"
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewCatName("");
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Batal"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 cursor-pointer shadow-sm"
          >
            {loading ? (
              <option value="">Memuat kategori...</option>
            ) : categories.length === 0 ? (
              <option value="Umum">Umum</option>
            ) : (
              categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))
            )}
          </select>
        </div>
      )}
    </div>
  );
}

