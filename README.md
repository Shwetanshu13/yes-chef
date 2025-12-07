## Yes Chef — Next.js + Appwrite + Gemini 2.5

A minimal recipe vault featuring:

- Email/password auth (Appwrite Account)
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

- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT`
- `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
- `NEXT_PUBLIC_APPWRITE_RECIPE_COLLECTION_ID`
- `NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID`
- `NEXT_PUBLIC_APPWRITE_FRIEND_COLLECTION_ID`
- `GEMINI_API_KEY` (server-side, used by API routes)

3. Appwrite collections (all string unless noted):

- Profiles: `name`, `email`, `userId`
- Recipes: `ownerId`, `title`, `description`, `cuisine`, `type`, `course`, `nutrition` (object), `ingredients` (string array), `steps` (string array), `image`, `link`
- Friends: `ownerId`, `friendId`, `friendName`, `friendEmail`

Set permissions so logged-in users can create/read their documents; recipes should allow read for owner + friends (or use collection-level read for users and rely on `ownerId` filters).

4. Gemini

API routes `/api/ai/structure` and `/api/ai/generate` use the `@google/generative-ai` SDK with model `gemini-2.5-pro`. Keep `GEMINI_API_KEY` private (server env only).
