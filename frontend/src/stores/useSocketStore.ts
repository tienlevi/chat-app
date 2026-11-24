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
  activeReceiverId: string;
  setActiveReceiverId: (id: string) => void;
  sendMessage: (data: IMessage) => void;
  readMessage: (receiverId: string) => void;
  unsendMessage: (messageId: string) => void;
}

const useSocketStore = create<Store>((set, get) => ({
  socket: null,
  messages: [],
  activeReceiverId: "",
  connectSocket: () => {
    if (get().socket) return;

    const socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
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
      const { messages, activeReceiverId } = get();

      if (data.senderId === activeReceiverId) {
        set({ messages: [...messages, data] });
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MESSAGE] });
    });

    socket.on("unsend-message", ({ messageId }: { messageId: string }) => {
      const { messages } = get();

      set({
        messages: messages.map((m) =>
          m._id === messageId ? { ...m, isUnsend: true } : m,
        ),
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.MESSAGE] });
    });

    socket.on("read-message", ({ readerId }: { readerId: string }) => {
      const { messages } = get();

      set({
        messages: messages.map((m) =>
          m.receiverId === readerId ? { ...m, isRead: true } : m,
        ),
      });
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
  setActiveReceiverId: (id) => set({ activeReceiverId: id }),
  sendMessage: (data) => {
    const { messages, socket } = get();
    socket?.emit("send-message", data);
    set({ messages: [...messages, data] });
  },
  readMessage: (receiverId) => {
    const { messages, socket } = get();
    socket?.emit("read-message", { receiverId });
    set({
      messages: messages.map((m) =>
        m.senderId === receiverId ? { ...m, isRead: true } : m,
      ),
    });
  },
  unsendMessage: (messageId: string) => {
    const { messages, socket } = get();
    socket?.emit("unsend-message", { messageId });

    set({
      messages: messages.map((m) =>
        m._id === messageId ? { ...m, isUnsend: true } : m,
      ),
    });
  },
}));

export default useSocketStore;
