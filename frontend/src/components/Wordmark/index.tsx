import { IMAGES } from "@/constants/images";

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <img src={IMAGES.logo} alt="chatapp" width={200} height={100} />
    </div>
  );
}

export default Wordmark;
