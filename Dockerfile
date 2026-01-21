# Single stage build for pnpm monorepo
FROM node:22-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/api-client/package.json ./packages/api-client/
COPY apps/backend/package.json ./apps/backend/

# Install all dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source files
COPY packages/types ./packages/types
COPY apps/backend ./apps/backend

# Build types package
RUN pnpm --filter @solo-guardian/types build

# Generate Prisma client and build backend
WORKDIR /app/apps/backend
RUN pnpm run prisma:generate
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start the application using pnpm to handle module resolution
CMD ["pnpm", "run", "start:prod"]
