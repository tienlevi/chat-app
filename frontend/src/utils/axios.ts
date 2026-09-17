import {
  ACCESS_TOKEN_KEY,
  baseApi,
  baseCloudinaryV1,
  REFRESH_TOKEN_KEY,
} from "@/constants";
import { refreshToken } from "@/services/token";
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const instance = axios.create({
  baseURL: baseApi,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const cloudinaryApi = axios.create({
  baseURL: baseCloudinaryV1,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.log("🚀 ~ error:", error);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;

    if (!config || config._retry || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      const refreshTokenKey = Cookies.get(REFRESH_TOKEN_KEY);
      const token = await refreshToken(refreshTokenKey || "");

      config.headers.Authorization = `Bearer ${token.data.accessToken}`;
      localStorage.setItem(ACCESS_TOKEN_KEY, token.data.accessToken);
      Cookies.set(REFRESH_TOKEN_KEY, token.data.refreshToken);
      return instance(config);
    } catch (error) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      Cookies.remove(REFRESH_TOKEN_KEY);
      console.log("🚀 ~ error:", error);
      Promise.reject(error);
    }
  },
);
