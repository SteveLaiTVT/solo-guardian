-- ============================================================
-- Migration: Add RBAC and Caregiver Support
-- @task TASK-046
-- @design_state_version 3.7.0
-- ============================================================

-- Create UserRole enum
CREATE TYPE "UserRole" AS ENUM ('user', 'caregiver', 'admin', 'super_admin');

-- Create UserStatus enum
CREATE TYPE "UserStatus" AS ENUM ('active', 'suspended', 'deleted');

-- Add role and status columns to users
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'user';
ALTER TABLE "users" ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'active';

-- Create indexes for performance
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_status_idx" ON "users"("status");

-- Create caregiver_relations table
CREATE TABLE "caregiver_relations" (
    "id" TEXT NOT NULL,
    "caregiver_id" TEXT NOT NULL,
    "elder_id" TEXT NOT NULL,
    "is_accepted" BOOLEAN NOT NULL DEFAULT false,
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caregiver_relations_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint
CREATE UNIQUE INDEX "caregiver_relations_caregiver_id_elder_id_key" ON "caregiver_relations"("caregiver_id", "elder_id");

-- Add indexes
CREATE INDEX "caregiver_relations_caregiver_id_idx" ON "caregiver_relations"("caregiver_id");
CREATE INDEX "caregiver_relations_elder_id_idx" ON "caregiver_relations"("elder_id");

-- Add foreign keys
ALTER TABLE "caregiver_relations" ADD CONSTRAINT "caregiver_relations_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "caregiver_relations" ADD CONSTRAINT "caregiver_relations_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
