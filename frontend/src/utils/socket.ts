import { io } from "socket.io-client";
import { ACCESS_TOKEN_KEY, socketUrl } from "@/constants";

export const socket = io(socketUrl, {
  autoConnect: false,
  auth: (cb) => cb({ token: localStorage.getItem(ACCESS_TOKEN_KEY) }),
});
