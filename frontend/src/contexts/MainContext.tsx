import useAuth from "@/hooks/useAuth";
import useSocketStore from "@/stores/useSocketStore";
import { ReactNode, useEffect } from "react";

function MainContext({ children }: { children: ReactNode }) {
  const { data: user } = useAuth();
  const { connectSocket, disconnectSocket } = useSocketStore();
  useEffect(() => {
    if (user) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);

  return children;
}

export default MainContext;
