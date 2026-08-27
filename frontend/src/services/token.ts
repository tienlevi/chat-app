import { instance } from "@/utils/axios";

export const refreshToken = async (token: string) => {
  const response = await instance.post(
    "/token/refresh-token",
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
};
