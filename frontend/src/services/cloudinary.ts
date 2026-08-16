import { cloudinaryApiKey, cloudinaryUploadPreset } from "@/constants";
import { cloudinaryApi } from "@/utils/axios";

export type FileType = "image" | "video";

export const uploadFile = async (file: File, type: FileType = "image") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "chat-app");
  formData.append("upload_preset", cloudinaryUploadPreset);
  formData.append("api_key", cloudinaryApiKey);

  const response = await cloudinaryApi.post(`/${type}/upload`, formData);
  return response.data;
};
