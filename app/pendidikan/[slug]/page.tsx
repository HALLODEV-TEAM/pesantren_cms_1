import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TopBar from "@/components/landing/TopBar";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { getProfile, getProgramBySlug } from "@/lib/data-service";
import {
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return {
      title: "Program Pendidikan Tidak Ditemukan - Pondok Pesantren Al-Ikhlas",
    };
  }

  return {
    title: `${program.name} (${program.level}) - Pondok Pesantren Al-Ikhlas`,
    description: program.description,
    openGraph: {
      title: `${program.name} - Pondok Pesantren Al-Ikhlas`,
      description: program.description,
      images: [program.imageUrl],
    },
  };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [profile, program] = await Promise.all([
    getProfile(),
    getProgramBySlug(slug),
  ]);

  if (!program) {
    notFound();
  }

  const featureList = program.features
    ? program.features.split("\n").filter(Boolean)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar phone={profile.phone} email={profile.email} />
      <Navbar />

      <main className="flex-1 py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Beranda
            </Link>
            <ChevronRight size={13} />
            <Link
              href="/pendidikan"
              className="hover:text-emerald-700 transition-colors"
            >
              Pendidikan
            </Link>
            <ChevronRight size={13} />
            <span className="text-emerald-800 font-semibold">{program.name}</span>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-12 border border-slate-200/80 shadow-sm space-y-8">
            <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 bg-emerald-950 shadow-md">
              <img
                src={program.imageUrl}
                alt={program.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 inline-block mb-2">
                  {program.level}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif">
                  {program.name}
                </h1>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Deskripsi Program
              </h2>
              <p className="text-slate-700 text-base leading-relaxed">
                {program.description}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-3">
              <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
                <BookOpen size={20} className="text-emerald-700" />
                Struktur Kurikulum & Pembelajaran
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {program.curriculum}
              </p>
            </div>

            {featureList.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  Fasilitas & Keunggulan Khusus
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featureList.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-sm font-medium text-slate-800"
                    >
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h4 className="font-bold text-slate-900">
                  Tertarik mendaftarkan ananda?
                </h4>
                <p className="text-xs text-slate-500">
                  Kuota santri terbatas pada setiap gelombang penerimaan.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/pendaftaran"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors"
                >
                  <span>Daftar {program.name}</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/pendidikan"
                  className="inline-flex items-center justify-center px-4 py-3 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors"
                >
                  Kembali
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
