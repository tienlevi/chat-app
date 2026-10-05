import { ACCESS_TOKEN_KEY } from "@/constants";
import { instance } from "@/utils/axios";

export const getFriends = async (accessToken: string) => {
  const response = await instance.get(`/friends`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const searchFriends = async (name?: string) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const response = await instance.get(`/friends/search`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { name: name },
  });
  return response.data;
};

export const addFriend = async (friendId: string, accessToken: string) => {
  const response = await instance.post(`/friends/add`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    friendId,
  });
  return response.data;
};
