import { useEffect } from "react";
import { resolveUserLocation } from "../hooks/useUserLocation";
import { useLocationStore } from "../store/location-store";

export default function InitUserLocation() {
  const hasHydrated = useLocationStore((s) => s.hasHydrated);
  const city = useLocationStore((s) => s.city);

  useEffect(() => {
    if (hasHydrated && !city) resolveUserLocation();
  }, [hasHydrated, city]);

  return null;
}
