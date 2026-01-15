-- Fix unique constraints to allow soft-deleted contacts to be re-added
-- Drop existing unique constraints that don't consider deletedAt

DROP INDEX IF EXISTS "emergency_contacts_user_id_email_key";
DROP INDEX IF EXISTS "emergency_contacts_user_id_priority_key";

-- Create partial unique indexes that only apply to non-deleted contacts
-- This allows users to re-add the same email or priority after deleting a contact

CREATE UNIQUE INDEX "emergency_contacts_user_id_email_active_key"
ON "emergency_contacts" ("user_id", "email")
WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX "emergency_contacts_user_id_priority_active_key"
ON "emergency_contacts" ("user_id", "priority")
WHERE "deleted_at" IS NULL;

-- Add index for efficient queries on active contacts
CREATE INDEX IF NOT EXISTS "emergency_contacts_user_id_deleted_at_idx"
ON "emergency_contacts" ("user_id", "deleted_at");
