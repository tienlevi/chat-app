import { baseApi } from "@/constants";
import axios from "axios";

export const instance = axios.create({
  baseURL: baseApi,
  headers: { "Content-Type": "application/json" },
});
