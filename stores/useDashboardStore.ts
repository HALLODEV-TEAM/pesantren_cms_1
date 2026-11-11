import { create } from "zustand";

export interface ApplicantDetail {
  id: number;
  registrationNumber: string;
  fullName: string;
  gender: string;
  programChoice: string;
  parentName: string;
  parentPhone: string;
  email: string;
  address: string;
  schoolOrigin: string;
  birthPlace: string;
  birthDate: string | Date;
  status: string;
  notes?: string;
  createdAt: string | Date;
}

interface DashboardStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  selectedApplicant: ApplicantDetail | null;
  applicantModalOpen: boolean;
  openApplicantModal: (applicant: ApplicantDetail) => void;
  closeApplicantModal: () => void;

  searchFilter: string;
  setSearchFilter: (query: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  selectedApplicant: null,
  applicantModalOpen: false,
  openApplicantModal: (applicant) =>
    set({
      selectedApplicant: applicant,
      applicantModalOpen: true,
    }),
  closeApplicantModal: () =>
    set({
      selectedApplicant: null,
      applicantModalOpen: false,
    }),

  searchFilter: "",
  setSearchFilter: (query) => set({ searchFilter: query }),
}));

