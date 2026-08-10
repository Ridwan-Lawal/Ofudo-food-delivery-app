import AnimatedPressable from "@/components/AnimatedPressable";
import { useSignout } from "@/features/auth/hooks/useSignout";
import { authClient } from "@/lib/auth-client";
import { palette, textVariants } from "@/theme/tokens";
import { placeholderUrl } from "@/utils/constants";
import { haptics } from "@/utils/haptics";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useImageUpload } from "../hooks/useImageUpload";

const editIcon = require("@/assets/icons/pencil.png");
const userIcon = require("@/assets/icons/user.png");
const noAvatarPlaceholder = require("@/assets/images/no-profile.png");

export function ProfileDetails() {
  const session = authClient.useSession();
  const { name, email } = session?.data?.user ?? {};
  const signOut = useSignout();
  const { mutate: uploadImage } = useImageUpload();
  const [localAvatar, setLocalAvatar] = useState<string | undefined>();

  // notifications.

  function handleAvatarChange() {
    haptics.tap();
    uploadImage(undefined, {
      onSuccess: (data) => {
        haptics.success();
        setLocalAvatar(data?.localuri);
      },
    });
  }

  const userAvatar = localAvatar ?? session?.data?.user?.image ?? noAvatarPlaceholder;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Profile</Text>

      <View style={styles.imageContainer}>
        <Image
          source={userAvatar}
          placeholder={placeholderUrl}
          style={styles.avatar}
          transition={200}
          cachePolicy="memory-disk"
        />
        <AnimatedPressable style={styles.editAvatarBtn} onPress={handleAvatarChange}>
          <Image source={editIcon} style={styles.editIcon} />
        </AnimatedPressable>
      </View>

      {/*profile details*/}
      <View style={styles.profileDetailsContainer}>
        <View style={styles.details}>
          <View style={styles.detailIconContainer}>
            <Image source={userIcon} style={styles.detailIcon} transition={200} />
          </View>
          <View>
            <Text style={styles.detailKey}>Full Name</Text>
            <Text style={styles.detailValue}>{name}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailIconContainer}>
            <Image source={userIcon} style={styles.detailIcon} transition={200} />
          </View>
          <View>
            <Text style={styles.detailKey}>Email Address</Text>
            <Text style={styles.detailValue}>{email}</Text>
          </View>
        </View>
      </View>

      <AnimatedPressable onPress={signOut} style={styles.logoutBtn}>
        <FontAwesome name="sign-out" size={24} color={palette.red} />
        <Text style={styles.logoutText}>Logout</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 36,
    alignItems: "center",
  },
  headerText: {
    ...textVariants.value,
    color: palette.almostBlack,
    fontSize: 18,
    textAlign: "center",
  },
  imageContainer: { width: 100, height: 100 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 61,
  },
  editAvatarBtn: {
    padding: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: palette.orange,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  editIcon: {
    width: 16,
    height: 16,
  },

  profileDetailsContainer: {
    paddingHorizontal: 14,
    paddingVertical: 20,
    alignItems: "flex-start",
    gap: 30,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "stretch",
  },
  detailIconContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 17,
    gap: 10,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: "rgba(254, 140, 0, 0.05)",
    backgroundColor: "rgba(254, 140, 0, 0.05)",
  },
  detailIcon: {
    width: 20,
    height: 20,
  },
  detailKey: {
    ...textVariants.label,
    color: "#6a6a6a",
    lineHeight: 19.6,
  },

  detailValue: {
    ...textVariants.value,
    color: palette.almostBlack,
    fontSize: 18,
    textTransform: "capitalize",
  },
  logoutBtn: {
    flexDirection: "row",
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    alignSelf: "stretch",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#f14141",
    backgroundColor: "rgba(241, 65, 65, 0.05)",
  },
  logoutText: {
    ...textVariants.h1,
    fontSize: 16,
    color: palette.red,
  },
});
