# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:18-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Stage 3: Runtime
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
CMD ["node", "dist/src/apps/mooc/backend/start"]
