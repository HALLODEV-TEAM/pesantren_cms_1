import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";
import { getProfile } from "@/lib/data-service";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#064e3b",
};

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const siteName = profile?.name || "Pondok Pesantren Al-Ikhlas";
  const shortName = (profile as any)?.shortName || "AL-IKHLAS";
  const tagline = profile?.tagline || "Membentuk Generasi Berilmu dan Berakhlak";
  const description =
    profile?.description ||
    "Situs resmi Pondok Pesantren Al-Ikhlas. Lembaga pendidikan Islam modern terpadu dengan jenjang TK, MI, MTs, MA, dan Program Unggulan Tahfidz Al-Qur'an 30 Juz.";
  const iconUrl =
    (profile as any)?.faviconUrl || (profile as any)?.logoUrl || "/favicon.ico";
  const logoUrl =
    (profile as any)?.logoUrl ||
    "https://images.unsplash.com/photo-1584281722572-882415d86208?auto=format&fit=crop&w=1200&q=80";

  return {
    metadataBase: new URL("https://pesantren-alikhlas.sch.id"),
    title: {
      default: `${siteName} - ${tagline}`,
      template: `%s | ${shortName}`,
    },
    description,
    keywords: [
      siteName,
      shortName,
      `Pondok Pesantren ${shortName}`,
      "Pesantren Modern",
      "Pendaftaran Santri Baru",
      "PSB Pesantren",
      "Madrasah Tsanawiyah",
      "Madrasah Aliyah",
      "Tahfidz Al-Quran 30 Juz",
      "Pendidikan Islam Unggulan",
      "Boarding School Islam Terbaik",
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: "https://pesantren-alikhlas.sch.id",
      siteName: siteName,
      title: `${siteName} - ${tagline}`,
      description,
      images: [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: tagline,
      images: [logoUrl],
    },
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  const favicon =
    (profile as any)?.faviconUrl || (profile as any)?.logoUrl || "/favicon.ico";

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href={favicon} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-800">
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                borderRadius: "16px",
                fontFamily: "inherit",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
