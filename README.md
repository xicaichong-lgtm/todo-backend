# TODO App - Backend

REST API for a TODO app with user authentication.

**Live API:** https://todo-backend-ibcp.onrender.com
**Live app:** https://todo-frontend-rzw4.onrender.com
**Frontend repository:** https://github.com/xicaichong-lgtm/todo-frontend

> Hosted on free tiers: the first request can take up to a minute while the server wakes up.

**Tech stack:** Fastify, Prisma, PostgreSQL, JWT

## Run locally

1. Install Node.js and PostgreSQL.
2. Copy `.env.example` to `.env` and fill in the values.
3. Install dependencies and set up the database:

```
npm install
npx prisma migrate dev
npx prisma generate
```

4. Start the server (runs on http://localhost:3000):

```
npx tsx index.ts
```

## Environment variables


| Name | Description |
|------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign login tokens |
| `FRONTEND_URL` | Frontend address allowed by CORS (default `http://localhost:3001`) |
| `PORT` | Server port (default `3000`) |

## API

| Method | Endpoint | Description | Login required |
|--------|----------|-------------|----------------|
| POST | /auth/register | Create an account | No |
| POST | /auth/login | Log in and receive a token | No |
| GET | /todos | List your TODOs | Yes |
| POST | /todos | Add a TODO | Yes |
| PATCH | /todos/:id | Mark a TODO done or not done | Yes |
| DELETE | /todos/:id | Delete a TODO | Yes |

Protected endpoints need the header `Authorization: Bearer <token>`.

## Deployment

- Web service on Render (build: `npm install --include=dev && npx prisma generate`, start: `npx tsx index.ts`)
- PostgreSQL on Neon (tables created with `npx prisma migrate deploy`)