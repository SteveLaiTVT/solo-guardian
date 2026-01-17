-- ============================================================
-- Migration: Add Linked Contact Fields
-- @task TASK-065
-- @design_state_version 3.9.0
-- ============================================================

-- Add linked user fields to emergency_contacts
ALTER TABLE "emergency_contacts" ADD COLUMN "linked_user_id" TEXT;
ALTER TABLE "emergency_contacts" ADD COLUMN "invitation_token" TEXT;
ALTER TABLE "emergency_contacts" ADD COLUMN "invitation_sent_at" TIMESTAMP(3);
ALTER TABLE "emergency_contacts" ADD COLUMN "invitation_accepted_at" TIMESTAMP(3);

-- Add unique constraint on invitation_token
CREATE UNIQUE INDEX "emergency_contacts_invitation_token_key" ON "emergency_contacts"("invitation_token");

-- Add index for efficient queries on linked contacts
CREATE INDEX "emergency_contacts_linked_user_id_idx" ON "emergency_contacts"("linked_user_id");

-- Add foreign key for linked user
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_linked_user_id_fkey" FOREIGN KEY ("linked_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
