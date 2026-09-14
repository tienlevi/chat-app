import type IUser from "@/interfaces/user";
import type { IMessage } from "@/interfaces/message";

/**
 * Placeholder data for the dashboard. Timestamps are generated relative to the
 * current time so the UI always reads as a live inbox. Swap this module out for
 * the real API once the messaging endpoints land.
 */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const ago = (ms: number): string => new Date(Date.now() - ms).toISOString();

/** Messages are never edited here, so both stamps share one value. */
const stamps = (ms: number): Pick<IMessage, "createdAt" | "updatedAt"> => {
  const iso = ago(ms);
  return { createdAt: iso, updatedAt: iso };
};

export const CURRENT_USER_ID = "me";

export const CURRENT_USER: IUser = {
  _id: CURRENT_USER_ID,
  name: "You",
  email: "me@example.com",
};

/** Everyone the current user has a direct thread with. */
export const USERS: IUser[] = [
  { _id: "mai", name: "Mai Nguyen", email: "mai.nguyen@example.com" },
  { _id: "tobias", name: "Tobias Rehn", email: "tobias.rehn@example.com" },
  { _id: "priya", name: "Priya Raman", email: "priya.raman@example.com" },
  {
    _id: "sofia",
    name: "Sofia Marchetti",
    email: "sofia.marchetti@example.com",
  },
  { _id: "linh", name: "Linh Pham", email: "linh.pham@example.com" },
  { _id: "dad", name: "Dad", email: "dad@example.com" },
];

export const MESSAGES: IMessage[] = [
  // Mai
  {
    _id: "m1",
    senderId: "mai",
    receiverId: CURRENT_USER_ID,
    text: "Morning! Did you get a chance to look at the onboarding prototype?",
    files: [],
    isDeleted: false,
    isRead: true,
    ...stamps(DAY + 5 * HOUR),
  },
  {
    _id: "m2",
    senderId: CURRENT_USER_ID,
    receiverId: "mai",
    text: "I did — the three-step version is much calmer than what we had.",
    files: [],
    isDeleted: false,
    isRead: true,
    ...stamps(DAY + 4.6 * HOUR),
  },
  {
    _id: "m3",
    senderId: CURRENT_USER_ID,
    receiverId: "mai",
    text: "My only worry is the avatar step. Feels early to ask for a photo.",
    files: [],
    isDeleted: false,
    isRead: true,
    ...stamps(DAY + 4.5 * HOUR),
  },
  {
    _id: "m4",
    senderId: "mai",
    receiverId: CURRENT_USER_ID,
    text: "Agreed. I moved it behind a skip link and the drop-off went away.",
    files: [],
    isDeleted: false,
    isRead: true,
    emoji: "like",
    ...stamps(DAY + 4 * HOUR),
  },
  {
    _id: "m5",
    senderId: "mai",
    receiverId: CURRENT_USER_ID,
    text: "Here's the annotated flow, second frame is the one we changed.",
    files: [
      {
        _id: "a1",
        type: "file",
        url: "/uploads/onboarding-v4-annotated.fig",
      },
    ],
    isDeleted: false,
    isRead: true,
    ...stamps(6 * HOUR),
  },
  {
    _id: "m6",
    senderId: CURRENT_USER_ID,
    receiverId: "mai",
    text: "Perfect. I'll wire the skip link this afternoon and put it on staging.",
    files: [],
    isDeleted: false,
    isRead: true,
    ...stamps(5.5 * HOUR),
  },
  {
    _id: "m7",
    senderId: "mai",
    receiverId: CURRENT_USER_ID,
    text: "The new onboarding flow tested really well this morning",
    files: [],
    isDeleted: false,
    isRead: false,
    ...stamps(9 * MINUTE),
  },
  {
    _id: "m8",
    senderId: "mai",
    receiverId: CURRENT_USER_ID,
    text: "Five out of six people finished without a single hesitation 🙌",
    files: [],
    isDeleted: false,
    isRead: false,
    ...stamps(4 * MINUTE),
  },

  // Tobias
  {
    _id: "t1",
    senderId: "tobias",
    receiverId: CURRENT_USER_ID,
    text: "The 401 retry loop is back on staging. Any idea?",
    files: [],
    isDeleted: false,
    isRead: true,
    ...stamps(5 * HOUR),
  },
  {
    _id: "t2",
    senderId: CURRENT_USER_ID,
    receiverId: "tobias",
    text: "Yeah — the interceptor was retrying the refresh call itself. Fixed.",
    files: [],
    isDeleted: false,
    isRead: true,
    ...stamps(3.4 * HOUR),
  },
  {
    _id: "t3",
    senderId: CURRENT_USER_ID,
    receiverId: "tobias",
    text: "pushed the refresh-token interceptor, give it a spin",
    files: [],
    isDeleted: false,
    isRead: false,
    ...stamps(3 * HOUR),
  },

  // Priya
  {
    _id: "p1",
    senderId: "priya",
    receiverId: CURRENT_USER_ID,
    text: "Can you take the standup tomorrow? I'm on a plane",
    files: [],
    isDeleted: false,
    isRead: false,
    ...stamps(7 * HOUR),
  },

  // Sofia
  {
    _id: "s1",
    senderId: CURRENT_USER_ID,
    receiverId: "sofia",
    text: "The ink variant is going on the homepage. It's stunning.",
    files: [],
    isDeleted: false,
    isRead: true,
    ...stamps(2 * DAY + HOUR),
  },
  {
    _id: "s2",
    senderId: "sofia",
    receiverId: CURRENT_USER_ID,
    text: "grazie! ship it 🎉",
    files: [],
    isDeleted: false,
    isRead: true,
    ...stamps(2 * DAY),
  },
  {
    _id: "s3",
    senderId: "sofia",
    receiverId: CURRENT_USER_ID,
    text: "dropped two cover options for the spring issue",
    files: [
      { _id: "s3a", type: "image", url: "/uploads/cover-warm.png" },
      { _id: "s3b", type: "image", url: "/uploads/cover-ink.png" },
    ],
    isDeleted: false,
    isRead: false,
    ...stamps(38 * MINUTE),
  },

  // Linh
  {
    _id: "l1",
    senderId: CURRENT_USER_ID,
    receiverId: "linh",
    text: "the microcopy reads much warmer now, thank you",
    files: [],
    isDeleted: false,
    isRead: true,
    ...stamps(4 * DAY),
  },

  // Dad
  {
    _id: "f1",
    senderId: "dad",
    receiverId: CURRENT_USER_ID,
    text: "Call me when you land",
    files: [],
    isDeleted: false,
    isRead: true,
    ...stamps(9 * DAY),
  },
];

/** Keyed by the other user's `_id`. */
export const SHARED_FILES: Record<string, string[]> = {
  mai: ["onboarding-v4-annotated.fig", "usability-notes.pdf"],
  sofia: ["cover-warm.png", "cover-ink.png"],
};
