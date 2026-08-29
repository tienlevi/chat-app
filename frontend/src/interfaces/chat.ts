export type PresenceStatus = "online" | "away" | "offline";

export type ConversationFilter = "all" | "unread" | "groups";

/** Mirrors the `type` enum of the embedded file schema on the backend. */

/** Reaction keys backing the assets in `public/emoji`. */

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  status: PresenceStatus;
  /** Short line shown in the details panel, e.g. a role or bio. */
  headline?: string;
}

/** Shape of a `Message` document as the API returns it. */

export interface Conversation {
  id: string;
  kind: "direct" | "group";
  name: string;
  avatar?: string;
  participants: ChatParticipant[];
  unreadCount: number;
  pinned?: boolean;
  muted?: boolean;
  typing?: boolean;
  /** Preview of the newest message, used by the conversation list. */
  preview: string;
  previewSenderId: string;
  updatedAt: string;
}
