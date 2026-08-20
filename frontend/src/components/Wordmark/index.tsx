import { IMAGES } from "@/constants/images";
import { useTheme } from "@/contexts/ThemeContext";

function Wordmark({ className = "" }: { className?: string }) {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {theme === "light" ? (
        <img src={IMAGES.logo} alt="chatapp" width={200} height={100} />
      ) : (
        <img src={IMAGES.logoWhite} alt="chatapp" width={200} height={100} />
      )}
    </div>
  );
}

export default Wordmark;
