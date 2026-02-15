# PockerPlay Backend

Backend REST API and realtime server for PockerPlay, a 2-player guessing game. The API serves data to client app in realtime wia Websockets. the Game is still in WIP (work in progress)

## Objectives

- Provide low-latency realtime game coordination over WebSocket.
- Persist game state (users, sessions, rounds, choices, guesses, scores) in PostgreSQL.
- Offer REST endpoints for CRUD operations and server-side validation.
- Keep gameplay responsive with HTTP caching, compression, and request throttling.

## Tech Stack

- Node.js + TypeScript
- NestJS 10 (`@nestjs/common`, `@nestjs/core`, `@nestjs/websockets`, `@nestjs/sequelize`)
- Socket.IO (gateway transport)
- Sequelize + `sequelize-typescript`
- PostgreSQL (`pg`, `pg-hstore`)
- Validation: `class-validator`, `class-transformer`
- Security and performance: `helmet`, `compression`, cache-manager, throttler
- Testing: Jest + Supertest

## Project Structure

text
src/
	app.module.ts
	main.ts
	common/
		http-cache.interceptor.ts
	game/
		game.gateway.ts
		game.service.ts
	users/
	choice/
	guess/
	gameRound/
	score/
test/
	app.e2e-spec.ts
scripts/
	create_project_db.sh
```

## Runtime Architecture

- HTTP API: Nest controllers under resource routes (`/users`, `/choice`, `/guess`, `/game-round`, `/score`).
- Realtime gateway: `src/game/game.gateway.ts` handles game session events via Socket.IO.
- Database: Sequelize async config via environment variables, with SSL enabled automatically for production / Neon hosts.
- Global features:
	- ValidationPipe (`whitelist`, `forbidNonWhitelisted`, `transform`)
	- Throttling guard (`RATE_LIMIT_TTL`, `RATE_LIMIT_MAX`)
	- HTTP cache interceptor for eligible GET requests
	- CORS support with comma-separated `CORS_ORIGIN`

## Environment Variables

Create `.env` in the backend root:

```bash
NODE_ENV=development
PORT=5001

DATABASE=your_db_name
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
HOST=localhost
DB_PORT=5432

CORS_ORIGIN=http://localhost:3000

RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

CACHE_TTL=30
CACHE_MAX=100
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure PostgreSQL database and env vars.

	 Optional helper script for local DB/user creation on macOS:

```bash
bash scripts/create_project_db.sh
```

3. Start in development mode:

```bash
npm run start:dev
```

## NPM Scripts

- `npm run start` — start server
- `npm run start:dev` — dev watch mode
- `npm run start:debug` — debug + watch
- `npm run build` — compile to `dist/`
- `npm run start:prod` — run compiled app
- `npm run lint` — lint with auto-fix
- `npm run lint:check` — lint without changes
- `npm test` — unit tests
- `npm run test:watch` — unit tests in watch mode
- `npm run test:cov` — coverage report
- `npm run test:e2e` — e2e test suite

## Realtime Events (Socket.IO)

Handled in `game.gateway.ts`:

- Client -> Server: `init`, `joingame`, `generate`, `send_choice`, `send_guess`, `myDM`, `currentGame`, `disconnected`
- Server -> Client: `init`, `notify`, `round`, `receive_choice`, `receive_guess`, `endGame`, `myDM`, `currentGame`, `disconnection`

## Testing Notes

- Unit tests run with Jest from `src/**/*.spec.ts`.
- E2E tests run from `test/**/*.e2e-spec.ts` using `test/jest-e2e.json`.
- E2E tests may require a reachable database configuration because `AppModule` initializes Sequelize.

## Deployment Notes

- CORS supports multiple origins via comma-separated `CORS_ORIGIN`.
- `trust proxy` is enabled for reverse-proxy deployments.
- Graceful shutdown hooks are enabled.

## License

UNLICENSED
