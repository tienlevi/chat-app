import { ACCESS_TOKEN_KEY } from "@/constants";
import { MessageFile } from "@/interfaces/message";
import { instance } from "@/utils/axios";

export interface SendMessagePayload {
  text: string;
  files?: Omit<MessageFile, "_id">[];
  receiverId: string;
}

export const sendMessage = async (data: SendMessagePayload) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const response = await instance.post(`/message/send`, data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const getMessageByReceiverId = async (receiverId: string) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const response = await instance.get(`/message/receiver/${receiverId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const getMessageByUser = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const response = await instance.get(`/message/user`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const getLastestMessage = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const response = await instance.get(`/message/latest`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const readMessages = async (receiverId: string) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const response = await instance.get(`/message/read/${receiverId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};
