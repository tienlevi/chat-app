import { QUERY_KEY } from "@/constants/query-key";
import { uploadFile } from "@/services/cloudinary";
import { updateProfile, UpdateProfilePayload } from "@/services/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface UpdateProfileInput {
  name?: string;
  avatarFile?: File | null;
}

function useUpdateProfile() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async ({ name, avatarFile }: UpdateProfileInput) => {
      const payload: UpdateProfilePayload = {};
      if (name) payload.name = name;
      if (avatarFile) {
        const image = await uploadFile(avatarFile);
        payload.avatar = image.secure_url;
      }
      return await updateProfile(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FRIENDS] });
      toast.success(t("chat.profile.success"));
    },
    onError: () => {
      toast.error(t("chat.profile.error"));
    },
  });
}

export default useUpdateProfile;
