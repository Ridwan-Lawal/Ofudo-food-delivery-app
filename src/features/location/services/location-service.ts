import { logDevError } from "@/utils/logger";
import * as Location from "expo-location";

export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  return status === Location.PermissionStatus.GRANTED;
}

export async function getCurrentPlace() {
  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const [address] = await Location.reverseGeocodeAsync(position.coords);

    // Android leaves city null outside dense urban areas and on emulator mock coordinates.
    const city = address?.city ?? address?.subregion ?? address?.district ?? address?.region;

    if (!city || !address?.country) throw new Error("Incomplete reverse geocode result");

    return { city, country: address.country };
  } catch (error) {
    logDevError("getCurrentPlace", error);
    throw new Error("We couldn't work out where you are");
  }
}
