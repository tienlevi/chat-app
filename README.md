# ChatApp

A full-stack chat application: a React 19 + Tailwind v4 single-page app talking to a NestJS 11 + MongoDB REST API, with email-verified registration, JWT access/refresh token rotation, and a bilingual (English / Vietnamese) interface.

```
chat-app/
├── backend/    # NestJS 11 REST API, Mongoose, JWT, Nodemailer
└── frontend/   # React 19 SPA, Vite, TailwindCSS v4, ShadCN UI
```

Each workspace is installed and run independently — there is no root `package.json`.

## Tech stack

**Backend**

- NestJS 11 with Express
- MongoDB via Mongoose 9 (`@nestjs/mongoose`)
- `@nestjs/jwt` for access and refresh tokens
- `bcrypt` for password and OTP hashing
- `@nestjs-modules/mailer` + Nodemailer + Handlebars templates
- Jest for unit and e2e tests

**Frontend**

- React 19 + TypeScript (strict) on Vite 6 with the SWC plugin
- TailwindCSS v4.1 (CSS-first config, oklch design tokens)
- ShadCN UI (`new-york` style) on Radix primitives, `lucide-react` icons
- React Router DOM v7, TanStack Query v5
- `react-hook-form` + Zod v4
- `i18next` / `react-i18next` (en, vi)
- Axios with request/response interceptors, `js-cookie`, `sonner` toasts
- Vitest + Testing Library

**Package manager: pnpm only.** Do not use npm, yarn, or bun in either workspace.

---

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 9+
- A MongoDB instance (local or Atlas)
- A Gmail account with an app password, for verification emails
- A Cloudinary account, for avatar uploads

### 1. Backend

```bash
cd backend
pnpm install
# create .env — see Environment variables below
pnpm dev               # http://localhost:3000/api
```

### 2. Frontend

```bash
cd frontend
pnpm install
# create .env with the Cloudinary keys listed below
pnpm dev               # http://localhost:5173
```

The frontend expects the API at `http://localhost:3000/api`. That value is hardcoded in `frontend/src/constants/index.ts` (`baseApi`) — change it there if your API runs elsewhere.

---

## Environment variables

### `backend/.env`

