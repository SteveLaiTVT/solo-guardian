-- ============================================================
-- Migration: Flexible Auth Identifiers
-- @task TASK-075
-- Description: Add username and phone fields, make email optional
-- ============================================================

-- AlterTable: Make email nullable (optional)
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable: Add username field
ALTER TABLE "users" ADD COLUMN "username" TEXT;

-- AlterTable: Add phone field
ALTER TABLE "users" ADD COLUMN "phone" TEXT;

-- CreateIndex: Unique constraint on username
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex: Unique constraint on phone
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex: Index on username for faster lookups
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex: Index on phone for faster lookups
CREATE INDEX "users_phone_idx" ON "users"("phone");
