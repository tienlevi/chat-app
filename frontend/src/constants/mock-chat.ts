import type { ChatParticipant, Conversation } from "@/interfaces/chat";
import { ChatMessage } from "@/interfaces/message";

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
const stamps = (ms: number): Pick<ChatMessage, "createdAt" | "updatedAt"> => {
  const iso = ago(ms);
  return { createdAt: iso, updatedAt: iso };
};

export const CURRENT_USER_ID = "me";

export const PARTICIPANTS: Record<string, ChatParticipant> = {
  me: {
    id: "me",
    name: "You",
    status: "online",
  },
  mai: {
    id: "mai",
    name: "Mai Nguyen",
    status: "online",
    headline: "Product designer · Da Nang",
  },
  tobias: {
    id: "tobias",
    name: "Tobias Rehn",
    status: "away",
    headline: "Backend engineer · Berlin",
  },
  priya: {
    id: "priya",
    name: "Priya Raman",
    status: "online",
    headline: "Engineering manager · Bangalore",
  },
  linh: {
    id: "linh",
    name: "Linh Pham",
    status: "offline",
    headline: "Copywriter · Ha Noi",
  },
  sofia: {
    id: "sofia",
    name: "Sofia Marchetti",
    status: "online",
    headline: "Illustrator · Milan",
  },
  dad: {
    id: "dad",
    name: "Dad",
    status: "offline",
  },
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c-mai",
    kind: "direct",
    name: PARTICIPANTS.mai.name,
    participants: [PARTICIPANTS.mai],
    unreadCount: 2,
    pinned: true,
    typing: true,
    preview: "The new onboarding flow tested really well this morning",
    previewSenderId: "mai",
    updatedAt: ago(4 * MINUTE),
  },
  {
    id: "c-design",
    kind: "group",
    name: "Design guild",
    participants: [
      PARTICIPANTS.sofia,
      PARTICIPANTS.priya,
      PARTICIPANTS.linh,
      PARTICIPANTS.mai,
    ],
    unreadCount: 5,
    pinned: true,
    preview: "Sofia: dropped three cover options in the shared folder",
    previewSenderId: "sofia",
    updatedAt: ago(38 * MINUTE),
  },
  {
    id: "c-tobias",
    kind: "direct",
    name: PARTICIPANTS.tobias.name,
    participants: [PARTICIPANTS.tobias],
    unreadCount: 0,
    preview: "You: pushed the refresh-token interceptor, give it a spin",
    previewSenderId: "me",
    updatedAt: ago(3 * HOUR),
  },
  {
    id: "c-priya",
    kind: "direct",
    name: PARTICIPANTS.priya.name,
    participants: [PARTICIPANTS.priya],
    unreadCount: 1,
    preview: "Can you take the standup tomorrow? I'm on a plane",
    previewSenderId: "priya",
    updatedAt: ago(7 * HOUR),
  },
  {
    id: "c-release",
    kind: "group",
    name: "Release train 4.2",
    participants: [PARTICIPANTS.tobias, PARTICIPANTS.priya, PARTICIPANTS.mai],
    unreadCount: 0,
    muted: true,
    preview: "Tobias: staging is green, cutting the tag at 18:00",
    previewSenderId: "tobias",
    updatedAt: ago(DAY + 2 * HOUR),
  },
  {
    id: "c-sofia",
    kind: "direct",
    name: PARTICIPANTS.sofia.name,
    participants: [PARTICIPANTS.sofia],
    unreadCount: 0,
    preview: "grazie! ship it 🎉",
    previewSenderId: "sofia",
    updatedAt: ago(2 * DAY),
  },
  {
    id: "c-linh",
    kind: "direct",
    name: PARTICIPANTS.linh.name,
    participants: [PARTICIPANTS.linh],
    unreadCount: 0,
    preview: "You: the microcopy reads much warmer now, thank you",
    previewSenderId: "me",
    updatedAt: ago(4 * DAY),
  },
  {
    id: "c-dad",
    kind: "direct",
    name: PARTICIPANTS.dad.name,
    participants: [PARTICIPANTS.dad],
    unreadCount: 0,
    preview: "Call me when you land",
    previewSenderId: "dad",
    updatedAt: ago(9 * DAY),
  },
];

