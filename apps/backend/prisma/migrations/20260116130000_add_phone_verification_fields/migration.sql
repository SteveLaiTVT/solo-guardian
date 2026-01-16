-- AlterTable: Add phone verification fields to emergency_contacts
-- @task TASK-036

ALTER TABLE "emergency_contacts" ADD COLUMN     "phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone_otp" TEXT,
ADD COLUMN     "phone_otp_expires_at" TIMESTAMP(3),
ADD COLUMN     "preferred_channel" TEXT NOT NULL DEFAULT 'email';
