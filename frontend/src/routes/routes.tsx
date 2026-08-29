import { Routes } from "@/interfaces/routes";
import Chat from "@/pages/Chat";
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
    element: <Chat />,
  },

  // Add other routes as needed
];