| Variable       | Description                                                                  |
| -------------- | ---------------------------------------------------------------------------- |
| `MONGODB_URI`  | MongoDB connection string                                                    |
| `JWT_TOKEN`    | Secret used to sign both access and refresh tokens                           |
| `SMTP_USER`    | Gmail address that sends verification mail                                   |
| `SMTP_PASS`    | Gmail app password                                                           |
| `PORT`         | Optional, defaults to `3000`                                                 |
| `NODE_ENV`     | Switches `baseApi` between the local and production URL                      |
| `CORS_ORIGINS` | Present in `.env` but **not currently read** — see [Known gaps](#known-gaps) |

### `frontend/.env`

All frontend variables must be prefixed with `VITE_` to be exposed to the client bundle.

| Variable                         | Description                        |
| -------------------------------- | ---------------------------------- |
| `VITE_CLOUDINARY_CLOUD_NAME`     | Cloudinary cloud name              |
| `VITE_CLOUDINARY_UPLOAD_PRESET`  | Unsigned upload preset for avatars |
| `VITE_CLOUDINARY_API_KEY`        | Cloudinary API key                 |
| `VITE_CLOUDINARY_API_KEY_SECRET` | Cloudinary API secret              |

> **Warning:** `VITE_*` variables are embedded in the built JavaScript and are readable by anyone who loads the app. Do not put a real Cloudinary API secret here — use an unsigned upload preset, or move signing to the backend.

Neither `.env` file is committed.

---

## Backend

Bootstrapped in `src/main.ts`: global route prefix `api`, CORS enabled for `http://localhost:5173` and the deployed Vercel origin with credentials, listening on `PORT` (default `3000`).

```
backend/src/
├── constants/          # Response codes, default avatar, baseApi
├── guards/             # AuthGuard — verifies the Bearer token, attaches req.user
├── interfaces/         # AuthenticatedRequest, JwtPayload, OTPType, IUser
├── mail/               # MailerModule config + Handlebars templates
├── middlewares/        # RegisterMiddleware — issues and rate-limits the signup OTP
├── modules/
│   ├── auth/           # login, register, verify-email
│   ├── message/        # sendMessage
│   ├── otp/            # OTP generation service
│   └── token/          # refresh-token
├── schemas/            # Mongoose models: User, Otp, Token, Message
├── utils/              # format, random (OTP code generator)
├── app.module.ts       # Root module: Config, Mongoose, global JwtModule
└── main.ts
```

### Data model

| Collection | Fields                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `User`     | `name`, `email`, `password` (bcrypt), `isAuthenticated`, `avatar`, timestamps                                              |
| `Otp`      | `code` (bcrypt), `email`, `type` (`verify` / `reset-otp` / `reset-password`), `expiresAt` (epoch ms), `isUsed`, timestamps |
| `Token`    | `refreshToken`, `userId` (ref `User`), timestamps — one document per user, upserted                                        |
| `Message`  | `senderId`, `receiverId`, `text`, `files[]` (`type`: file/image/video, `url`), `isDeleted`, timestamps                     |

### Error codes

`AuthService` throws `HttpException`s carrying a stable `code` from `src/constants/response-code.ts`, which the frontend maps to a translated toast:

- `ACCOUNT_NOT_FOUND` — no user with that email (403)
- `ACCOUNT_NOT_AUTHENTICATED` — email not yet verified (401)
- `INVALID_CREDENTIALS` — wrong password (406)

Frontend translations live under `errors.*` in `frontend/src/locales/{en,vi}.json`, with `errors.default` as the fallback.

---

## Frontend

```
frontend/src/
├── assets/css/index.css    # Tailwind entry, oklch design tokens, custom utilities
├── components/
│   ├── ui/                 # ShadCN primitives (pnpm dlx shadcn@latest add ...)
│   ├── Chat/               # NavRail, ConversationList, ChatHeader, MessageThread,
│   │                       # MessageBubble, MessageComposer, DetailsPanel, UserAvatar
│   └── LoginForm/ RegisterForm/ LanguageSwitcher/ ThemeToggle/ Wordmark/
├── constants/              # API base URL, storage keys, query keys, images, mock chat data
├── contexts/               # QueryContext (TanStack Query), ThemeContext (light/dark)
├── hooks/                  # useLogin, useRegister — TanStack Query mutations
├── interfaces/             # user, token, routes, chat
├── locales/                # en.json, vi.json
├── pages/                  # Home (login), Register, Dashboard (chat)
├── routes/routes.tsx       # Route array: { href, id, name, element }
├── services/               # Raw API calls: auth, token, cloudinary
└── utils/                  # axios instance, i18n, zod schemas, datetime, cropImage
```

### Routes

| Path         | Page                             |
| ------------ | -------------------------------- |
| `/`          | Login                            |
| `/register`  | Registration with avatar cropper |
| `/dashboard` | Chat UI                          |
| `*`          | Redirects to `/`                 |

### Layering

Components call **hooks**, hooks call **services**, services call the shared Axios `instance`. Components never import services directly — the hooks own the toast and cache-invalidation side effects.

## API reference

Base URL: `http://localhost:3000/api`

| Method | Endpoint                                         | Auth                   | Body / Params                                         | Description                                               |
| ------ | ------------------------------------------------ | ---------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| `POST` | `/auth/register`                                 | —                      | `{ name, email, password, confirmPassword, avatar? }` | Creates an unverified user and emails a verification code |
| `POST` | `/auth/login`                                    | —                      | `{ email, password }`                                 | Returns `{ message, data, accessToken, refreshToken }`    |
| `GET`  | `/auth/verify-email`                             | —                      | query: `email`, `code`, `otpId`                       | Marks the account verified                                |
| `POST` | `/token/refresh-token`                           | Bearer (refresh token) | —                                                     | Returns a new access/refresh pair                         |
| `POST` | `/message/sender/:senderId/receiver/:receiverId` | —                      | `{ text, files[] }`                                   | Persists a message                                        |

---

## Scripts

### Backend (`cd backend`)

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `pnpm dev`        | Start in watch mode               |
| `pnpm start`      | Start once                        |
| `pnpm build`      | Compile to `dist/`                |
| `pnpm start:prod` | Run the compiled build            |
| `pnpm lint`       | ESLint with `--fix`               |
| `pnpm format`     | Prettier over `src/` and `test/`  |
| `pnpm test`       | Jest unit tests (`*.spec.ts`)     |
| `pnpm test:cov`   | Jest with coverage                |
| `pnpm test:e2e`   | Jest e2e via `test/jest-e2e.json` |

### Frontend (`cd frontend`)

| Command                                  | Description                                             |
| ---------------------------------------- | ------------------------------------------------------- |
| `pnpm dev`                               | Vite dev server                                         |
| `pnpm build`                             | `tsc -b` then production build                          |
| `pnpm preview`                           | Preview the production build                            |
| `pnpm lint`                              | ESLint                                                  |
| `pnpm format` / `pnpm format:check`      | Prettier write / check                                  |
| `pnpm test`                              | Vitest in watch mode                                    |
| `pnpm test:ui`                           | Vitest UI                                               |
| `pnpm test:coverage`                     | Vitest with coverage                                    |
| `pnpm dlx shadcn@latest add [component]` | Vendor a new ShadCN component into `src/components/ui/` |

---
