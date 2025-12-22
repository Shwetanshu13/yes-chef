# Yes Chef Frontend

Next.js frontend for the Yes Chef recipe management app.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env.local` file:

```bash
cp .env.example .env.local
```

3. Set `NEXT_PUBLIC_API_URL` to your backend URL (default: `http://localhost:5000`)

4. Start the dev server:

```bash
pnpm dev
```

The frontend will run on `http://localhost:3000`.

## Features

- Recipe management (create, view, edit, delete)
- AI-powered recipe structuring and generation
- Friends system for sharing recipes
- Responsive design
