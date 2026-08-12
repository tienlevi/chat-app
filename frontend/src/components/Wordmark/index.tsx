import { Flame } from "lucide-react";

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Flame className="size-4" strokeWidth={2.5} />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">
        ChatApp
      </span>
    </div>
  );
}

export default Wordmark;
