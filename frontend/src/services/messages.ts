import { ACCESS_TOKEN_KEY } from "@/constants";
import { instance } from "@/utils/axios";

export const getMessageByReceiverId = async (receiverId: string) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const response = await instance.get(`/message/receiver/${receiverId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const getMessageBySender = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const response = await instance.get(`/message/sender`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};
