FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY utils ./utils

RUN npm run build
RUN npm prune --omit=dev && npm cache clean --force

FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 5001
CMD ["dist/src/main.js"]
