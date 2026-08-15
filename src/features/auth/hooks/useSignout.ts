import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";

export function useSignout() {
  const router = useRouter();
  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/login");
        },
      },
    });
  }

  return signOut;
}
