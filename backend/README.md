# Yes Chef Backend

Express.js API for the Yes Chef recipe management app.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`

4. Run database migrations:

```bash
pnpm db:push
```

5. Start the server:

```bash
pnpm dev
```

## API Documentation

See the main [README.md](../README.md) for API endpoints.

## Mobile Client Support

The API uses JWT auth via headers:

- Clients should send `Authorization: Bearer <token>` (or `x-session-token: <token>`) on protected routes
- Both login and signup endpoints return a `token` field that clients should store securely
