import ChatLayout from "@/components/layouts/ChatLayout";
import { Routes } from "@/interfaces/routes";
import Chat from "@/pages/Chat";
import Friends from "@/pages/Friends";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import AuthGuard from "./AuthGuard";

export const routers: Routes[] = [
  {
    href: "/",
    id: "home",
    name: "Home",
    element: (
      <AuthGuard>
        <Home />
      </AuthGuard>
    ),
  },
  {
    href: "/register",
    id: "register",
    name: "Register",
    element: (
      <AuthGuard>
        <Register />
      </AuthGuard>
    ),
  },
  {
    href: "/chat",
    id: "chat",
    name: "Chat",
    element: (
      <AuthGuard>
        <ChatLayout>
          <Chat />
        </ChatLayout>
      </AuthGuard>
    ),
  },
  {
    href: "/friends",
    id: "friends",
    name: "Friends",
    element: (
      <AuthGuard>
        <ChatLayout>
          <Friends />
        </ChatLayout>
      </AuthGuard>
    ),
  },

  // Add other routes as needed
];
