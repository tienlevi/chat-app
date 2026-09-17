import { Loader2 } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { ReactNode } from "react";

function AuthGuard({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useAuth();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" || location.pathname === "/register";

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user && isAuthPage) return <Navigate to={"/chat"} replace />;

  if (!user && !isAuthPage) return <Navigate to={"/"} replace />;

  return children;
}

export default AuthGuard;
