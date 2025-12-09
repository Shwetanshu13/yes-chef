## Yes Chef — Next.js + Drizzle + Postgres + Gemini 2.5

A minimal recipe vault featuring:

- Email/password auth with JWT cookies (Next.js API routes)
- Manual, semi-AI (structure messy text), and full-AI (prompt) recipe creation
- Friend connections to see each other’s recipes
- Filters by cuisine, course, type, and search

### Quick start

1. Install deps

```bash
pnpm install
pnpm dev
```

2. Configure environment — copy `.env.example` to `.env.local` and fill:

- `DATABASE_URL` (Postgres connection string)
- `JWT_SECRET` (for signing session tokens)
- `GEMINI_API_KEY` (server-side, used by API routes)

3. Drizzle schema (in `lib/db/schema.js`)

- `users`: id (uuid pk), name, email (unique), password_hash
- `recipes`: id, owner_id (fk users), title, description, cuisine (enum), type (enum), course (enum), nutrition (json), ingredients (json[]), steps (json[]), image, link
- `friends`: id, owner_id (fk users), friend_id (fk users), friend_name, friend_email

4. Migrate

```bash
pnpm dlx drizzle-kit generate
pnpm dlx drizzle-kit push
```

5. Gemini

API routes `/api/ai/structure` and `/api/ai/generate` use the `@google/generative-ai` SDK with model `gemini-2.5-pro`. Keep `GEMINI_API_KEY` private (server env only).