export const MESSAGES: Record<string, ChatMessage[]> = {
  "c-mai": [
    {
      _id: "m1",
      receiverId: "c-mai",
      senderId: "mai",
      text: "Morning! Did you get a chance to look at the onboarding prototype?",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(DAY + 5 * HOUR),
    },
    {
      _id: "m2",
      receiverId: "c-mai",
      senderId: "me",
      text: "I did — the three-step version is much calmer than what we had.",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(DAY + 4.6 * HOUR),
    },
    {
      _id: "m3",
      receiverId: "c-mai",
      senderId: "me",
      text: "My only worry is the avatar step. Feels early to ask for a photo.",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(DAY + 4.5 * HOUR),
    },
    {
      _id: "m4",
      receiverId: "c-mai",
      senderId: "mai",
      text: "Agreed. I moved it behind a skip link and the drop-off went away.",
      files: [],
      isDeleted: false,
      isRead: true,
      emoji: "like",
      ...stamps(DAY + 4 * HOUR),
    },
    {
      _id: "m5",
      receiverId: "c-mai",
      senderId: "mai",
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
      receiverId: "c-mai",
      senderId: "me",
      text: "Perfect. I'll wire the skip link this afternoon and put it on staging.",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(5.5 * HOUR),
    },
    {
      _id: "m7",
      receiverId: "c-mai",
      senderId: "mai",
      text: "The new onboarding flow tested really well this morning",
      files: [],
      isDeleted: false,
      isRead: false,
      ...stamps(9 * MINUTE),
    },
    {
      _id: "m8",
      receiverId: "c-mai",
      senderId: "mai",
      text: "Five out of six people finished without a single hesitation 🙌",
      files: [],
      isDeleted: false,
      isRead: false,
      ...stamps(4 * MINUTE),
    },
  ],
  "c-design": [
    {
      _id: "d1",
      receiverId: "c-design",
      senderId: "priya",
      text: "Reminder: cover art for the spring issue is due Friday.",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(2 * DAY),
    },
    {
      _id: "d2",
      receiverId: "c-design",
      senderId: "linh",
      text: "Headline is locked — “Slow software, made carefully”.",
      files: [],
      isDeleted: false,
      isRead: true,
      emoji: "heart",
      ...stamps(DAY + 3 * HOUR),
    },
    {
      _id: "d3",
      receiverId: "c-design",
      senderId: "me",
      text: "That reads beautifully. Sofia, does it fit the serif treatment?",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(DAY + 2 * HOUR),
    },
    {
      _id: "d4",
      receiverId: "c-design",
      senderId: "sofia",
      text: "dropped three cover options in the shared folder",
      files: [
        { _id: "d4a", type: "image", url: "/uploads/cover-warm.png" },
        { _id: "d4b", type: "image", url: "/uploads/cover-ink.png" },
      ],
      isDeleted: false,
      isRead: false,
      ...stamps(38 * MINUTE),
    },
  ],
  "c-tobias": [
    {
      _id: "t1",
      receiverId: "c-tobias",
      senderId: "tobias",
      text: "The 401 retry loop is back on staging. Any idea?",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(5 * HOUR),
    },
    {
      _id: "t2",
      receiverId: "c-tobias",
      senderId: "me",
      text: "Yeah — the interceptor was retrying the refresh call itself. Fixed.",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(3.4 * HOUR),
    },
    {
      _id: "t3",
      receiverId: "c-tobias",
      senderId: "me",
      text: "pushed the refresh-token interceptor, give it a spin",
      files: [],
      isDeleted: false,
      isRead: false,
      ...stamps(3 * HOUR),
    },
  ],
  "c-priya": [
    {
      _id: "p1",
      receiverId: "c-priya",
      senderId: "priya",
      text: "Can you take the standup tomorrow? I'm on a plane",
      files: [],
      isDeleted: false,
      isRead: false,
      ...stamps(7 * HOUR),
    },
  ],
  "c-release": [
    {
      _id: "r1",
      receiverId: "c-release",
      senderId: "tobias",
      text: "staging is green, cutting the tag at 18:00",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(DAY + 2 * HOUR),
    },
  ],
  "c-sofia": [
    {
      _id: "s1",
      receiverId: "c-sofia",
      senderId: "me",
      text: "The ink variant is going on the homepage. It's stunning.",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(2 * DAY + HOUR),
    },
    {
      _id: "s2",
      receiverId: "c-sofia",
      senderId: "sofia",
      text: "grazie! ship it 🎉",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(2 * DAY),
    },
  ],
  "c-linh": [
    {
      _id: "l1",
      receiverId: "c-linh",
      senderId: "me",
      text: "the microcopy reads much warmer now, thank you",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(4 * DAY),
    },
  ],
  "c-dad": [
    {
      _id: "f1",
      receiverId: "c-dad",
      senderId: "dad",
      text: "Call me when you land",
      files: [],
      isDeleted: false,
      isRead: true,
      ...stamps(9 * DAY),
    },
  ],
};

export const SHARED_FILES: Record<string, string[]> = {
  "c-mai": ["onboarding-v4-annotated.fig", "usability-notes.pdf"],
  "c-design": ["cover-warm.png", "cover-ink.png", "spring-issue-brief.md"],
};
