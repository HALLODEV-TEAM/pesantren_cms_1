"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface BannerItem {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  highlight1?: string | null;
  highlight2?: string | null;
  highlight3?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

export interface ArticleItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string;
  authorName?: string;
  published: boolean;
  publishedAt: string | Date;
  tags?: string;
}

export interface ProgramItem {
  id: number;
  slug: string;
  name: string;
  level: string;
  description: string;
  curriculum: string;
  features?: string;
  icon?: string;
  coverImage?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  avatarUrl?: string;
  quote: string;
  rating: number;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface RegistrationItem {
  id: number;
  registrationNumber: string;
  fullName: string;
  gender: string;
  birthPlace: string;
  birthDate: string | Date;
  programChoice: string;
  parentName: string;
  parentPhone: string;
  email: string;
  address: string;
  schoolOrigin: string;
  status: string;
  notes?: string;
  createdAt: string | Date;
}

export interface ProfileItem {
  id?: number;
  name: string;
  shortName?: string;
  institutionType?: string;
  logoUrl?: string;
  faviconUrl?: string;
  tagline?: string;
  description?: string;
  address?: string;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  nspp?: string;
  akreditasi?: string;
  leaderName?: string;
  leaderTitle?: string;
  leaderPhoto?: string;
  leaderWelcome?: string;
  vision?: string;
  mission?: string;
  history?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  xTwitter?: string;
}

export interface DashboardStats {
  totalSantri: number;
  santriGrowth: string;
  totalArticles: number;
  totalRegistrations: number;
  pendingRegistrations: number;
  acceptedRegistrations?: number;
  totalPrograms: number;
  totalGallery?: number;
  recentRegistrations: RegistrationItem[];
  monthlyChart: { month: string; pendaftar: number }[];
}

// BANNERS
export function useBannersQuery(initialData?: BannerItem[]) {
  return useQuery<BannerItem[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const res = await fetch("/api/banners");
      if (!res.ok) throw new Error("Gagal memuat banner");
      return res.json();
    },
    initialData,
  });
}

// ARTICLES
export function useArticlesQuery(category?: string, initialData?: ArticleItem[]) {
  return useQuery<ArticleItem[]>({
    queryKey: ["articles", category || "Semua"],
    queryFn: async () => {
      const url =
        category && category !== "Semua"
          ? `/api/articles?category=${encodeURIComponent(category)}`
          : "/api/articles";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal memuat berita");
      return res.json();
    },
    initialData,
  });
}

// SINGLE ARTICLE
export function useArticleQuery(idOrSlug: string, initialData?: ArticleItem) {
  return useQuery<ArticleItem>({
    queryKey: ["article", idOrSlug],
    queryFn: async () => {
      const res = await fetch(`/api/articles/${idOrSlug}`);
      if (!res.ok) throw new Error("Artikel tidak ditemukan");
      return res.json();
    },
    initialData,
    enabled: !!idOrSlug,
  });
}

// PROGRAMS
export function useProgramsQuery(initialData?: ProgramItem[]) {
  return useQuery<ProgramItem[]>({
    queryKey: ["programs"],
    queryFn: async () => {
      const res = await fetch("/api/programs");
      if (!res.ok) throw new Error("Gagal memuat program");
      return res.json();
    },
    initialData,
  });
}

// GALLERY
export function useGalleryQuery(category?: string, initialData?: GalleryItem[]) {
  return useQuery<GalleryItem[]>({
    queryKey: ["gallery", category || "Semua"],
    queryFn: async () => {
      const url =
        category && category !== "Semua"
          ? `/api/gallery?category=${encodeURIComponent(category)}`
          : "/api/gallery";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal memuat galeri");
      return res.json();
    },
    initialData,
  });
}

// TESTIMONIALS
export function useTestimonialsQuery(initialData?: TestimonialItem[]) {
  return useQuery<TestimonialItem[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Gagal memuat testimoni");
      return res.json();
    },
    initialData,
  });
}

// FAQS
export function useFaqsQuery(initialData?: FAQItem[]) {
  return useQuery<FAQItem[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await fetch("/api/faqs");
      if (!res.ok) throw new Error("Gagal memuat FAQ");
      return res.json();
    },
    initialData,
  });
}

// DASHBOARD STATS
export function useStatsQuery() {
  return useQuery<DashboardStats>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Gagal memuat data statistik dashboard");
      return res.json();
    },
  });
}

// REGISTRATIONS (ADMIN)
export function useRegistrationsQuery(status?: string) {
  return useQuery<RegistrationItem[]>({
    queryKey: ["admin", "registrations", status || "Semua"],
    queryFn: async () => {
      const url =
        status && status !== "Semua"
          ? `/api/registrations?status=${encodeURIComponent(status)}`
          : "/api/registrations";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal memuat pendaftaran");
      return res.json();
    },
  });
}

// MUTATION: SUBMIT REGISTRATION (PUBLIC)
export function useSubmitRegistrationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      fullName: string;
      gender: string;
      birthPlace: string;
      birthDate: string;
      programChoice: string;
      parentName: string;
      parentPhone: string;
      email: string;
      address: string;
      schoolOrigin: string;
    }) => {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengirim formulir pendaftaran");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "registrations"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

// MUTATION: UPDATE REGISTRATION STATUS (ADMIN)
export function useUpdateRegistrationStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number; status: string; notes?: string }) => {
      const res = await fetch("/api/registrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memperbarui status pendaftar");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "registrations"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

// PROFILE QUERY & MUTATION
export function useProfileQuery(initialData?: ProfileItem) {
  return useQuery<ProfileItem>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Gagal memuat profil website");
      return res.json();
    },
    initialData,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ProfileItem>) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Gagal memperbarui profil website");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
