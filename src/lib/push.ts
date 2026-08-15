import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPush(): Promise<string | null> {
  // Push tokens require real hardware — emulators can't receive them
  if (!Device.isDevice) {
    console.log("Push: not a physical device");
    return null;
  }

  // Android needs a channel or notifications never display
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  // Ask permission only if we don't already have it
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Push: permission denied");
    return null;
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  if (!projectId) {
    console.log("Push: no projectId found in app config");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  console.log("EXPO PUSH TOKEN:", token);
  return token;
}
