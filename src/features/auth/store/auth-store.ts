import { create } from "zustand";

interface AuthStoreProps {
  isLoginSuccessModalOpen: boolean;
  onToggleLoginSuccessModal: (value: boolean) => void;
}

export const useAuthStore = create<AuthStoreProps>((set) => ({
  isLoginSuccessModalOpen: false,
  onToggleLoginSuccessModal: (value) => set((state) => ({ isLoginSuccessModalOpen: value })),
}));
