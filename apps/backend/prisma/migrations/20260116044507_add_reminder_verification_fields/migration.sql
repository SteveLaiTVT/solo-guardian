-- AlterTable
ALTER TABLE "check_in_settings" ADD COLUMN     "last_reminder_sent_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "emergency_contacts" ADD COLUMN     "verification_token" TEXT,
ADD COLUMN     "verification_token_expires_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "emergency_contacts_verification_token_idx" ON "emergency_contacts"("verification_token");
