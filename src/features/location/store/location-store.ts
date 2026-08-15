import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LocationState {
  city: string | null;
  country: string | null;
  isLocating: boolean;
  hasHydrated: boolean;
  setPlace: (city: string, country: string) => void;
  setIsLocating: (isLocating: boolean) => void;
  setHasHydrated: () => void;
}

type PersistedLocation = Pick<LocationState, "city" | "country">;

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: null,
      country: null,
      isLocating: false,
      hasHydrated: false,

      setPlace: (city, country) => set({ city, country }),
      setIsLocating: (isLocating) => set({ isLocating }),
      setHasHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "ofudo-user-location",
      storage: createJSONStorage<PersistedLocation>(() => AsyncStorage),
      partialize: ({ city, country }) => ({ city, country }),
      // zustand passes undefined as the first argument when the storage read throws.
      onRehydrateStorage: (state) => (persisted) => (persisted ?? state).setHasHydrated(),
    },
  ),
);
