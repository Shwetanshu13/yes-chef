## Yes Chef

Lightweight recipe vault with Postgres, Drizzle, and AI assists.

### What it does

- Email/password auth with JWT cookies (Next.js API routes)
- Manual, semi-AI (structure messy text), and full-AI (prompt) recipe creation
- Friend connections to browse each other’s recipes
- Filters by cuisine, course, type, search, and scope (mine/friends/all)
- Image uploads (Cloudinary) and recipe images

### Stack

- Next.js App Router (proxy file convention)
- Drizzle ORM + Postgres
- `@google/generative-ai` (Gemini 2.5) for AI routes
- Cloudinary uploads
- pnpm

### Quick start

1. Install

```bash
pnpm install
```

2. Env — copy `.env.example` to `.env.local` and set:

- `DATABASE_URL` (Postgres connection string)
- `JWT_SECRET` (signs session tokens)
- `GEMINI_API_KEY` (server-side, used by AI routes)
- `CLOUDINARY_URL` (or the separate Cloudinary creds) if you use image upload

3. Database migrations

```bash
pnpm dlx drizzle-kit generate
pnpm dlx drizzle-kit push
```

4. Run

```bash
pnpm dev
```

### Auth + proxy

- Session cookie name: `yc_session`.
- Auth gating lives in `proxy.js` (replaces deprecated middleware) and redirects unauthenticated users to `/login` with `?redirect=`.

### AI routes

- `/api/ai/structure` accepts freeform recipe text and returns structured JSON.
- `/api/ai/generate` accepts a prompt and returns a full recipe.
- Server-side only; keep `GEMINI_API_KEY` out of the client.

### Recipes API

- POST `/api/recipes` creates a recipe for the current user.
- GET `/api/recipes?search&cuisine&course&type&scope=` supports filtering and scope (`all|mine|friends`).
- PATCH/DELETE `/api/recipes/:id` enforce ownership.

### Friends API

- POST `/api/friends` adds a friend by email (must exist as a user).
- GET `/api/friends` lists your connections.

### UI notes

- Single light theme; no runtime theme toggle.
- Toasts via custom provider.
- Cards and forms use shared CSS vars in `app/globals.css`.

### Scripts

- `pnpm dev` — start dev server (Turbopack).
- `pnpm build` — production build.
- `pnpm lint` — lint (if configured).

### Troubleshooting

- If you see proxy/middleware warnings, ensure `proxy.js` exists at the repo root.
- Enum errors (e.g., cuisine/type) usually mean the AI returned a value outside the allowed enums; normalization is applied server-side and in the AI helpers.
