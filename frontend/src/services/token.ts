import { instance } from "@/utils/axios";

export const refreshToken = async (token: string) => {
  const response = await instance.post("/token/refresh-token", {
    token: token,
  });

  return response;
};
