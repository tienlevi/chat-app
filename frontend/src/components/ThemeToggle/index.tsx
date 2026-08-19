import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {theme === "light" ? (
        <Button
          className="rounded-full"
          size={"icon-sm"}
          onClick={() => setTheme("dark")}
        >
          <Moon />
        </Button>
      ) : (
        <Button
          className="rounded-full"
          size={"icon-sm"}
          onClick={() => setTheme("light")}
        >
          <Sun color="white" />
        </Button>
      )}
    </div>
  );
}

export default ThemeToggle;
