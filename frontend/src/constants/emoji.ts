import type { MessageEmoji } from "@/interfaces/message";

export const MESSAGE_EMOJIS: { key: MessageEmoji; char: string }[] = [
  { key: "like", char: "👍" },
  { key: "dislike", char: "👎" },
  { key: "heart", char: "❤️" },
  { key: "smile", char: "😄" },
  { key: "sad", char: "😢" },
  { key: "angry", char: "😠" },
];
