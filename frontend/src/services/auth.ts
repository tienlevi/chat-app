import IUser from "@/interfaces/user";
import { instance } from "@/utils/axios";

export const register = async (data: IUser) => {
  const response = await instance.post(`/auth/register`, data);
  return response.data;
};

export const login = async (data: { email: string; password: string }) => {
  const response = await instance.post(`/auth/login`, data);
  return response.data;
};
