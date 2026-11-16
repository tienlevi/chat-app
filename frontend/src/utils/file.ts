import type { MessageFileType } from "@/interfaces/message";
import type { FileType } from "@/services/cloudinary";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES = 10;

export const getMessageFileType = (file: File): MessageFileType => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "file";
};

export const getCloudinaryType = (type: MessageFileType): FileType =>
  type === "file" ? "raw" : type;

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
