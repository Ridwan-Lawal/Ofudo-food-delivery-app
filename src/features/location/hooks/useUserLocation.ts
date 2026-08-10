import { haptics } from "@/utils/haptics";
import { toast } from "sonner-native";
import { getCurrentPlace, requestLocationPermission } from "../services/location-service";
import { useLocationStore } from "../store/location-store";

export async function resolveUserLocation() {
  const { isLocating, setIsLocating, setPlace } = useLocationStore.getState();

  if (isLocating) return;

  setIsLocating(true);

  try {
    if (!(await requestLocationPermission())) {
      throw new Error("We need location access to show your delivery city");
    }

    const { city, country } = await getCurrentPlace();
    setPlace(city, country);
  } catch (error) {
    haptics.error();
    toast.error(error instanceof Error ? error.message : "We couldn't work out where you are");
  } finally {
    setIsLocating(false);
  }
}

export function useUserLocation() {
  const city = useLocationStore((s) => s.city);
  const country = useLocationStore((s) => s.country);
  const isLocating = useLocationStore((s) => s.isLocating);
  const hasHydrated = useLocationStore((s) => s.hasHydrated);

  return {
    label: city && country ? `${city}, ${country}` : null,
    isLocating,
    hasHydrated,
    refresh: resolveUserLocation,
  };
}
