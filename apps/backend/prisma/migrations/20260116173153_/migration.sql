/*
  Warnings:

  - The `preferred_channel` column on the `emergency_contacts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "emergency_contacts" DROP COLUMN "preferred_channel",
ADD COLUMN     "preferred_channel" "NotificationChannel" NOT NULL DEFAULT 'email';
