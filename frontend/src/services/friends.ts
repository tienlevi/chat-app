import { instance } from "@/utils/axios";

export const getFriends = async (accessToken: string) => {
  const response = await instance.get(`/friends`, {
    headers: { Authorization: `Bearer ${accessToken}` },
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
