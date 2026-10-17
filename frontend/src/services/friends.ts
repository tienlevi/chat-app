import { ACCESS_TOKEN_KEY } from "@/constants";
import { instance } from "@/utils/axios";

export const getFriendsByUserId = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

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

export const addFriend = async (friendId: string) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const response = await instance.post(
    `/friends/add`,
    { friendId },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return response.data;
};

export const acceptFriend = async (friendId: string) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const response = await instance.post(`/friends/accept/${friendId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const delineFriend = async (friendId: string) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const response = await instance.post(`/friends/deline/${friendId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const blockFriend = async (friendId: string) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  const response = await instance.post(`/friends/block/${friendId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};
