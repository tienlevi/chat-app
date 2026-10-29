import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { ACCESS_TOKEN_KEY, socketUrl } from "@/constants";
import { IMessage } from "@/interfaces/message";
import { QUERY_KEY } from "@/constants/query-key";
import { queryClient } from "@/contexts/QueryContext";

interface Store {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
  messages: IMessage[];
  setMessages: (messages: IMessage[]) => void;
  sendMessage: (data: IMessage) => void;
}

const useSocketStore = create<Store>((set, get) => ({
  socket: null,
  messages: [],
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

    socket.on("receive-message", (data: IMessage) => {
      set({ messages: [...get().messages, data] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MESSAGE] });
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
  setMessages: (messages) => set({ messages }),
  sendMessage: (data) => {
    const { messages } = get();
    set({ messages: [...messages, data] });
  },
}));

export default useSocketStore;
