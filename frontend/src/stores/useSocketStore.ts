import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { ACCESS_TOKEN_KEY, socketUrl } from "@/constants";

interface Store {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const useSocketStore = create<Store>((set, get) => ({
  socket: null,
  connectSocket: () => {
    if (get().socket) return;

    const socket = io(socketUrl, {
      autoConnect: false,
      auth: (cb) => cb({ token: localStorage.getItem(ACCESS_TOKEN_KEY) }),
    });

    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("disconnect", (reason: string) =>
      console.log("Socket disconnected:", reason),
    );
    socket.on("connect_error", (error: Error) =>
      console.error("Socket connection error:", error.message),
    );
    socket.on("exception", (error: unknown) =>
      console.error("Socket exception:", error),
    );
    socket.on("message", () => {
      return;
    });
    socket.connect();

    set({ socket });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (!socket) return;

    socket.removeAllListeners();
    socket.disconnect();
    set({ socket: null });
  },
}));

export default useSocketStore;
