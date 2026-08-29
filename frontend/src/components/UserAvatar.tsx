import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PresenceStatus } from "@/interfaces/chat";

/**
 * Deterministic tints so the same person always keeps the same colour without
 * needing an uploaded photo.
 */
const TINTS = [
  "bg-[oklch(0.90_0.06_260)] text-[oklch(0.35_0.10_260)] dark:bg-[oklch(0.34_0.07_260)] dark:text-[oklch(0.92_0.04_260)]",
  "bg-[oklch(0.90_0.06_150)] text-[oklch(0.35_0.10_150)] dark:bg-[oklch(0.34_0.07_150)] dark:text-[oklch(0.92_0.04_150)]",
  "bg-[oklch(0.91_0.06_60)] text-[oklch(0.38_0.10_60)] dark:bg-[oklch(0.35_0.07_60)] dark:text-[oklch(0.93_0.04_60)]",
  "bg-[oklch(0.90_0.06_20)] text-[oklch(0.38_0.11_20)] dark:bg-[oklch(0.34_0.08_20)] dark:text-[oklch(0.92_0.04_20)]",
  "bg-[oklch(0.90_0.06_320)] text-[oklch(0.36_0.11_320)] dark:bg-[oklch(0.34_0.08_320)] dark:text-[oklch(0.92_0.04_320)]",
  "bg-[oklch(0.90_0.06_200)] text-[oklch(0.35_0.10_200)] dark:bg-[oklch(0.34_0.07_200)] dark:text-[oklch(0.92_0.04_200)]",
];

const PRESENCE_RING: Record<PresenceStatus, string> = {
  online: "bg-success",
  away: "bg-amber-500",
  offline: "bg-muted-foreground/50",
};

const SIZES = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-16",
} as const;

const TEXT_SIZES = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
} as const;

const DOT_SIZES = {
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
  xl: "size-3.5",
} as const;

export const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

const tintFor = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return TINTS[Math.abs(hash) % TINTS.length];
};

interface UserAvatarProps {
  name: string;
  seed?: string;
  src?: string;
  status?: PresenceStatus;
  size?: keyof typeof SIZES;
  className?: string;
}

function UserAvatar({
  name,
  seed,
  src,
  status,
  size = "md",
  className,
}: UserAvatarProps) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <Avatar className={cn(SIZES[size], "rounded-2xl")}>
        {src ? <AvatarImage src={src} alt={name} /> : null}
        <AvatarFallback
          className={cn(
            "rounded-2xl font-semibold tracking-tight",
            TEXT_SIZES[size],
            tintFor(seed ?? name),
          )}
        >
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      {status ? (
        <span
          aria-hidden
          className={cn(
            "absolute -right-0.5 -bottom-0.5 rounded-full ring-2 ring-card",
            DOT_SIZES[size],
            PRESENCE_RING[status],
          )}
        />
      ) : null}
    </div>
  );
}

export default UserAvatar;
