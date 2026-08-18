import IUser from "@/interfaces/user";
import { instance } from "@/utils/axios";

export const register = async (data: IUser) => {
  const response = await instance.post(`/auth/register`, data);
  return response.data;
};
