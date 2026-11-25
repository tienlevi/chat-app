import { ACCESS_TOKEN_KEY } from "@/constants";
import type IUser from "@/interfaces/user";
import { instance } from "@/utils/axios";

export interface UpdateProfilePayload {
  name?: string;
  avatar?: string;
}

export const getUser = async (accessToken: string) => {
  const response = await instance.get(`/user`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<IUser> => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const response = await instance.patch(`/user`, payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const getUsers = async (name: string) => {
  const response = await instance.get(`/users`, { params: { name } });
  return response.data || [];
};
