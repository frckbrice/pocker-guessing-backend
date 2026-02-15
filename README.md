# PockerPlay Backend

## Overview

PockerPlay is a realtime two-player guessing game. This backend powers the game flow, sockets, and persistence for rounds, choices, guesses, and scores.

## Project Goal

Provide a fast, reliable API and realtime gateway using Websockets API for the PockerPlay client so players can create choices, exchange guesses, and track scores across 5 rounds.

## Features

- Realtime gameplay via WebSockets.
- REST endpoints for game, rounds, choices, guesses, and scores.
- Sequelize-based persistence for PostgreSQL.

## Tech Stack

- NestJS, TypeScript
- @nestjs/websockets with Socket.IO client
- Sequelize and sequelize-typescript

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file in this directory with:

```bash
DATABASE=your_db_name
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
HOST=localhost
DB_PORT=5432
PORT=3001
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
CACHE_TTL=30
CACHE_MAX=100
```

### Run in Development

```bash
npm run start:dev
```

## Scripts

- `npm run start` - Start the app.
- `npm run start:dev` - Start with watch mode.
- `npm run build` - Build the app.
- `npm test` - Run unit tests.
- `npm run test:e2e` - Run e2e tests.
- `npm run lint` - Lint and fix.
- `npm run lint:check` - Lint without fixing.

## Live Site

https://pockerplay.vercel.app/

## License

UNLICENSED
# pocker-guessing-backend
# pocker-guessing-backend
