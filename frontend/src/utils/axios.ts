import { baseApi, baseCloudinaryV1 } from "@/constants";
import axios from "axios";

export const instance = axios.create({
  baseURL: baseApi,
  headers: { "Content-Type": "application/json" },
});

export const cloudinaryApi = axios.create({
  baseURL: baseCloudinaryV1,
});
