# Build stage
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/api-client/package.json ./packages/api-client/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install

# Copy source files
COPY packages/types ./packages/types
COPY apps/backend ./apps/backend

# Build types package
RUN pnpm --filter @solo-guardian/types build

# Generate Prisma client and build backend
WORKDIR /app/apps/backend
RUN pnpm run prisma:generate
RUN pnpm run build

# Production stage
FROM node:22-alpine AS runner

# Install pnpm for production dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/types/package.json ./packages/types/
COPY apps/backend/package.json ./apps/backend/

# Install production dependencies only
RUN pnpm install --prod

# Copy built files
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/node_modules/.prisma ./apps/backend/node_modules/.prisma
COPY apps/backend/prisma ./apps/backend/prisma

WORKDIR /app/apps/backend

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
