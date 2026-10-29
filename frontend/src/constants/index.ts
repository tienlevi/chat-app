export const baseApi = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : "http://localhost:3000/api";
export const socketUrl = import.meta.env.PROD
  ? ""
  : import.meta.env.VITE_SOCKET_URL;

export const defaultAvatar =
  "https://res.cloudinary.com/dbjkk9wg0/image/upload/v1785941690/chat-app/default-avatar_sij2wm.png";
export const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const cloudinaryUploadPreset = import.meta.env
  .VITE_CLOUDINARY_UPLOAD_PRESET;
export const cloudinaryApiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
export const cloudinaryApiKeySecret = import.meta.env
  .VITE_CLOUDINARY_API_KEY_SECRET;
export const baseCloudinaryV1 = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}`;

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
