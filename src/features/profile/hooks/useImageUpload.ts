import { authClient } from "@/lib/auth-client";
import { haptics } from "@/utils/haptics";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";
import { pickAndUploadAvatar } from "../service/image-picker-service";

export function useImageUpload() {
  const { useSession, updateUser } = authClient;
  const userId = useSession()?.data?.user?.id;

  const mutation = useMutation({
    mutationFn: () => pickAndUploadAvatar(userId),
    onSuccess: (data) => {
      updateUser({ image: data?.url });
    },
    onError: (error) => {
      haptics.error();
      toast.error(error.message);
    },
  });

  return mutation;
}
