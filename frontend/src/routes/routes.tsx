import { Routes } from "@/interfaces/routes";
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

  // Add other routes as needed
];
