import { instance } from "@/utils/axios";

export const getUser = async (accessToken: string) => {
  const response = await instance.get(`/user`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};
