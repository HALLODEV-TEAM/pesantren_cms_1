import { create } from "zustand";

interface LightboxState {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  category: string;
}

interface UIStore {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  activeNewsCategory: string;
  setActiveNewsCategory: (category: string) => void;

  newsSearchQuery: string;
  setNewsSearchQuery: (query: string) => void;

  activeGalleryCategory: string;
  setActiveGalleryCategory: (category: string) => void;

  lightbox: LightboxState;
  openLightbox: (item: { imageUrl: string; title: string; category: string }) => void;
  closeLightbox: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  activeNewsCategory: "Semua",
  setActiveNewsCategory: (category) => set({ activeNewsCategory: category }),

  newsSearchQuery: "",
  setNewsSearchQuery: (query) => set({ newsSearchQuery: query }),

  activeGalleryCategory: "Semua",
  setActiveGalleryCategory: (category) => set({ activeGalleryCategory: category }),

  lightbox: {
    isOpen: false,
    imageUrl: "",
    title: "",
    category: "",
  },
  openLightbox: (item) =>
    set({
      lightbox: {
        isOpen: true,
        imageUrl: item.imageUrl,
        title: item.title,
        category: item.category,
      },
    }),
  closeLightbox: () =>
    set({
      lightbox: {
        isOpen: false,
        imageUrl: "",
        title: "",
        category: "",
      },
    }),
}));

