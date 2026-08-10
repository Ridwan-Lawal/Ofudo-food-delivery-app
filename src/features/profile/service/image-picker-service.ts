import { supabase } from "@/lib/supabase/supabase";
import { logDevError } from "@/utils/logger";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";

export async function updateSessionImage(image: string | undefined, userId: string | undefined) {
  if (!userId) throw new Error("You do not have the permission to perform this operation");

  if (!image) throw new Error("Invalid image, try again");

  const { error } = await supabase.from("user").update({ image }).eq("id", userId);

  if (error) {
    logDevError("Session Image Update:", error);
    throw new Error("Something went wrong updating session image");
  }

  return { success: true };
}

export async function pickAndUploadAvatar(userId: string | undefined) {
  if (!userId) throw new Error("You do not have the permission to carry out this operation.");
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
    base64: true,
  });

  if (result.canceled) return null;
  console.log(result, result.assets, result.assets[0]);

  const asset = result.assets[0];
  if (!asset.base64) throw new Error("No image data");

  const filePath = `${userId}/${Date.now()}.jpg`;

  const { error } = await supabase.storage.from("avatars").upload(filePath, decode(asset.base64), {
    contentType: "image/jpeg",
  });

  if (error) {
    logDevError("Image upload", error);
    throw new Error("Something went wrong trying to upload image");
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return { url: data.publicUrl, localuri: asset.uri };
}
