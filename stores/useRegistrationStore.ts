import { create } from "zustand";

export interface RegistrationFormData {
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
}

export interface SubmittedRegistration extends RegistrationFormData {
  id: number;
  registrationNumber: string;
  status: string;
  createdAt: string;
}

interface RegistrationStore {
  formData: RegistrationFormData;
  updateFormField: (field: keyof RegistrationFormData, value: string) => void;
  resetForm: () => void;

  lastSubmitted: SubmittedRegistration | null;
  setLastSubmitted: (data: SubmittedRegistration | null) => void;

  successModalOpen: boolean;
  setSuccessModalOpen: (open: boolean) => void;
}

const initialFormData: RegistrationFormData = {
  fullName: "",
  gender: "Laki-laki",
  birthPlace: "",
  birthDate: "",
  programChoice: "Madrasah Tsanawiyah (MTs)",
  parentName: "",
  parentPhone: "",
  email: "",
  address: "",
  schoolOrigin: "",
};

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  formData: initialFormData,
  updateFormField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),
  resetForm: () => set({ formData: initialFormData }),

  lastSubmitted: null,
  setLastSubmitted: (data) => set({ lastSubmitted: data }),

  successModalOpen: false,
  setSuccessModalOpen: (open) => set({ successModalOpen: open }),
}));

