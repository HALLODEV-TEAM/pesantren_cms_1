import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/landing/TopBar";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import { getProfile } from "@/lib/data-service";
import { FadeIn, FadeInLeft, FadeInRight } from "@/components/ui/MotionWrapper";
import {
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Kontak & Lokasi - Pondok Pesantren Al-Ikhlas",
  description:
    "Hubungi sekretariat Pondok Pesantren Al-Ikhlas untuk konsultasi pendidikan, jadwal kunjungan, dan informasi pendaftaran santri baru.",
};

export default async function KontakPage() {
  const profile = await getProfile();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar phone={profile.phone} email={profile.email} />
      <Navbar />

      <main className="flex-1">
        {/* HERO BANNER */}
        <section className="bg-emerald-950 text-white py-14 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 opacity-90" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/50 text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                BERANDA
              </Link>
              <ChevronRight size={13} className="text-emerald-500" />
              <span className="text-amber-300">KONTAK & LOKASI</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold font-serif tracking-tight text-white mb-3">
              Hubungi Sekretariat Pesantren
            </h1>
            <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base">
              Kami siap melayani pertanyaan seputar program pendidikan, beasiswa, dan kunjungan silaturahmi.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* CONTACT INFO (5 cols) */}
            <FadeInLeft className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  Informasi Kontak
                </h2>

                <div className="space-y-4 text-sm text-slate-700">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase block">
                        Alamat Kampus
                      </span>
                      <p className="font-medium text-slate-900 mt-0.5">
                        {profile.address}, Kec. {profile.district}, {profile.city},{" "}
                        {profile.province} - {profile.postalCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase block">
                        Telepon Kantor
                      </span>
                      <a
                        href={`tel:${profile.phone}`}
                        className="font-medium text-slate-900 hover:text-emerald-700 mt-0.5 block"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase block">
                        WhatsApp Panitia PSB
                      </span>
                      <a
                        href={`https://wa.me/${profile.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-slate-900 hover:text-emerald-700 mt-0.5 block"
                      >
                        +{profile.whatsapp}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase block">
                        Surel / Email
                      </span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="font-medium text-slate-900 hover:text-emerald-700 mt-0.5 block"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase block">
                        Jam Pelayanan Kantor
                      </span>
                      <p className="font-medium text-slate-900 mt-0.5">
                        Senin - Sabtu: 07.30 - 16.00 WIB
                        <br />
                        Ahad: Kunjungan Wali Santri (08.00 - 16.30 WIB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInLeft>

            {/* MESSAGE FORM (7 cols) */}
            <FadeInRight className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 font-serif mb-2">
                  Kirim Pesan / Permohonan Informasi
                </h2>
                <p className="text-xs text-slate-500 mb-6">
                  Sampaikan pertanyaan Anda kepada kami. Tim kami akan segera menanggapi.
                </p>

                <ContactForm />
              </div>
            </FadeInRight>
          </div>
        </section>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
