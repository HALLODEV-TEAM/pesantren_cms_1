import React from "react";
import TopBar from "@/components/landing/TopBar";
import Navbar from "@/components/landing/Navbar";
import HeroSlider from "@/components/landing/HeroSlider";
import TentangKamiSection from "@/components/landing/TentangKamiSection";
import ProgramSection from "@/components/landing/ProgramSection";
import BeritaTerbaruSection from "@/components/landing/BeritaTerbaruSection";
import GaleriSection from "@/components/landing/GaleriSection";
import ArtikelWawasanSection from "@/components/landing/ArtikelWawasanSection";
import TestimoniSection from "@/components/landing/TestimoniSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import {
  getProfile,
  getBanners,
  getArticles,
  getPrograms,
  getGallery,
  getTestimonials,
  getFAQs,
} from "@/lib/data-service";

export default async function HomePage() {
  const [
    profile,
    banners,
    articles,
    programs,
    gallery,
    testimonials,
    faqs,
  ] = await Promise.all([
    getProfile(),
    getBanners(),
    getArticles(),
    getPrograms(),
    getGallery(),
    getTestimonials(),
    getFAQs(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. TOP BAR */}
      <TopBar phone={profile.phone} email={profile.email} />

      {/* 2. NAVBAR (NO cart icon) */}
      <Navbar />

      <main className="flex-1">
        {/* 3. HERO BANNER SLIDER (NO floating whatsapp) */}
        <HeroSlider banners={banners} />

        {/* 4. TENTANG KAMI SECTION MATCHING SCREENSHOT */}
        <TentangKamiSection profile={profile} />

        {/* 5. PROGRAM PENDIDIKAN SECTION */}
        <ProgramSection programs={programs} />

        {/* 6. BERITA TERBARU SECTION MATCHING SCREENSHOT */}
        <BeritaTerbaruSection articles={articles} />

        {/* 7. DOKUMENTASI GALLERY KEGIATAN MATCHING SCREENSHOT */}
        <GaleriSection items={gallery} />

        {/* 8. WAWASAN ARTIKEL TERBARU MATCHING SCREENSHOT */}
        <ArtikelWawasanSection articles={articles} />

        {/* 9. TESTIMONI WALI & ALUMNI */}
        <TestimoniSection testimonials={testimonials} />

        {/* 10. FAQ TANYA JAWAB */}
        <FAQSection faqs={faqs} />

        {/* 11. PSB CALL TO ACTION */}
        <CTASection />
      </main>

      {/* 12. FOOTER MATCHING SCREENSHOT (NO cart, NO floating WhatsApp) */}
      <Footer profile={profile} />
    </div>
  );
}
