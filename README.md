# TODO App - Backend

REST API for a TODO app with user authentication.

**Tech stack:** Fastify, Prisma, PostgreSQL, JWT

## Setup

1. Install Node.js and PostgreSQL.
2. Copy `.env.example` to `.env` and fill in your PostgreSQL password and a JWT secret.
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

Frontend repository: https://github.com/xicaichong-lgtm/todo-frontend