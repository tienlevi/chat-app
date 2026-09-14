import ChatLayout from "@/components/layouts/ChatLayout";
import { Routes } from "@/interfaces/routes";
import Chat from "@/pages/Chat";
import Friends from "@/pages/Friends";
import Home from "@/pages/Home";
import Register from "@/pages/Register";

export const routers: Routes[] = [
  {
    href: "/",
    id: "home",
    name: "Home",
    element: <Home />,
  },
  {
    href: "/register",
    id: "register",
    name: "Register",
    element: <Register />,
  },
  {
    href: "/chat",
    id: "chat",
    name: "Chat",
    element: (
      <ChatLayout>
        <Chat />
      </ChatLayout>
    ),
  },
  {
    href: "/friends",
    id: "friends",
    name: "Friends",
    element: (
      <ChatLayout>
        <Friends />
      </ChatLayout>
    ),
  },

  // Add other routes as needed
];
