-- AlterTable
ALTER TABLE "emergency_contacts" ADD COLUMN     "preferred_channel" "NotificationChannel" NOT NULL DEFAULT 'email';
