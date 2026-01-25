# Multi-stage build for NestJS backend
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# ---- Dependencies ----
FROM base AS dependencies

# Copy package files for all workspaces
COPY packages/types/package.json ./packages/types/
COPY packages/api-client/package.json ./packages/api-client/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM base AS build

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages ./packages
COPY --from=dependencies /app/apps/backend/node_modules ./apps/backend/node_modules

# Copy source code
COPY packages/types ./packages/types
COPY apps/backend ./apps/backend

# Build shared packages first
WORKDIR /app/packages/types
RUN pnpm run build

# Build backend
WORKDIR /app/apps/backend
RUN pnpm run build

# Generate Prisma client
RUN pnpm run prisma:generate

# ---- Production ----
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install wget for healthcheck
RUN apk add --no-cache wget

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/node_modules ./node_modules
COPY --from=build /app/apps/backend/package.json ./package.json
COPY --from=build /app/apps/backend/prisma ./prisma

# Set production environment
ENV NODE_ENV=production

# Expose port (default 3000, can be overridden)
EXPOSE 3000

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
