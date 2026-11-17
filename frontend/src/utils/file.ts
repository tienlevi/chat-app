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

export const fileName = (url: string): string => {
  const segments = url.split("/");
  return decodeURIComponent(segments[segments.length - 1] || url);
};

// The `download` attribute is ignored for cross-origin URLs (Cloudinary),
// so fetch the file as a blob and save it from a same-origin object URL.
export const downloadFile = async (url: string, name = fileName(url)) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blobUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};
