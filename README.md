# React Gym AI Planner

AI-powered workout planner built with a React frontend and an Express + Prisma backend. Users authenticate with Neon Auth, complete an onboarding form, and receive a generated training plan based on their goals, schedule, equipment, and experience level.

## Overview

The app currently supports this flow:

1. User signs in with Neon Auth.
2. User completes onboarding with training preferences.
3. Frontend saves the profile to the backend.
4. Backend generates a structured training plan with an LLM through OpenRouter.
5. Frontend loads and displays the latest saved plan, including plan version history metadata.

## Tech Stack

- Frontend: React 19, TypeScript, Vite, React Router
- Styling: Tailwind CSS v4
- Backend: Express 5, TypeScript, Prisma
- Database: PostgreSQL
- Auth: Neon Auth UI / `@neondatabase/neon-js`
- AI generation: OpenAI SDK pointed at OpenRouter
- Package manager: pnpm

## Features

- Landing page with product overview
- Neon Auth-based sign-in flow
- Onboarding form for training preferences
- Profile persistence with Prisma
- AI-generated weekly training plan
- Plan regeneration with version incrementing
- Responsive plan display with exercise tables and progression notes

## Project Structure

```text
.
|-- src/                 # Vite + React frontend
|   |-- components/      # Layout and UI primitives
|   |-- context/         # Auth/session + current plan state
|   |-- lib/             # Frontend API/auth clients
|   `-- pages/           # Home, auth, onboarding, profile, account
|-- server/              # Express API + Prisma
|   |-- prisma/          # Prisma schema and migrations
|   `-- src/
|       |-- lib/         # Env loading, Prisma client, AI integration
|       `-- routes/      # /api/profile and /api/plan
`-- Dockerfile
```

## Routes

Frontend routes:

- `/` landing page
- `/onboarding` onboarding form and plan generation flow
- `/profile` current generated plan
- `/auth/:pathname` auth screens
- `/account/:pathname` account screens

Backend routes:

- `POST /api/profile` save or update the user profile
- `POST /api/plan/generate` generate and persist a new plan version
- `GET /api/plan/current?userId=...` fetch the latest plan

## Environment Variables

Create a `.env` or `.env.local` file at the repo root. The backend also checks `server/.env` and `server/.env.local`, but keeping env in the root is the simplest setup.

Frontend:

- `VITE_NEON_AUTH_URL` Neon Auth project URL
- `VITE_API_URL` optional API base URL

Backend:

- `DATABASE_URL` PostgreSQL connection string
- `OPEN_ROUTER_KEY` OpenRouter API key
- `BASE_URL` optional app URL sent as the request referer header to OpenRouter
- `PORT` optional backend port, defaults to `3001` in local development

Example:

```bash
VITE_NEON_AUTH_URL=https://your-neon-auth-url
VITE_API_URL=http://localhost:3001
DATABASE_URL=postgresql://user:password@localhost:5432/react_gym_ai_planner
OPEN_ROUTER_KEY=your-openrouter-key
BASE_URL=http://localhost:3001
PORT=3001
```

## Local Development

### 1. Install dependencies

At the repo root:

```bash
pnpm install
```

Inside the backend:

```bash
cd server
pnpm install
```

### 2. Generate the Prisma client

From the `server` directory:

```bash
pnpm dlx prisma generate
```

### 3. Apply migrations

From the `server` directory:

```bash
pnpm dlx prisma migrate deploy
```

For local development with a fresh database, `prisma migrate dev` is also valid.

### 4. Start the frontend

From the repo root:

```bash
pnpm dev
```

This starts Vite on its default port, usually `5173`.

### 5. Start the backend

From the `server` directory:

```bash
pnpm dev
```

This starts the Express API on `http://localhost:3001` unless `PORT` is overridden.

## Available Scripts

Root:

- `pnpm dev` start the Vite dev server
- `pnpm build` type-check and build the frontend
- `pnpm typecheck` run the TypeScript project build
- `pnpm lint` run Biome with write mode enabled
- `pnpm preview` preview the production frontend build

Server:

- `pnpm dev` run the backend with `tsx watch`
- `pnpm typecheck` type-check the backend project

## Database Schema

Current Prisma models:

- `user_profiles`
  - stores onboarding answers such as goal, experience, days per week, session length, equipment, injuries, and preferred split
- `training_plans`
  - stores generated plan JSON, serialized plan text, version, and creation timestamp

Plans are versioned per user. Every regeneration creates a new `training_plans` record with an incremented `version`.

## How Plan Generation Works

1. The frontend submits onboarding data to `POST /api/profile`.
2. The frontend requests `POST /api/plan/generate`.
3. The backend loads the stored profile from PostgreSQL.
4. The backend builds a structured prompt and sends it to OpenRouter using the OpenAI SDK.
5. The LLM returns JSON for:
   - `overview`
   - `weeklySchedule`
   - `progression`
6. The backend normalizes and persists the response.
7. The frontend requests the latest plan and renders it on `/profile`.
